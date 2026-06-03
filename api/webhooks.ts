import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-signature, x-request-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];

    if (!xSignature || !xRequestId) {
      console.warn('Webhook Mercado Pago recusado: Faltando cabeçalhos de segurança (x-signature ou x-request-id).');
      return res.status(400).json({ error: 'Missing security headers' });
    }

    // A assinatura tem o formato "ts=TIMESTAMP,v1=HASH"
    const tsMatch = xSignature.match(/ts=([^,]+)/);
    const v1Match = xSignature.match(/v1=([^,]+)/);

    const ts = tsMatch ? tsMatch[1] : '';
    const v1 = v1Match ? v1Match[1] : '';

    if (!ts || !v1) {
      return res.status(400).json({ error: 'Formato de x-signature inválido' });
    }

    // O id do evento geralmente vem em req.body.data.id ou req.query['data.id']
    const dataId = req.body?.data?.id || req.query?.['data.id'] || '';

    // Monta o "manifesto" id:requestId:ts (modelo mais recente de validação)
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Webhook Mercado Pago recusado: A variável MERCADOPAGO_WEBHOOK_SECRET não está configurada no backend.');
      return res.status(500).json({ error: 'Internal Server Error - Secret missing' });
    }

    // Cria o HMAC usando a secret com o algoritmo sha256
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(manifest);
    const signature = hmac.digest('hex');

    // Validação estrita
    if (signature !== v1) {
      console.error('Webhook Mercado Pago recusado: Assinatura inválida! Possível tentativa de fraude.');
      console.log('Manifest esperado:', manifest);
      return res.status(401).json({ error: 'Assinatura inválida. Acesso negado.' });
    }

    console.log(`Webhook Mercado Pago Validado com Sucesso! (Evento ID: ${dataId})`);
    console.log('Detalhes do evento:', req.body);

    // TODO: Adicionar lógica para atualizar status de pedido no banco de dados, se aplicável.

    // Responder com sucesso para que o Mercado Pago saiba que recebemos
    return res.status(200).json({ success: true, message: 'Webhook recebido e autenticado com sucesso.' });
  } catch (error: any) {
    console.error('Erro no processamento do Webhook Mercado Pago:', error);
    return res.status(500).json({ error: 'Erro interno no processamento' });
  }
}
