import fs from 'fs';
import path from 'path';

// Helper to retrieve the Access Token from .env or environment
function getAppmaxToken(): string {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('APPMAX_ACCESS_TOKEN=')) {
          const val = trimmed.substring('APPMAX_ACCESS_TOKEN='.length);
          if (val) {
            const cleanVal = val.replace(/^['"]|['"]$/g, '').trim();
            if (cleanVal) return cleanVal;
          }
        }
      }
    }
  } catch (err) {
    console.error('Erro ao ler token da Appmax do arquivo .env:', err);
  }
  return process.env.APPMAX_ACCESS_TOKEN || '';
}

// Check if we are running in simulated mock mode (if token is empty or dummy)
export function isAppmaxMockMode(): boolean {
  const token = getAppmaxToken();
  return !token || token.startsWith('YOUR_') || token.includes('SEU_TOKEN') || token === 'mock';
}

const BASE_URL = 'https://admin.appmax.com.br/api/v3';

// Base API requester
async function requestAppmax(endpoint: string, payload: any) {
  const token = getAppmaxToken();
  const url = `${BASE_URL}${endpoint}`;
  
  const body = {
    'access-token': token,
    ...payload
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok || data.success === false || data.status === 'fail') {
    // Attempt to extract descriptive validation or system errors
    let errMsg = '';
    if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      errMsg = Object.entries(data.data)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
        .join('; ');
    }
    
    const finalMessage = errMsg 
      || data.text
      || data.message 
      || data.error?.message 
      || data.error 
      || `Erro na chamada Appmax v3 ${endpoint} (Status ${response.status})`;
      
    throw new Error(finalMessage);
  }
  return data;
}

// 1. Cadastrar Cliente (POST /customer) - Appmax v3
export async function createAppmaxCustomer(buyer: {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  ip?: string;
  billingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    zipcode: string;
    city: string;
    state: string;
  };
}) {
  const nameParts = buyer.name.trim().split(/\s+/);
  const firstname = nameParts[0];
  const lastname = nameParts.slice(1).join(' ') || nameParts[0];
  const cleanCpf = buyer.cpf.replace(/\D/g, '');
  const cleanPhone = buyer.phone.replace(/\D/g, '');
  const cleanZip = buyer.billingAddress.zipcode.replace(/\D/g, '');

  const payload = {
    firstname: firstname,
    lastname: lastname,
    email: buyer.email,
    telephone: cleanPhone,
    document_number: cleanCpf,
    postcode: cleanZip,
    address_street: buyer.billingAddress.street,
    address_street_number: buyer.billingAddress.number,
    address_street_complement: buyer.billingAddress.complement || '',
    address_street_district: buyer.billingAddress.neighborhood,
    address_city: buyer.billingAddress.city,
    address_state: buyer.billingAddress.state
  };

  const res = await requestAppmax('/customer', payload);
  return res.data?.id;
}

// 2. Criar Pedido (POST /order) - Appmax v3
export async function createAppmaxOrder(
  customerId: number,
  productsList: Array<{
    slug: string;
    name: string;
    price: number;
    appmaxSku?: string;
  }>,
  coupon?: string
) {
  const applyDiscount = coupon === 'OFF10' && productsList.length > 1;

  const productsPayload = productsList.map((product) => {
    const sku = product.appmaxSku || product.slug;
    const finalPrice = applyDiscount ? Number((product.price * 0.90).toFixed(2)) : product.price;

    return {
      sku: sku,
      name: `Licença ${product.name}`,
      qty: 1,
      price: finalPrice,
      digital_product: 1
    };
  });

  const payload = {
    customer_id: customerId,
    products: productsPayload
  };

  const res = await requestAppmax('/order', payload);
  return res.data?.id;
}

// 3. Tokenizar Cartão (POST /tokenize/card) - Appmax v3
export async function tokenizeAppmaxCard(card: {
  number: string;
  holderName: string;
  cvv: string;
  expirationMonth: number;
  expirationYear: number;
}) {
  const cleanNumber = card.number.replace(/\D/g, '');
  let year = card.expirationYear;
  if (year < 100) {
    year = 2000 + year;
  }

  const payload = {
    card: {
      name: card.holderName,
      number: cleanNumber,
      cvv: card.cvv,
      month: card.expirationMonth,
      year: year
    }
  };

  const res = await requestAppmax('/tokenize/card', payload);
  return res.data?.token;
}

// 4. Efetuar o Pagamento (POST /payment/credit-card) - Appmax v3
export async function processAppmaxCreditCardPayment(params: {
  orderId: number;
  customerId: number;
  cardToken: string;
  cvv: string;
  holderName: string;
  holderDocumentNumber: string;
  installments: number;
}) {
  const payload = {
    cart: {
      order_id: params.orderId
    },
    customer: {
      customer_id: params.customerId
    },
    payment: {
      method: 'credit-card',
      CreditCard: {
        token: params.cardToken,
        cvv: params.cvv,
        document_number: params.holderDocumentNumber.replace(/\D/g, ''),
        name: params.holderName,
        installments: params.installments
      }
    }
  };

  const res = await requestAppmax('/payment/credit-card', payload);
  return {
    status: res.data?.status || 'pending',
    transactionId: res.data?.id
  };
}
