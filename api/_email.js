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
                        if (cleanVal)
                            return cleanVal;
                    }
                }
            }
        }
    }
    catch (err) {
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
                        if (cleanVal)
                            return cleanVal;
                    }
                }
            }
        }
    }
    catch (err) {
        // ignorar
    }
    return process.env.RESEND_FROM_EMAIL || 'C2Tech <onboarding@resend.dev>';
}
export async function sendConfirmationEmail({ buyerName, buyerEmail, productSlug, productName, productPrice, orderId, paymentMethod }) {
    const apiKey = getResendApiKey();
    const fromEmail = getResendFromEmail();
    const downloadUrl = getDownloadLink(productSlug);
    if (!apiKey) {
        console.error('Resend API key não configurada.');
        return { success: false, error: 'Chave API do Resend não configurada.' };
    }
    // Não gerar chaves de ativação, o download contém os arquivos de instalação e ativação
    const formattedPrice = productPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const paymentMethodLabel = paymentMethod === 'pix' ? 'Pix (Aprovação Instantânea)' : 'Cartão de Crédito';
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Entrega de Software C2Tech</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #020617; padding: 32px; text-align: center; border-bottom: 4px solid #0284c7;">
          <div style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 1px;">C2<span style="color: #0284c7;">Tech</span></div>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-size: 22px; color: #0f172a; margin-top: 0; font-weight: bold;">Olá, ${buyerName}!</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">O seu pagamento foi confirmado! O link de acesso ao Google Drive contendo todos os arquivos necessários para a instalação, ativação e o tutorial em vídeo passo a passo do seu <strong>${productName}</strong> já está liberado abaixo.</p>

          <h2 style="font-size: 16px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Detalhes do Pedido</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <th style="padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600; width: 40%;">Produto</th>
              <td style="padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500;">${productName}</td>
            </tr>
            <tr>
              <th style="padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Valor Pago</th>
              <td style="padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500;">${formattedPrice}</td>
            </tr>
            <tr>
              <th style="padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Método de Pagamento</th>
              <td style="padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500;">${paymentMethodLabel}</td>
            </tr>
            <tr>
              <th style="padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Código da Transação</th>
              <td style="padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500;"><code>${orderId}</code></td>
            </tr>
          </table>

          <h2 style="font-size: 16px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Passo a Passo de Instalação</h2>
          <div style="margin: 24px 0;">
            <div style="margin-bottom: 16px;">
              <span style="background-color: #0284c7; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-weight: bold; font-size: 13px; margin-right: 12px; vertical-align: middle;">1</span>
              <span style="font-size: 14px; color: #475569; line-height: 1.5; vertical-align: middle;">Clique no botão abaixo para acessar a pasta segura no Google Drive.</span>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="background-color: #0284c7; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-weight: bold; font-size: 13px; margin-right: 12px; vertical-align: middle;">2</span>
              <span style="font-size: 14px; color: #475569; line-height: 1.5; vertical-align: middle;">Assista ao tutorial em vídeo e leia o passo a passo para realizar a instalação e ativação corretamente.</span>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="background-color: #0284c7; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-weight: bold; font-size: 13px; margin-right: 12px; vertical-align: middle;">3</span>
              <span style="font-size: 14px; color: #475569; line-height: 1.5; vertical-align: middle;">Pronto! Use o software de forma permanente e vitalícia, sem taxas adicionais.</span>
            </div>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${downloadUrl}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff !important; text-decoration: none; padding: 16px 36px; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; border: 1px solid #0284c7; min-width: 250px; box-shadow: 0 4px 6px rgba(2, 132, 199, 0.15);"><span style="color: #ffffff; font-weight: bold; text-decoration: none;">Acessar Google Drive (Download)</span></a>
          </div>

          <p style="margin-top: 32px; font-size: 13px; color: #64748b; line-height: 1.6;">Precisando de suporte durante a instalação? Nosso suporte assistido via WhatsApp está à disposição. Basta falar diretamente conosco.</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} C2Tech. Todos os direitos reservados.</p>
          <p style="margin: 0;">Ambiente seguro e monitorado pelo Efí Bank.</p>
        </div>
      </div>
    </body>
    </html>
  `;
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
                subject: `Sua Licença Vitalícia do ${productName} está liberada! 🚀`,
                html: htmlContent
            })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Erro desconhecido ao enviar e-mail via Resend API.');
        }
        console.log(`E-mail enviado com sucesso via Resend para ${buyerEmail}. ID:`, result.id);
        return { success: true, id: result.id };
    }
    catch (error) {
        console.error('Falha ao enviar e-mail via Resend:', error);
        if (error.message && error.message.includes('Testing domain restriction')) {
            console.warn('\n--- DETECTADA RESTRIÇÃO DE DOMÍNIO DE TESTE DO RESEND ---');
            console.warn('Você tentou enviar um e-mail para um destinatário que não é o seu e-mail cadastrado usando o remetente gratuito "onboarding@resend.dev".');
            console.warn('Para enviar e-mails para qualquer cliente, você deve:');
            console.warn('1. Acessar o dashboard do Resend, ir na aba "Domains" e verificar o seu domínio de envio (ex: c2tech.shop).');
            console.warn('2. Adicionar no seu arquivo .env ou nas variáveis da Vercel:');
            console.warn('   RESEND_FROM_EMAIL="C2Tech <suporte@seu-dominio-verificado.com>"\n');
        }
        return { success: false, error: error.message || error };
    }
}
