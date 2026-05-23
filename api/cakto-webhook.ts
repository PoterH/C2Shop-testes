import { products } from './_products.js';
import { sendConfirmationEmail } from './_email.js';

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

  try {
    const payload = req.body;
    console.log('--- RECEBIDO WEBHOOK DA CAKTO ---');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const data = payload.data || {};

    const eventType = payload.event || payload.event_type || data.event || data.event_type || payload.status || '';
    const status = payload.status || data.status || data.order?.status || '';

    // Verifica se a transação está aprovada ou paga
    const isApproved = 
      ['approved', 'paid', 'completed', 'paid_out', 'confirmed', 'purchase_approved'].includes(status.toLowerCase()) ||
      ['sale.approved', 'order.approved', 'order.paid', 'payment.success', 'approved', 'paid', 'purchase_approved'].includes(eventType.toLowerCase()) ||
      status.toLowerCase().includes('approv') ||
      status.toLowerCase().includes('paid') ||
      eventType.toLowerCase().includes('approv') ||
      eventType.toLowerCase().includes('paid');

    console.log(`Evento: "${eventType}" | Status: "${status}" | Aprovado: ${isApproved}`);

    if (!isApproved) {
      console.log('Transação não está aprovada/paga. Ignorando processamento.');
      return res.status(200).json({ success: true, message: 'Evento ignorado (não aprovado)' });
    }

    // Extração robusta de dados do comprador
    const email = 
      payload.buyer?.email || payload.customer?.email || payload.email || payload.payer?.email ||
      data.buyer?.email || data.customer?.email || data.email || data.payer?.email;
      
    const name = 
      payload.buyer?.name || payload.customer?.name || payload.name || payload.payer?.name ||
      data.buyer?.name || data.customer?.name || data.name || data.payer?.name || 'Cliente';
    
    // Extração robusta do slug ou identificador do produto
    const productSlug = 
      payload.product?.slug || payload.product?.id || payload.product_id || payload.items?.[0]?.id || payload.offer?.product_id ||
      data.product?.slug || data.product?.id || data.product_id || data.items?.[0]?.id || data.offer?.product_id;
      
    const orderId = 
      payload.id || payload.order_id || payload.reference ||
      data.id || data.order_id || data.reference || data.order?.id ||
      'cakto_' + Math.random().toString(36).substring(2, 10).toUpperCase();

    console.log(`Dados extraídos -> Comprador: "${name}" | Email: "${email}" | Produto/Slug: "${productSlug}" | Pedido: "${orderId}"`);

    if (!email) {
      console.error('E-mail do comprador ausente no payload do webhook.');
      return res.status(400).json({ error: 'E-mail do comprador não encontrado no payload' });
    }

    if (!productSlug) {
      console.error('Identificador do produto (slug/id) ausente no payload do webhook.');
      return res.status(400).json({ error: 'Identificador do produto não encontrado no payload' });
    }

    // Procura o produto no banco de dados local
    // Mapeamos para bater tanto com slug quanto com id
    const product = products.find((p: any) => 
      p.slug === productSlug || 
      p.id === productSlug || 
      (payload.product?.name && p.name.toLowerCase().includes(payload.product.name.toLowerCase()))
    );

    if (!product) {
      console.error(`Produto correspondente a "${productSlug}" não encontrado em nossa base de dados.`);
      return res.status(404).json({ error: `Produto não encontrado para a chave: ${productSlug}` });
    }

    console.log(`Produto correspondente encontrado: "${product.name}" (Slug: ${product.slug})`);

    // Dispara o e-mail de entrega via Resend
    const emailRes = await sendConfirmationEmail({
      buyerName: name,
      buyerEmail: email,
      productSlug: product.slug,
      productName: product.name,
      productPrice: product.price,
      orderId: String(orderId),
      paymentMethod: 'credit_card' // cakto handles credit card payments
    });

    if (emailRes.success) {
      console.log(`Entrega do software concluída com sucesso para o e-mail: ${email}`);
      return res.status(200).json({ success: true, message: 'Entrega enviada com sucesso' });
    } else {
      console.error('Falha ao disparar o e-mail de confirmação via Resend:', emailRes.error);
      return res.status(500).json({ error: 'Falha no envio do e-mail de entrega', details: emailRes.error });
    }
  } catch (error: any) {
    console.error('Erro geral ao processar o webhook da Cakto:', error);
    return res.status(500).json({ error: 'Erro interno no processamento', details: error.message || error });
  }
}
