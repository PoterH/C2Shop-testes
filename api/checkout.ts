import { products } from './_products.js';
import { getEfiInstance, isMockMode } from './_efi.js';
import { sendConfirmationEmail } from './_email.js';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export default async function handler(req: any, res: any) {
  // Configuração de CORS para desenvolvimento local
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { productSlug, buyer, paymentMethod, paymentToken, installments, billingAddress, paymentMethodId, deviceId } = req.body;

  if (!productSlug || !buyer || !paymentMethod) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
  }

  // Busca o produto no banco de dados para segurança de preço
  const product = products.find((p: any) => p.slug === productSlug);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  const priceStr = product.price.toFixed(2);
  const pixPrice = product.price * 0.98;
  const pixPriceStr = pixPrice.toFixed(2);
  const valueCentavos = Math.round(product.price * 100);

  // MODO MOCK AUTOMÁTICO SE CREDENCIAIS NÃO ESTIVEREM CONFIGURADAS
  if (isMockMode()) {
    console.warn('Efí SDK: Iniciando em modo MOCK. Nenhuma credencial de produção/sandbox configurada no .env.');
    if (paymentMethod === 'pix') {
      const mockTxid = 'mock_' + Math.random().toString(36).substring(2, 15);
      return res.status(200).json({
        success: true,
        paymentMethod: 'pix',
        txid: mockTxid,
        // QR Code de exemplo contendo o texto para teste
        copyPaste: `00020101021226870014br.gov.bcb.pix2565mock.sejaefi.com.br/v2/cobv/${mockTxid}5204000053039865406${pixPriceStr}5802BR5910C2Tech6009Recife62070503***6304`,
        // PNG de 1x1 pixel ou imagem genérica para não estourar a tela do cliente
        qrCodeBase64: 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wYCDw0xTzhDHgAAAAd0SU1FB+MGAg8NMSc4Qx4AAAD/SURBVHgB7dHBDcMgDETRpyt0g26QbdINukF36AalI2QJ4VCR/o3vVvgh8BkbY0zT1Fp771lr7z1r7b1nrb33rLX3nrX23rPW3nvW2nvPWnvvWWvvPWvtvWervfes/fdXKaXW2ntPa+29p7X23tNae+9prb33tNbee1pr7z2ttfceL09r7T0e/pRSaq2997TW3nta+zNrnP0k5xzH4e0/rO139vs7lVIqpdRae6+11t5rrbX3Wmvtvddae6+11t5rrbX3Wmvtvddae6+11t5rrbX3Wmvtvddae6+19t7j6W2t7cfs5zP7Mfv9nX7MfpJSaq2997TW3ntaa+89rbX3ntbee7w8APgDJzEwN54m2l0AAAAASUVORK5CYII=',
        mock: true,
      });
    } else {
      // Dispara o e-mail de teste em modo Mock para facilitar validações locais
      try {
        await sendConfirmationEmail({
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          productSlug: product.slug,
          productName: product.name,
          productPrice: product.price,
          orderId: 'mock_card_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          paymentMethod: 'credit_card'
        });
      } catch (err) {
        console.error('Erro ao enviar e-mail mockado de cartão:', err);
      }

      return res.status(200).json({
        success: true,
        paymentMethod: 'credit_card',
        status: 'approved',
        mock: true,
      });
    }
  }

  try {
    const efi = getEfiInstance();
    if (!efi) {
      throw new Error('Instância Efí não inicializada');
    }

    if (paymentMethod === 'pix') {
      const chargeBody = {
        calendario: {
          expiracao: 3600 // 1 hora
        },
        devedor: {
          cpf: buyer.cpf.replace(/\D/g, ''),
          nome: buyer.name
        },
        valor: {
          original: pixPriceStr
        },
        chave: process.env.EFI_PIX_KEY || '',
        solicitacaoPagador: `Software ${product.name} - C2Tech`
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
    } else if (paymentMethod === 'credit_card') {
      const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!mpAccessToken) {
        throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurada.');
      }

      // Inicializa o cliente do Mercado Pago
      const client = new MercadoPagoConfig({ accessToken: mpAccessToken });
      const payment = new Payment(client);

      const cleanPhone = buyer.phone.replace(/\D/g, '');
      const areaCode = cleanPhone.substring(0, 2) || '11';
      const phoneNumber = cleanPhone.substring(2) || '999999999';

      const paymentBody = {
        transaction_amount: Number(product.price),
        description: `Licença ${product.name} - C2Tech`,
        payment_method_id: paymentMethodId || 'visa',
        token: paymentToken,
        installments: Number(installments) || 1,
        payer: {
          email: buyer.email,
          first_name: buyer.name.split(' ')[0],
          last_name: buyer.name.split(' ').slice(1).join(' ') || 'Silva',
          identification: {
            type: buyer.cpf.replace(/\D/g, '').length > 11 ? 'CNPJ' : 'CPF',
            number: buyer.cpf.replace(/\D/g, '')
          }
        },
        additional_info: {
          items: [
            {
              id: product.slug,
              title: product.name,
              description: `Licença vitalícia do software ${product.name}`,
              category_id: 'software',
              quantity: 1,
              unit_price: Number(product.price)
            }
          ],
          payer: {
            first_name: buyer.name.split(' ')[0],
            last_name: buyer.name.split(' ').slice(1).join(' ') || 'Silva',
            phone: {
              area_code: areaCode,
              number: phoneNumber
            },
            address: billingAddress ? {
              zip_code: billingAddress.zipcode.replace(/\D/g, ''),
              street_name: billingAddress.street,
              street_number: String(billingAddress.number || '123')
            } : undefined
          }
        }
      };

      const requestOptions = deviceId ? {
        meliSessionId: deviceId
      } : undefined;

      const payRes = await payment.create({ body: paymentBody, requestOptions });
      const status = payRes.status || 'pending';

      // Se a cobrança de cartão for aprovada/confirmada, dispara o e-mail pelo Resend
      if (status === 'approved' || status === 'authorized') {
        try {
          await sendConfirmationEmail({
            buyerName: buyer.name,
            buyerEmail: buyer.email,
            productSlug: product.slug,
            productName: product.name,
            productPrice: product.price,
            orderId: String(payRes.id),
            paymentMethod: 'credit_card'
          });
        } catch (err) {
          console.error('Erro ao enviar e-mail de confirmação de cartão:', err);
        }
      }

      return res.status(200).json({
        success: true,
        paymentMethod: 'credit_card',
        status,
      });
    } else {
      return res.status(400).json({ error: 'Método de pagamento inválido' });
    }
  } catch (error: any) {
    console.error('Erro no processamento do checkout:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar o pagamento', 
      details: error.message || error 
    });
  }
}
