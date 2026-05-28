import { getEfiInstance, isMockMode } from './_efi.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { txid, created } = req.query;

  if (!txid) {
    return res.status(400).json({ error: 'txid é obrigatório' });
  }

  // MOCK MODE FOR EASY DEVELOPMENT
  if (isMockMode() || txid.startsWith('mock_')) {
    // Simula confirmação após 10 segundos com base no timestamp enviado pelo cliente
    const creationTime = Number(created) || Date.now();
    const elapsedTime = (Date.now() - creationTime) / 1000;

    if (elapsedTime >= 10) {
      return res.status(200).json({
        success: true,
        status: 'CONCLUIDA',
        mock: true
      });
    } else {
      return res.status(200).json({
        success: true,
        status: 'ATIVA',
        timeLeft: Math.max(0, Math.round(10 - elapsedTime)),
        mock: true
      });
    }
  }

  try {
    const efi = getEfiInstance();
    if (!efi) {
      throw new Error('Instância Efí não inicializada');
    }

    const response = await efi.pixDetailCharge({ txid });

    return res.status(200).json({
      success: true,
      status: response.status, // ativa, concluida, removida pelo usuario, etc.
    });
  } catch (error: any) {
    console.error('Erro ao consultar status do Pix:', error);
    return res.status(500).json({ 
      error: 'Erro ao consultar status no Efí Bank', 
      details: error.message || error 
    });
  }
}
