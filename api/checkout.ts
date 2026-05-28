import { products } from './_products.js';
import { getEfiInstance, isMockMode } from './_efi.js';
import { sendConfirmationEmail } from './_email.js';
import {
  isAppmaxMockMode,
  createAppmaxCustomer,
  createAppmaxOrder,
  tokenizeAppmaxCard,
  processAppmaxCreditCardPayment
} from './_appmax.js';

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

  const { productSlug, buyer, paymentMethod, card, installments, billingAddress } = req.body;

  if (!productSlug || !buyer || !paymentMethod) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
  }

  // Busca o produto no banco de dados para segurança de preço
  const product = products.find((p: any) => p.slug === productSlug);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  const pixPrice = product.price * 0.98;
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
    } catch (error: any) {
      console.error('Erro no processamento do checkout Pix:', error);
      return res.status(500).json({
        error: 'Erro ao processar o pagamento Pix',
        details: error.message || error
      });
    }
  }

  // 2. PROCESSO DE PAGAMENTO CARTÃO DE CRÉDITO (APPMAX TRANSPARENTE)
  if (paymentMethod === 'credit_card' || paymentMethod === 'card') {
    if (isAppmaxMockMode()) {
      console.warn('Appmax API: Iniciando em modo MOCK. Nenhuma credencial de produção configurada no .env.');
      try {
        await sendConfirmationEmail({
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          productSlug: product.slug,
          productName: product.name,
          productPrice: product.price,
          orderId: 'mock_appmax_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          paymentMethod: 'credit_card'
        });
      } catch (err) {
        console.error('Erro ao enviar e-mail mockado de cartão (Appmax):', err);
      }

      return res.status(200).json({
        success: true,
        paymentMethod: 'credit_card',
        status: 'approved',
        mock: true,
      });
    }

    if (!card || !installments) {
      return res.status(400).json({ error: 'Dados do cartão ou parcelamento ausentes' });
    }

    try {
      // Step A: Cadastrar cliente
      const customerId = await createAppmaxCustomer({
        name: buyer.name,
        email: buyer.email,
        cpf: buyer.cpf,
        phone: buyer.phone,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        billingAddress: {
          street: billingAddress?.street || 'Av. Paulista',
          number: billingAddress?.number ? String(billingAddress.number) : '1000',
          complement: billingAddress?.complement || '',
          neighborhood: billingAddress?.neighborhood || 'Bela Vista',
          zipcode: billingAddress?.zipcode ? billingAddress.zipcode.replace(/\D/g, '') : '01310100',
          city: billingAddress?.city || 'São Paulo',
          state: billingAddress?.state || 'SP'
        }
      });

      // Step B: Criar pedido
      const orderId = await createAppmaxOrder(customerId, {
        slug: product.slug,
        name: product.name,
        price: product.price,
        appmaxSku: product.appmaxSku
      });

      // Step C: Tokenizar cartão
      const cardToken = await tokenizeAppmaxCard({
        number: card.number,
        holderName: card.holderName,
        cvv: card.cvv,
        expirationMonth: Number(card.expirationMonth),
        expirationYear: Number(card.expirationYear)
      });

      // Step D: Processar pagamento
      const paymentResult = await processAppmaxCreditCardPayment({
        orderId,
        customerId,
        cardToken,
        cvv: card.cvv,
        holderName: card.holderName,
        holderDocumentNumber: buyer.cpf,
        installments: Number(installments) || 1
      });

      const status = paymentResult.status;

      if (status === 'approved' || status === 'paid' || status === 'confirmado') {
        try {
          await sendConfirmationEmail({
            buyerName: buyer.name,
            buyerEmail: buyer.email,
            productSlug: product.slug,
            productName: product.name,
            productPrice: product.price,
            orderId: String(orderId),
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
        orderId
      });
    } catch (error: any) {
      console.error('Erro no processamento do checkout Appmax:', error);
      return res.status(500).json({
        error: 'Erro ao processar o pagamento do cartão de crédito',
        details: error.message || error
      });
    }
  }

  return res.status(400).json({ error: 'Método de pagamento inválido' });
}
