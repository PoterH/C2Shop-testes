import EfiPay from 'sdk-node-apis-efi';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Path for decoded cert
const getCertPath = () => {
  const base64Cert = process.env.EFI_CERTIFICATE_BASE64;
  if (!base64Cert) {
    return null;
  }
  try {
    const certBuffer = Buffer.from(base64Cert, 'base64');
    const tempPath = path.join(os.tmpdir(), 'cert_efi.p12');
    fs.writeFileSync(tempPath, certBuffer);
    return tempPath;
  } catch (error) {
    console.error('Erro ao decodificar certificado EFI:', error);
    return null;
  }
};

export const isMockMode = () => {
  return !process.env.EFI_CLIENT_ID && !process.env.EFI_SANDBOX_CLIENT_ID;
};

export const getEfiInstance = () => {
  if (isMockMode()) {
    return null;
  }
  const sandbox = process.env.EFI_SANDBOX !== 'false'; // default is sandbox (true)
  const client_id = sandbox 
    ? (process.env.EFI_SANDBOX_CLIENT_ID || process.env.EFI_CLIENT_ID)
    : process.env.EFI_CLIENT_ID;
  const client_secret = sandbox 
    ? (process.env.EFI_SANDBOX_CLIENT_SECRET || process.env.EFI_CLIENT_SECRET)
    : process.env.EFI_CLIENT_SECRET;

  const certPath = getCertPath();
  if (!certPath) {
    throw new Error('Certificado EFI_CERTIFICATE_BASE64 é obrigatório para transações de produção.');
  }

  const options = {
    sandbox: sandbox,
    client_id: client_id,
    client_secret: client_secret,
    certificate: certPath,
  };
  const EfiPayClass = EfiPay as any;
  return new EfiPayClass(options);
};
