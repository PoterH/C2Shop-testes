import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api/checkout-status')) {
            const urlObj = new URL(req.url, 'http://localhost');
            const created = Number(urlObj.searchParams.get('created')) || Date.now();
            const elapsedTime = (Date.now() - created) / 1000;

            res.setHeader('Content-Type', 'application/json');
            if (elapsedTime >= 10) {
              res.end(JSON.stringify({
                success: true,
                status: 'CONCLUIDA',
                mock: true
              }));
            } else {
              res.end(JSON.stringify({
                success: true,
                status: 'ATIVA',
                timeLeft: Math.max(0, Math.round(10 - elapsedTime)),
                mock: true
              }));
            }
            return;
          }

          if (req.url === '/api/checkout' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                const { paymentMethod } = parsed;
                res.setHeader('Content-Type', 'application/json');
                
                if (paymentMethod === 'pix') {
                  const mockTxid = 'mock_' + Math.random().toString(36).substring(2, 15);
                  const copyPasteVal = `00020101021226870014br.gov.bcb.pix2565mock.sejaefi.com.br/v2/cobv/${mockTxid}5204000053039865406137.905802BR5910C2Tech6009Recife62070503***6304`;
                  res.end(JSON.stringify({
                    success: true,
                    paymentMethod: 'pix',
                    txid: mockTxid,
                    copyPaste: copyPasteVal,
                    qrCodeBase64: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(copyPasteVal)}`,
                    mock: true
                  }));
                } else {
                  // Dispara o envio do e-mail de forma assíncrona em segundo plano para o cartão mockado
                  (async () => {
                    try {
                      const { sendConfirmationEmail } = await server.ssrLoadModule('./api/_email.ts');
                      const { products } = await server.ssrLoadModule('./src/data/products.ts');

                      const product = products.find((p: any) => p.slug === parsed.productSlug);
                      if (product && parsed.buyer) {
                        await sendConfirmationEmail({
                          buyerName: parsed.buyer.name,
                          buyerEmail: parsed.buyer.email,
                          productSlug: product.slug,
                          productName: product.name,
                          productPrice: product.price,
                          orderId: 'mock_card_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
                          paymentMethod: 'credit_card'
                        });
                      }
                    } catch (emailErr) {
                      console.error('Erro ao enviar e-mail de cartão em modo mock:', emailErr);
                    }
                  })();

                  res.end(JSON.stringify({
                    success: true,
                    paymentMethod: 'credit_card',
                    status: 'approved',
                    mock: true
                  }));
                }
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              }
            });
            return;
          }

          if (req.url === '/api/send-email' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body);
                const { txid, productSlug, buyer } = parsed;

                // Carrega dinamicamente a função de envio de e-mail e a lista de produtos
                const { sendConfirmationEmail } = await server.ssrLoadModule('./api/_email.ts');
                const { products } = await server.ssrLoadModule('./src/data/products.ts');

                const product = products.find((p: any) => p.slug === productSlug);
                res.setHeader('Content-Type', 'application/json');

                if (!product) {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'Produto não encontrado' }));
                  return;
                }

                // Dispara o e-mail real utilizando a API Key e template configurado
                const emailResult = await sendConfirmationEmail({
                  buyerName: buyer.name,
                  buyerEmail: buyer.email,
                  productSlug: product.slug,
                  productName: product.name,
                  productPrice: product.price,
                  orderId: txid,
                  paymentMethod: 'pix'
                });

                if (!emailResult.success) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: emailResult.error }));
                } else {
                  res.end(JSON.stringify({ success: true, message: 'E-mail enviado com sucesso via local mock API!' }));
                }
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message || 'Erro interno ao processar e-mail local' }));
              }
            });
            return;
          }

          next();
        });
      }
    }
  ],
})

