import { products } from './_products.js';
import { sendConfirmationEmail } from './_email.js';

export default async function handler(req: any, res: any) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const payload = req.body;
    console.log('--- RECEBIDO WEBHOOK DA APPMAX ---');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const data = payload.data || {};

    const event = (payload.event || payload.event_type || data.event || data.event_type || '').toLowerCase();
    const status = (payload.status || data.status || data.order?.status || payload.order_status || '').toLowerCase();

    // Check if approved or paid
    const isApproved =
      ['approved', 'paid', 'completed', 'confirmed', 'pago', 'aprovado', 'autorizado', 'pedido_pago', 'pedido_aprovado'].includes(status) ||
      ['order_paid', 'order_approved', 'payment_approved', 'pedido aprovado', 'pedido pago', 'pedido_pago', 'pedido_aprovado'].includes(event) ||
      status.includes('approv') ||
      status.includes('paid') ||
      status.includes('pago') ||
      status.includes('autorizado');

    console.log(`Evento: "${event}" | Status: "${status}" | Aprovado: ${isApproved}`);

    if (!isApproved) {
      console.log('Transação da Appmax não está aprovada/paga. Ignorando processamento.');
      return res.status(200).json({ success: true, message: 'Evento ignorado (não aprovado)' });
    }

    // Robust extraction of customer details
    const email =
      payload.customer?.email || data.customer?.email ||
      payload.buyer?.email || data.buyer?.email ||
      payload.email || data.email ||
      payload.customer_email || data.customer_email;

    const firstname = payload.customer?.firstname || data.customer?.firstname || payload.buyer?.firstname || '';
    const lastname = payload.customer?.lastname || data.customer?.lastname || payload.buyer?.lastname || '';
    let name = payload.customer?.name || data.customer?.name || payload.buyer?.name || data.buyer?.name || '';
    
    if (!name && (firstname || lastname)) {
      name = `${firstname} ${lastname}`.trim();
    }
    if (!name) {
      name = 'Cliente';
    }

    // Robust extraction of product SKU/Slug
    // Appmax sends products in an array, or sometimes directly
    const productsArray = payload.products || data.products || payload.items || data.items || [];
    let productSku = '';
    
    if (productsArray.length > 0) {
      productSku = productsArray[0].sku || productsArray[0].id || productsArray[0].product_id || '';
    }
    if (!productSku) {
      productSku = payload.sku || data.sku || payload.product_sku || data.product_sku || payload.product_id || data.product_id || '';
    }

    const orderId =
      payload.order_id || data.order_id ||
      payload.id || data.id ||
      payload.order?.id || data.order?.id ||
      'appmax_' + Math.random().toString(36).substring(2, 10).toUpperCase();

    console.log(`Dados extraídos -> Comprador: "${name}" | Email: "${email}" | SKU/Slug: "${productSku}" | Pedido: "${orderId}"`);

    if (!email) {
      console.error('E-mail do comprador ausente no payload do webhook.');
      return res.status(400).json({ error: 'E-mail do comprador não encontrado no payload' });
    }

    if (!productSku) {
      console.error('SKU/Slug do produto ausente no payload do webhook.');
      return res.status(400).json({ error: 'SKU/Slug do produto não encontrado no payload' });
    }

    // Match product in local DB using slug or appmaxSku
    const product = products.find((p: any) =>
      p.slug === productSku ||
      p.appmaxSku === productSku ||
      p.id === productSku ||
      (productsArray[0]?.name && p.name.toLowerCase().includes(productsArray[0].name.toLowerCase()))
    );

    if (!product) {
      console.error(`Produto correspondente a "${productSku}" não encontrado na base de dados.`);
      return res.status(404).json({ error: `Produto não encontrado para a chave: ${productSku}` });
    }

    console.log(`Produto correspondente encontrado: "${product.name}" (Slug: ${product.slug})`);

    // Deliver email confirmation via Resend
    const emailRes = await sendConfirmationEmail({
      buyerName: name,
      buyerEmail: email,
      productSlug: product.slug,
      productName: product.name,
      productPrice: product.price,
      orderId: String(orderId),
      paymentMethod: 'credit_card'
    });

    if (emailRes.success) {
      console.log(`Entrega do software concluída com sucesso para o e-mail: ${email}`);
      return res.status(200).json({ success: true, message: 'Entrega enviada com sucesso' });
    } else {
      console.error('Falha ao disparar o e-mail de confirmação via Resend:', emailRes.error);
      return res.status(500).json({ error: 'Falha no envio do e-mail de entrega', details: emailRes.error });
    }
  } catch (error: any) {
    console.error('Erro geral ao processar o webhook da Appmax:', error);
    return res.status(500).json({ error: 'Erro interno no processamento', details: error.message || error });
  }
}
