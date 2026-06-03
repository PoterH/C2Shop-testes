import { products } from './_products.js';
import { getEfiInstance, isMockMode } from './_efi.js';
import { sendConfirmationEmail } from './_email.js';
import { MercadoPagoConfig, Payment, PreApproval, Order } from 'mercadopago';

export default async function handler(req: any, res: any) {
  // CORS configuration for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }


  const { 
    productSlug, 
    products: items, 
    coupon, 
    buyer, 
    paymentMethod, 
    card, 
    installments, 
    billingAddress, 
    subOption,
    paymentToken,
    paymentMethodId,
    deviceId
  } = req.body;

  if ((!productSlug && (!items || !Array.isArray(items))) || !buyer || !paymentMethod) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
  }

  // Backwards compatibility for single productSlug and array of products
  let checkoutItems: Array<{ slug: string }> = [];
  if (items && Array.isArray(items)) {
    checkoutItems = items;
  } else if (productSlug) {
    checkoutItems = [{ slug: productSlug }];
  }

  // Find all products in local DB
  const matchedProducts: any[] = [];
  for (const item of checkoutItems) {
    const matched = products.find((p: any) => p.slug === item.slug);
    if (!matched) {
      return res.status(404).json({ error: `Produto não encontrado: ${item.slug}` });
    }
    matchedProducts.push(matched);
  }

  // Math calculations
  let subtotal = 0;
  let isSubPayment = false;
  let recurrence = false;

  const firstProduct = matchedProducts[0];
  if (firstProduct && firstProduct.isSubscription) {
    isSubPayment = true;
    recurrence = subOption === 'recurrent';
    subtotal = recurrence ? (firstProduct.recurrencePrice || firstProduct.price) : firstProduct.price;
  } else {
    subtotal = matchedProducts.reduce((sum, p) => sum + p.price, 0);
  }

  let discountAmount = 0;
  let finalTotal = subtotal;

  // Coupon OFF10 rule: 10% discount for more than 1 item in the cart (only if not subscription)
  if (!isSubPayment && coupon === 'OFF10' && matchedProducts.length > 1) {
    discountAmount = subtotal * 0.10;
    finalTotal = subtotal - discountAmount;
  }

  const pixPrice = isSubPayment ? finalTotal : (finalTotal * 0.98);
  const pixPriceStr = pixPrice.toFixed(2);

  // 1. PROCESSO DE PAGAMENTO PIX (EFI BANK)
  if (paymentMethod === 'pix') {
    if (isMockMode()) {
      console.warn('Efí SDK: Iniciando em modo MOCK. Nenhuma credencial de produção/sandbox configurada no .env.');
      const mockTxid = 'mock_' + Math.random().toString(36).substring(2, 15);
      return res.status(200).json({
        success: true,
        paymentMethod: 'pix',
        txid: mockTxid,
        copyPaste: `00020101021226870014br.gov.bcb.pix2565mock.sejaefi.com.br/v2/cobv/${mockTxid}5204000053039865406${pixPriceStr}5802BR5910C2Tech6009Recife62070503***6304`,
        qrCodeBase64: 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wYCDw0xTzhDHgAAAAd0SU1FB+MGAg8NMSc4Qx4AAAD/SURBVHgB7dHBDcMgDETRpyt0g26QbdINukF36AalI2QJ4VCR/o3vVvgh8BkbY0zT1Fp771lr7z1r7b1nrb33rLX3nrX23rPW3nvW2nvPWnvvWWvvPWvtvWervfes/fdXKaXW2ntPa+29p7X23tNae+9prb33tNbee1pr7z2ttfceL09r7T0e/pRSaq2997TW3nta+zNrnP0k5xzH4e0/rO139vs7lVIqpdRae6+11t5rrbX3Wmvtvddae6+11t5rrbX3Wmvtvddae6+11t5rrbX3Wmvtvddae6+19t7j6W2t7cfs5zP7Mfv9nX7MfpJSaq2997TW3ntaa+89rbX3ntbee7w8APgDJzEwN54m2l0AAAAASUVORK5CYII=',
        mock: true,
      });
    }

    try {
      const efi = getEfiInstance();
      if (!efi) {
        throw new Error('Instância Efí não inicializada');
      }

      if (isSubPayment && recurrence) {
        // ASSINATURA PIX AUTOMÁTICO (BCB RECORRENTE)
        console.log(`Efí SDK: Criando Pix Automático para ${firstProduct.name}...`);
        
        // 1. Criar localização de recorrência
        const locRes = await efi.pixCreateLocationRecurrenceAutomatic();
        const locId = locRes.id;
        if (!locId) {
          throw new Error('Falha ao gerar localização da recorrência Pix Automático');
        }

        // 2. Definir datas (dataInicial deve ser no mínimo amanhã pelas regras do Banco Central)
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const dataInicial = tomorrow.toISOString().split('T')[0];
        
        const nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 2); // 2 anos de duração do contrato de recorrência
        const dataFinal = nextYear.toISOString().split('T')[0];

        // 3. Gerar txid de 32 caracteres hexadecimal exigido pela API
        const hexTxid = Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');

        const recurrenceBody = {
          vinculo: {
            contrato: 'CTR' + Math.floor(100000 + Math.random()*900000),
            devedor: {
              cpf: buyer.cpf.replace(/\D/g, ''),
              nome: buyer.name
            },
            objeto: `Assinatura ${firstProduct.name}`.substring(0, 30)
          },
          calendario: {
            dataFinal: dataFinal,
            dataInicial: dataInicial,
            periodicidade: 'MENSAL'
          },
          valor: {
            valorRec: pixPriceStr
          },
          politicaRetentativa: 'NAO_PERMITE',
          loc: locId,
          ativacao: {
            dadosJornada: {
              txid: hexTxid
            }
          }
        };

        const recRes = await efi.pixCreateRecurrenceAutomatic({}, recurrenceBody);
        console.log("Recorrência Pix Automático criada:", JSON.stringify(recRes));

        // 4. Gerar QR Code a partir do local de recorrência
        const qrCodeRes = await efi.pixGenerateQRCode({ id: locId });

        return res.status(200).json({
          success: true,
          paymentMethod: 'pix',
          txid: hexTxid,
          copyPaste: qrCodeRes.qrcode,
          qrCodeBase64: qrCodeRes.imagemQrcode,
          isAutomaticRecurrence: true
        });
      } else {
        // COBRANÇA PIX IMEDIATA (AVULSO)
        const namesString = matchedProducts.map(p => p.name).join(', ');
        const description = (isSubPayment 
          ? `${recurrence ? 'Assinatura' : 'Plano'} ${firstProduct.name} - C2Shop` 
          : `Softwares: ${namesString} - C2Shop`
        ).substring(0, 70);

        const chargeBody = {
          calendario: {
            expiracao: 3600
          },
          devedor: {
            cpf: buyer.cpf.replace(/\D/g, ''),
            nome: buyer.name
          },
          valor: {
            original: pixPriceStr
          },
          chave: process.env.EFI_PIX_KEY || '',
          solicitacaoPagador: description
        };

        const chargeRes = await efi.pixCreateImmediateCharge({}, chargeBody);
        const locId = chargeRes.loc?.id;
        const txid = chargeRes.txid;

        if (!locId) {
          throw new Error('Falha ao gerar localização da cobrança Pix');
        }

        const qrCodeRes = await efi.pixGenerateQRCode({ id: locId });

        return res.status(200).json({
          success: true,
          paymentMethod: 'pix',
          txid: txid,
          copyPaste: qrCodeRes.qrcode,
          qrCodeBase64: qrCodeRes.imagemQrcode,
        });
      }
    } catch (error: any) {
      console.error('Erro no processamento do checkout Pix:', error);
      return res.status(500).json({
        error: 'Erro ao processar o pagamento Pix',
        details: error.message || error
      });
    }
  }

  // 2. PROCESSO DE PAGAMENTO CARTÃO DE CRÉDITO (MERCADO PAGO TRANSPARENTE VIA ORDERS)
  if (paymentMethod === 'credit_card' || paymentMethod === 'card') {
    const token = card?.token || paymentToken;
    let methodId = paymentMethodId || card?.brand || 'visa';
    if (methodId === 'mastercard') {
      methodId = 'master';
    }

    if (!token) {
      return res.status(400).json({ error: 'Token de cartão ausente para processamento no Mercado Pago' });
    }

    try {
      const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!mpAccessToken) {
        throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurada.');
      }

      const cardPrice = finalTotal;
      const client = new MercadoPagoConfig({ accessToken: mpAccessToken });

      // 2A. ASSINATURA RECORRENTE VIA MERCADO PAGO PREAPPROVAL
      if (isSubPayment) {
        const preApproval = new PreApproval(client);
        const backUrl = `https://${req.headers.host || 'c2tech.shop'}/obrigado`;

        const preApprovalBody = {
          payer_email: buyer.email,
          card_token_id: token,
          reason: 'Servicos de Tecnologia C2Tech',
          external_reference: 'sub_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          status: 'authorized',
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: Number(cardPrice.toFixed(2)),
            currency_id: 'BRL'
          },
          back_url: backUrl
        };

        const requestOptions = deviceId ? { meliSessionId: deviceId } : undefined;
        const subRes = await preApproval.create({ body: preApprovalBody, requestOptions });
        const status = subRes.status || 'authorized';

        if (status === 'authorized' || status === 'active' || status === 'approved') {
          try {
            await sendConfirmationEmail({
              buyerName: buyer.name,
              buyerEmail: buyer.email,
              products: matchedProducts.map(p => ({ slug: p.slug, name: p.name, price: p.price })),
              orderId: String(subRes.id),
              paymentMethod: 'credit_card'
            });
          } catch (err) {
            console.error('Erro ao enviar e-mail de confirmação de assinatura:', err);
          }
        }

        return res.status(200).json({
          success: true,
          paymentMethod: 'credit_card',
          status: 'approved',
          orderId: String(subRes.id)
        });
      } else {
        // 2B. COBRANÇA AVULSA (CARTÃO DE CRÉDITO) - VIA ORDERS API
        const orderClient = new Order(client);

        let allowedInstallments = Number(installments) || 1;
        if (cardPrice < 90 && allowedInstallments > 3) {
          allowedInstallments = 3;
        }

        const externalRef = 'order_' + Math.random().toString(36).substring(2, 10).toUpperCase();

        const createOrderBody = {
          type: 'online',
          processing_mode: 'manual', // Fix: must use manual for Orders API
          total_amount: cardPrice.toFixed(2), // Orders API exige string para valores
          external_reference: externalRef,
          description: 'Servicos de Tecnologia C2Tech',
          items: matchedProducts.map(p => ({
            title: p.name,
            description: p.name,
            picture_url: `https://c2tech.shop${p.image}`,
            category_id: 'electronics',
            quantity: 1,
            unit_price: p.price.toFixed(2)
          })),
          transactions: {
            payments: [
              {
                amount: cardPrice.toFixed(2), // String
                payment_method: {
                  id: methodId,
                  type: 'credit_card',
                  token: token,
                  installments: allowedInstallments,
                  statement_descriptor: 'C2TECH'
                }
              }
            ]
          },
          payer: {
            email: buyer.email,
            first_name: buyer.name.trim().split(' ')[0],
            last_name: buyer.name.trim().split(' ').slice(1).join(' ') || 'Silva',
            identification: {
              type: buyer.cpf.replace(/\D/g, '').length > 11 ? 'CNPJ' : 'CPF',
              number: buyer.cpf.replace(/\D/g, '')
            },
            address: {
              zip_code: billingAddress?.zipCode?.replace(/\D/g, '') || '01310100',
              street_name: billingAddress?.street || 'Avenida Paulista',
              street_number: billingAddress?.number || '1000',
              neighborhood: billingAddress?.neighborhood || 'Bela Vista',
              city: billingAddress?.city || 'São Paulo',
              state: billingAddress?.state || 'SP'
            },
            phone: buyer.phone ? {
              area_code: buyer.phone.replace(/\D/g, '').substring(0, 2),
              number: buyer.phone.replace(/\D/g, '').substring(2)
            } : undefined
          }
        };

        const createRequestOptions = {
          idempotencyKey: 'idemp_create_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          ...(deviceId ? { meliSessionId: deviceId } : {})
        };

        console.log('Orders API - Order.create() payload:', JSON.stringify(createOrderBody));

        // 1. Criar o pedido (Order)
        const orderRes = await orderClient.create({ body: createOrderBody, requestOptions: createRequestOptions });
        const orderId = orderRes.id;
        console.log('Orders API - Order criada com sucesso:', orderId);

        // 2. Processar o pedido
        const processRequestOptions = {
          idempotencyKey: 'idemp_process_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          ...(deviceId ? { meliSessionId: deviceId } : {})
        };
        const processRes = await orderClient.process({ id: orderId, requestOptions: processRequestOptions });
        console.log('Orders API - Order.process() resultado:', JSON.stringify({ id: processRes.id, status: processRes.status, status_detail: processRes.status_detail }));

        const status = processRes.status || 'pending';

        if (status === 'processed' || status === 'approved' || status === 'authorized' || status === 'accredited') {
          try {
            await sendConfirmationEmail({
              buyerName: buyer.name,
              buyerEmail: buyer.email,
              products: matchedProducts.map(p => ({ slug: p.slug, name: p.name, price: p.price })),
              orderId: String(processRes.id),
              paymentMethod: 'credit_card'
            });
          } catch (err) {
            console.error('Erro ao enviar e-mail de confirmação de cartão:', err);
          }
        }

        // Mapear status do Orders API (ex: 'processed'/'accredited') para o frontend entender ('approved')
        let finalFrontendStatus = status;
        if (status === 'processed') {
          finalFrontendStatus = 'approved';
        }

        return res.status(200).json({
          success: true,
          paymentMethod: 'credit_card',
          status: finalFrontendStatus,
          orderId: String(processRes.id)
        });
      }
    } catch (error: any) {
      console.error('Erro no processamento do checkout Mercado Pago (Orders API):', error);
      const errMsg = error.message || error;
      return res.status(500).json({
        error: 'Erro ao processar o pagamento do cartão de crédito no Mercado Pago via Orders API',
        details: errMsg
      });
    }
  }
  
  // 3. PROCESSO DE PAGAMENTO BOLETO (MERCADO PAGO VIA ORDERS)
  if (paymentMethod === 'boleto') {
    try {
      const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!mpAccessToken) {
        throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurada.');
      }

      const client = new MercadoPagoConfig({ accessToken: mpAccessToken });
      const orderClient = new Order(client);

      const cardPrice = finalTotal;
      const externalRef = 'order_bol_' + Math.random().toString(36).substring(2, 10).toUpperCase();

      const createOrderBody = {
        type: 'online',
        processing_mode: 'manual',
        total_amount: cardPrice.toFixed(2),
        description: 'Servicos de Tecnologia C2Tech',
        external_reference: externalRef,
        items: matchedProducts.map(p => ({
          title: p.name,
          description: p.name,
          picture_url: `https://c2tech.shop${p.image}`,
          category_id: 'electronics',
          quantity: 1,
          unit_price: p.price.toFixed(2)
        })),
        transactions: {
          payments: [
            {
              amount: cardPrice.toFixed(2),
              payment_method: {
                id: 'bolbradesco',
                type: 'ticket'
              }
            }
          ]
        },
        payer: {
          email: buyer.email,
          first_name: buyer.name.trim().split(' ')[0],
          last_name: buyer.name.trim().split(' ').slice(1).join(' ') || 'Silva',
          identification: {
            type: buyer.cpf.replace(/\D/g, '').length > 11 ? 'CNPJ' : 'CPF',
            number: buyer.cpf.replace(/\D/g, '')
          },
          address: {
            zip_code: billingAddress?.zipCode?.replace(/\D/g, '') || '01310100',
            street_name: billingAddress?.street || 'Avenida Paulista',
            street_number: billingAddress?.number || '1000',
            neighborhood: billingAddress?.neighborhood || 'Bela Vista',
            city: billingAddress?.city || 'São Paulo',
            state: billingAddress?.state || 'SP'
          },
          phone: buyer.phone ? {
            area_code: buyer.phone.replace(/\D/g, '').substring(0, 2),
            number: buyer.phone.replace(/\D/g, '').substring(2)
          } : undefined
        }
      };

      const createRequestOptions = {
        idempotencyKey: 'idemp_create_bol_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        ...(deviceId ? { meliSessionId: deviceId } : {})
      };
      
      console.log('Orders API (Boleto) - Order.create() payload:', JSON.stringify(createOrderBody));
      
      const orderRes = await orderClient.create({ body: createOrderBody, requestOptions: createRequestOptions });
      const orderId = orderRes.id;
      console.log('Orders API (Boleto) - Order criada com sucesso:', orderId);

      // Processar boleto
      const processRequestOptions = {
        idempotencyKey: 'idemp_process_bol_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        ...(deviceId ? { meliSessionId: deviceId } : {})
      };
      const processRes = await orderClient.process({ id: orderId, requestOptions: processRequestOptions });
      console.log('Orders API (Boleto) - Order.process() resultado:', JSON.stringify({ id: processRes.id, status: processRes.status, status_detail: processRes.status_detail }));

      // Se for boleto, o processamento devolve os dados em transactions.payments
      const paymentDetails = processRes.transactions?.payments?.[0] as any;
      let ticketUrl = paymentDetails?.external_resource_url || paymentDetails?.transaction_data?.ticket_url || '';
      let barcode = paymentDetails?.barcode?.content || paymentDetails?.transaction_data?.barcode || '';

      if (!ticketUrl && paymentDetails?.id) {
        const paymentClient = new Payment(client);
        try {
          const payData = await paymentClient.get({ id: paymentDetails.id }) as any;
          ticketUrl = payData.transaction_details?.external_resource_url || ticketUrl;
          barcode = payData.transaction_details?.barcode?.content || barcode;
        } catch (e) {
          console.error("Falha ao buscar detalhes do pagamento boleto:", e);
        }
      }

      return res.status(200).json({
        success: true,
        paymentMethod: 'boleto',
        status: processRes.status || 'pending',
        orderId: String(processRes.id),
        ticketUrl,
        barcode
      });
    } catch (error: any) {
      console.error('Erro no processamento do checkout Boleto Mercado Pago (Orders API):', error);
      const errMsg = error.message || error;
      return res.status(500).json({
        error: 'Erro ao gerar o boleto bancário no Mercado Pago via Orders API',
        details: errMsg
      });
    }
  }

  return res.status(400).json({ error: 'Método de pagamento inválido' });
}
