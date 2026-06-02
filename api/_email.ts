import fs from 'fs';
import path from 'path';
import { getDownloadLink } from './_downloads.js';

function getResendApiKey() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('RESEND_API_KEY=')) {
          const val = trimmed.substring('RESEND_API_KEY='.length);
          if (val) {
            const cleanVal = val.replace(/^['"]|['"]$/g, '').trim();
            if (cleanVal) return cleanVal;
          }
        }
      }
    }
  } catch (err) {
    console.error('Erro ao ler arquivo .env local:', err);
  }
  return process.env.RESEND_API_KEY || '';
}

function getResendFromEmail() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('RESEND_FROM_EMAIL=')) {
          const val = trimmed.substring('RESEND_FROM_EMAIL='.length);
          if (val) {
            const cleanVal = val.replace(/^['"]|['"]$/g, '').trim();
            if (cleanVal) return cleanVal;
          }
        }
      }
    }
  } catch (err) {
    // ignorar
  }
  return process.env.RESEND_FROM_EMAIL || 'C2Tech <onboarding@resend.dev>';
}

export async function sendConfirmationEmail({
  buyerName,
  buyerEmail,
  productSlug,
  productName,
  productPrice,
  products: items,
  orderId,
  paymentMethod
}: {
  buyerName: string;
  buyerEmail: string;
  productSlug?: string;
  productName?: string;
  productPrice?: number;
  products?: Array<{ slug: string; name: string; price: number }>;
  orderId: string;
  paymentMethod: 'pix' | 'credit_card';
}) {
  const apiKey = getResendApiKey();
  const fromEmail = getResendFromEmail();

  if (!apiKey) {
    console.error('Resend API key não configurada.');
    return { success: false, error: 'Chave API do Resend não configurada.' };
  }

  // Normalize products list for single product compatibility
  let checkoutProducts: Array<{ slug: string; name: string; price: number }> = [];
  if (items && Array.isArray(items)) {
    checkoutProducts = items;
  } else if (productSlug && productName && productPrice !== undefined) {
    checkoutProducts = [{ slug: productSlug, name: productName, price: productPrice }];
  }

  if (checkoutProducts.length === 0) {
    return { success: false, error: 'Nenhum produto fornecido para o e-mail de confirmação.' };
  }

  const paymentMethodLabel = paymentMethod === 'pix' ? 'Pix (Aprovação Instantânea)' : 'Cartão de Crédito';
  const totalPaid = checkoutProducts.reduce((sum, p) => sum + p.price, 0);
  const formattedTotalPrice = totalPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Generate dynamic product rows
  const productsTableRows = checkoutProducts.map(p => `
    <tr>
      <td style="padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500;">${p.name}</td>
      <td style="padding: 12px; text-align: right; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500;">${p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
    </tr>
  `).join('');

  // Generate dynamic download buttons
  const downloadButtonsSection = checkoutProducts.map(p => {
    const downloadUrl = getDownloadLink(p.slug);
    const isWhatsApp = downloadUrl.includes('wa.me');
    const buttonText = isWhatsApp ? 'Entrar em Contato (Ativar Conta)' : 'Acessar Google Drive (Download)';
    const headerText = isWhatsApp ? `Ativação de Conta: ${p.name}` : p.name;
    const buttonBg = isWhatsApp ? '#25d366' : '#0284c7';
    return `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 16px 0; text-align: center;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px; font-weight: bold;">${headerText}</h4>
        <a href="${downloadUrl}" target="_blank" style="display: inline-block; background-color: ${buttonBg}; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; text-align: center; border: 1px solid ${buttonBg}; min-width: 200px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);"><span style="color: #ffffff; font-weight: bold; text-decoration: none;">${buttonText}</span></a>
      </div>
    `;
  }).join('');

  const hasSubscription = checkoutProducts.some(p => p.slug === 'capcut-pro-mensal' || p.slug === 'canva-pro-mensal' || p.slug === 'autodesk-all-apps');
  const emailIntroText = hasSubscription
    ? 'O seu pagamento foi confirmado! Abaixo estão liberadas as instruções e links para ativar a sua assinatura e acessar os recursos Pro de cada um dos seus produtos adquiridos.'
    : 'O seu pagamento foi confirmado! Abaixo estão liberados os links de acesso seguro ao Google Drive contendo todos os arquivos necessários para a instalação, ativação e o tutorial em vídeo passo a passo de cada um dos seus produtos adquiridos.';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Entrega de Pedido C2Shop</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #020617; padding: 32px; text-align: center; border-bottom: 4px solid #0284c7;">
          <div style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 1px;">C2<span style="color: #0284c7;">Shop</span></div>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-size: 22px; color: #0f172a; margin-top: 0; font-weight: bold;">Olá, ${buyerName}!</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">${emailIntroText}</p>

          <h2 style="font-size: 16px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Detalhes do Pedido</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 12px 6px; text-align: left; font-size: 13px; color: #64748b; font-weight: bold; text-transform: uppercase;">Software</th>
                <th style="padding: 12px 6px; text-align: right; font-size: 13px; color: #64748b; font-weight: bold; text-transform: uppercase;">Preço</th>
              </tr>
            </thead>
            <tbody>
              ${productsTableRows}
              <tr>
                <td style="padding: 16px 6px 12px 6px; text-align: left; font-size: 14px; font-weight: bold; color: #0f172a;">Total Pago</td>
                <td style="padding: 16px 6px 12px 6px; text-align: right; font-size: 16px; font-weight: bold; color: #0284c7;">${formattedTotalPrice}</td>
              </tr>
              <tr>
                <td style="padding: 6px; text-align: left; font-size: 13px; color: #64748b;">Método de Pagamento</td>
                <td style="padding: 6px; text-align: right; font-size: 13px; color: #475569;">${paymentMethodLabel}</td>
              </tr>
              <tr>
                <td style="padding: 6px; text-align: left; font-size: 13px; color: #64748b; border-bottom: none;">Código do Pedido</td>
                <td style="padding: 6px; text-align: right; font-size: 13px; color: #475569; border-bottom: none;"><code>${orderId}</code></td>
              </tr>
            </tbody>
          </table>

          <h2 style="font-size: 16px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 36px; margin-bottom: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Links de Download e Acesso</h2>
          
          ${downloadButtonsSection}

          <h2 style="font-size: 16px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 36px; margin-bottom: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Instruções de Instalação</h2>
          <div style="margin: 20px 0;">
            <div style="margin-bottom: 16px;">
              <span style="background-color: #0284c7; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-weight: bold; font-size: 13px; margin-right: 12px; vertical-align: middle;">1</span>
              <span style="font-size: 14px; color: #475569; line-height: 1.5; vertical-align: middle;">Clique nos botões correspondentes para abrir as pastas no Google Drive.</span>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="background-color: #0284c7; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-weight: bold; font-size: 13px; margin-right: 12px; vertical-align: middle;">2</span>
              <span style="font-size: 14px; color: #475569; line-height: 1.5; vertical-align: middle;">Assista aos vídeos explicativos e siga o tutorial passo a passo para a instalação.</span>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="background-color: #0284c7; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-weight: bold; font-size: 13px; margin-right: 12px; vertical-align: middle;">3</span>
              <span style="font-size: 14px; color: #475569; line-height: 1.5; vertical-align: middle;">Pronto! Use seus softwares de forma vitalícia e definitiva.</span>
            </div>
          </div>

          <p style="margin-top: 32px; font-size: 13px; color: #64748b; line-height: 1.6;">Precisando de ajuda durante a instalação? Nosso suporte técnico via WhatsApp está à disposição para auxiliá-lo a qualquer momento. Basta entrar em contato.</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} C2Tech. Todos os direitos reservados.</p>
          <p style="margin: 0;">Ambiente seguro criptografado.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Determine email subject name
  const subjectLabel = checkoutProducts.length === 1 ? checkoutProducts[0].name : `${checkoutProducts.length} Softwares`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: buyerEmail,
        subject: `Sua Licença Vitalícia do ${subjectLabel} está liberada! 🚀`,
        html: htmlContent
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Erro desconhecido ao enviar e-mail via Resend API.');
    }

    console.log(`E-mail enviado com sucesso via Resend para ${buyerEmail}. ID:`, result.id);
    return { success: true, id: result.id };
  } catch (error: any) {
    console.error('Falha ao enviar e-mail via Resend:', error);
    return { success: false, error: error.message || error };
  }
}
