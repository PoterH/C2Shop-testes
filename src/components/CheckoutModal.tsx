import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Lock, 
  CreditCard, 
  Copy, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  MapPin, 
  Calendar, 
  ChevronLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import type { Product } from '../data/products';

interface CheckoutModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'info' | 'payment' | 'pix_waiting' | 'success';
type PaymentMethod = 'pix' | 'card';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // Steps & Tabs
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State: Personal Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');

  // Form State: Credit Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Form State: Address (Required for Card by Efí)
  const [zipcode, setZipcode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Pix Payment Data from API
  const [pixCopyPaste, setPixCopyPaste] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Polling ref
  const pollingIntervalRef = useRef<any>(null);


  // Clean polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Format Helper Masks
  const formatCPFOrCNPJ = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length <= 11) {
      // CPF: 000.000.000-00
      return raw
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ: 00.000.000/0000-00
      return raw
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length <= 10) {
      // (00) 0000-0000
      return raw
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    } else {
      // (00) 00000-0000
      return raw
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    }
  };

  const formatZipcode = (val: string) => {
    const raw = val.replace(/\D/g, '');
    return raw.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
  };

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '');
    return raw.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatCardExpiry = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length <= 2) return raw;
    return `${raw.substring(0, 2)}/${raw.substring(2, 4)}`;
  };

  // ZIP Code Auto-fill
  const handleZipcodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatZipcode(e.target.value);
    setZipcode(formatted);
    const raw = formatted.replace(/\D/g, '');
    if (raw.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      }
    }
  };

  // Step Validations
  const validateInfoStep = () => {
    if (fullName.trim().split(' ').length < 2) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMessage('Por favor, insira um e-mail válido.');
      return false;
    }
    const cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');
    if (cleanCpfCnpj.length !== 11 && cleanCpfCnpj.length !== 14) {
      setErrorMessage('Por favor, insira um CPF ou CNPJ válido.');
      return false;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setErrorMessage('Por favor, insira um telefone válido com DDD.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateCardStep = () => {
    const cleanNum = cardNumber.replace(/\D/g, '');
    if (cleanNum.length < 13 || cleanNum.length > 19) {
      setErrorMessage('Número de cartão de crédito inválido.');
      return false;
    }
    if (cardHolder.trim().split(' ').length < 2) {
      setErrorMessage('Digite o nome impresso no cartão.');
      return false;
    }
    const cleanExpiry = cardExpiry.replace(/\D/g, '');
    if (cleanExpiry.length !== 4) {
      setErrorMessage('Data de validade inválida. Use o formato MM/AA.');
      return false;
    }
    const month = parseInt(cleanExpiry.substring(0, 2), 10);
    if (month < 1 || month > 12) {
      setErrorMessage('Mês de validade deve ser entre 01 e 12.');
      return false;
    }
    if (cardCvv.length < 3 || cardCvv.length > 4) {
      setErrorMessage('CVV inválido.');
      return false;
    }
    if (!street || !number || !neighborhood || !city || !state || zipcode.replace(/\D/g, '').length !== 8) {
      setErrorMessage('Por favor, preencha todos os campos do endereço de cobrança.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  // Initiate checkout
  const handleProceedToPayment = () => {
    if (validateInfoStep()) {
      setCurrentStep('payment');
    }
  };

  // Submit Pix Order
  const handlePixCheckout = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: product.slug,
          buyer: {
            name: fullName,
            email: email,
            cpf: cpfCnpj,
            phone: phone
          },
          paymentMethod: 'pix'
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao gerar cobrança Pix.');
      }

      setPixCopyPaste(data.copyPaste);
      setPixQrCode(data.qrCodeBase64);
      setCurrentStep('pix_waiting');
      
      // Start status polling
      startPolling(data.txid, Date.now());
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Houve um erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Start polling checkout status
  const startPolling = (txid: string, creationTime: number) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout-status?txid=${txid}&created=${creationTime}`);
        const data = await res.json();
        
        if (data.success && data.status === 'CONCLUIDA') {
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          
          // Dispara o envio de e-mail de confirmação no backend
          try {
            await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                txid,
                productSlug: product.slug,
                buyer: {
                  name: fullName,
                  email,
                  phone
                }
              })
            });
          } catch (emailErr) {
            console.error('Erro ao chamar api/send-email:', emailErr);
          }

          setCurrentStep('success');
          
          // Redirect to thank you page after 3 seconds of success screen
          setTimeout(() => {
            onClose();
            navigate('/obrigado');
          }, 3000);
        }
      } catch (error) {
        console.error('Erro na verificação de status do pagamento:', error);
      }
    }, 3000);
  };

  // Submit Card Order
  const handleCardCheckout = async () => {
    if (!validateCardStep()) return;
    setLoading(true);
    setErrorMessage(null);

    const mpPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || 'mock_payee_code';

    // Get brand or default to visa
    const cardNumClean = cardNumber.replace(/\D/g, '');
    let brand = 'visa';

    // Improved local detection fallback (mapping to Mercado Pago identifiers, e.g., 'master' instead of 'mastercard')
    const getLocalCardBrand = (num: string): string => {
      if (/^4/.test(num)) return 'visa';
      if (/^(5[1-5]|2[2-7])/.test(num)) return 'master';
      if (/^3[47]/.test(num)) return 'amex';
      if (/^(5067|5090|6277|6363|6362|504175|438935|4011|431274|451416|457393|4576|650|651|655)/.test(num)) return 'elo';
      if (/^(606282|3841)/.test(num)) return 'hipercard';
      if (/^(30[0-5]|309|36|38|39)/.test(num)) return 'diners';
      if (/^(6042|6043|6044)/.test(num)) return 'cabal';
      return 'visa';
    };

    brand = getLocalCardBrand(cardNumClean);

    // Try to resolve exact payment method ID from Mercado Pago API if public key is available
    if (mpPublicKey && mpPublicKey !== 'mock_payee_code' && cardNumClean.length >= 6) {
      try {
        const bin = cardNumClean.substring(0, 6);
        const searchRes = await fetch(`https://api.mercadopago.com/v1/payment_methods/search?public_key=${mpPublicKey}&bins=${bin}`);
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const matchedMethod = searchData.results?.find((item: any) => item.payment_type_id === 'credit_card');
          if (matchedMethod && matchedMethod.id) {
            brand = matchedMethod.id;
            console.log('Resolvida bandeira pelo Mercado Pago:', brand);
          }
        }
      } catch (err) {
        console.warn('Erro ao consultar bandeira na API do Mercado Pago:', err);
      }
    }

    try {
      let paymentToken = 'mock_token_cc_' + Math.random().toString(36).substring(2, 15);
      
      // Attempt actual tokenization if mpPublicKey is available and not a mock value
      if (mpPublicKey && mpPublicKey !== 'mock_payee_code') {
        try {
          const cleanExpiry = cardExpiry.replace(/\D/g, '');
          const month = cleanExpiry.substring(0, 2);
          const year = '20' + cleanExpiry.substring(2, 4);
          const docNumber = cpfCnpj.replace(/\D/g, '');
          const docType = docNumber.length > 11 ? 'CNPJ' : 'CPF';

          const tokenRes = await fetch(`https://api.mercadopago.com/v1/card_tokens?public_key=${mpPublicKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              card_number: cardNumClean,
              expiration_month: parseInt(month, 10),
              expiration_year: parseInt(year, 10),
              security_code: cardCvv,
              cardholder: {
                name: cardHolder,
                identification: {
                  type: docType,
                  number: docNumber
                }
              }
            })
          });

          const tokenResult = await tokenRes.json();
          if (!tokenRes.ok || !tokenResult.id) {
            const errMsg = tokenResult.cause?.[0]?.description || tokenResult.message || 'Dados de cartão inválidos.';
            throw new Error(errMsg);
          }

          paymentToken = tokenResult.id;
        } catch (tokErr: any) {
          console.warn('Falha na tokenização Mercado Pago. Prosseguindo com fallback de tokenização:', tokErr);
          if (mpPublicKey && mpPublicKey !== 'mock_payee_code') {
            throw new Error(tokErr?.message || 'Os dados do cartão de crédito são inválidos ou recusados pelo Mercado Pago para geração do token seguro.');
          }
        }
      }

      const deviceId = (window as any).MP_DEVICE_SESSION_ID || (window as any).MP_DEVICE_TOKEN || null;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: product.slug,
          buyer: {
            name: fullName,
            email: email,
            cpf: cpfCnpj,
            phone: phone
          },
          paymentMethod: 'credit_card',
          paymentToken,
          paymentMethodId: brand,
          installments: parseInt(installments, 10),
          deviceId,
          billingAddress: {
            street,
            number,
            neighborhood,
            zipcode,
            city,
            state
          }
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar pagamento por cartão.');
      }

      if (data.status === 'approved' || data.status === 'paid' || data.status === 'confirmado') {
        setCurrentStep('success');
        setTimeout(() => {
          onClose();
          navigate('/obrigado');
        }, 3000);
      } else {
        setErrorMessage(`Pagamento não aprovado. Status: ${data.status || 'Pendente'}. Por favor, verifique os dados do cartão.`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Erro ao processar transação de cartão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Copy Pix code to clipboard
  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // Pricing math
  const formattedPrice = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const pixDiscountPrice = product.price * 0.98;
  const formattedPixPrice = pixDiscountPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const installmentOptions = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    if (num === 1) {
      const value = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return { num, value, label: `1x de ${value}` };
    }
    
    // Taxa de juros padrão de mercado para parcelamento assumido pelo comprador (ex: 2.99% a.m.)
    const monthlyRate = 0.0299;
    const factor = (monthlyRate * Math.pow(1 + monthlyRate, num)) / (Math.pow(1 + monthlyRate, num) - 1);
    const installmentValue = product.price * factor;
    
    const valueStr = installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return { 
      num, 
      value: valueStr, 
      label: `${num}x de ${valueStr}` 
    };
  });

  const cardButtonLabel = 'Finalizar Compra';

  return (
    <>
      {/* Backdrop Blur Overlay - click-through enabled */}
      <div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px] pointer-events-none transition-all duration-300" />

      {/* Floating Modal Wrapper */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-4 pointer-events-none">
        
        {/* Modal Container */}
        <div className="relative w-full bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest bg-accent-blue/10 px-2 py-0.5 rounded">
              Checkout Seguro
            </span>
            <h3 className="font-display font-bold text-slate-900 text-lg mt-1 truncate max-w-[280px]">
              {product.name}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-800 text-xs font-semibold rounded-2xl border border-red-100 flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* STEP 1: Seus Dados */}
          {currentStep === 'info' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-display font-bold text-slate-800 text-sm">
                  1. Identificação do Comprador
                </h4>
                <p className="text-slate-500 text-xs">
                  Os dados abaixo são necessários para emissão da licença e nota fiscal.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Nome Completo */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: João Silva Santos"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">E-mail para entrega</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: joao@exemplo.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Certifique-se de digitar o e-mail correto para receber os links de acesso instantaneamente.</p>
                </div>

                {/* Grid CPF e Celular */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">CPF ou CNPJ</label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        value={cpfCnpj}
                        onChange={(e) => setCpfCnpj(formatCPFOrCNPJ(e.target.value))}
                        placeholder="Ex: 000.000.000-00"
                        maxLength={18}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">WhatsApp / Celular</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        placeholder="Ex: (81) 99999-9999"
                        maxLength={15}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Total display & continue */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Valor total</span>
                  <span className="text-xl font-display font-black text-slate-900">{formattedPrice}</span>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="px-6 py-3 bg-accent-blue hover:bg-accent-blue-dark text-white font-bold rounded-2xl text-sm transition-all shadow-md cursor-pointer"
                >
                  Ir para Pagamento
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Pagamento */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              
              {/* Back to Info Button */}
              <button 
                onClick={() => setCurrentStep('info')} 
                className="flex items-center text-xs text-slate-500 hover:text-slate-700 font-semibold"
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" />
                Alterar dados pessoais
              </button>

              <div className="space-y-4">
                <h4 className="font-display font-bold text-slate-800 text-sm">
                  2. Escolha como pagar
                </h4>
                
                {/* Method selector tabs */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'pix' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Pix (2% de Desconto)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'card' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Cartão de Crédito
                  </button>
                </div>
 
                {/* Pix Area */}
                {paymentMethod === 'pix' && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-slate-700 leading-relaxed space-y-1">
                      <p className="font-bold text-emerald-800 flex items-center">
                        ⚡ Desconto Exclusivo Pix
                      </p>
                      <p>
                        Ganhe 2% de desconto exclusivo pagando via Pix! O pagamento é aprovado imediatamente e o acesso será enviado ao seu e-mail em segundos.
                      </p>
                    </div>
 
                    <button
                      onClick={handlePixCheckout}
                      disabled={loading}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Gerando Pix Seguro...</span>
                        </>
                      ) : (
                        <span>Gerar QR Code Pix de {formattedPixPrice}</span>
                      )}
                    </button>
                  </div>
                )}

                {/* Credit Card Area */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-2">
                    
                    {/* Card fields */}
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Número do Cartão</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nome do Titular (Como no cartão)</label>
                        <input 
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="Ex: JOÃO S SANTOS"
                          className="w-full px-4 py-3 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Validade</label>
                          <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                              placeholder="MM/AA"
                              maxLength={5}
                              className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">CVV</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              placeholder="123"
                              maxLength={4}
                              className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Installments */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Parcelamento</label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm bg-white transition-all"
                        >
                          {installmentOptions.map((opt) => (
                            <option key={opt.num} value={opt.num}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Address Block (Required by Efí card API to prevent fraud) */}
                    <div className="border-t border-slate-100 pt-4 mt-2 space-y-3.5">
                      <h5 className="text-xs font-bold text-slate-800 flex items-center">
                        <MapPin className="w-4 h-4 text-slate-500 mr-1.5 shrink-0" />
                        Endereço de Cobrança
                      </h5>

                      <div className="grid grid-cols-3 gap-3.5">
                        <div className="space-y-1 col-span-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CEP</label>
                          <input 
                            type="text"
                            value={zipcode}
                            onChange={handleZipcodeChange}
                            placeholder="00000-000"
                            maxLength={9}
                            className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all"
                          />
                        </div>

                        <div className="space-y-1 col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rua / Logradouro</label>
                          <input 
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="Rua..."
                            className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3.5">
                        <div className="space-y-1 col-span-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Número</label>
                          <input 
                            type="text"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="123"
                            className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all"
                          />
                        </div>

                        <div className="space-y-1 col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bairro</label>
                          <input 
                            type="text"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            placeholder="Centro"
                            className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all"
                          />
                        </div>

                        <div className="space-y-1 col-span-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UF</label>
                          <input 
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value.toUpperCase())}
                            placeholder="PE"
                            maxLength={2}
                            className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs text-center transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cidade</label>
                        <input 
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Recife"
                          className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCardCheckout}
                      disabled={loading}
                      className="w-full py-4 bg-accent-blue hover:bg-accent-blue-dark text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processando Cartão Seguro...</span>
                        </>
                      ) : (
                        <span>{cardButtonLabel}</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Pix Waiting Area */}
          {currentStep === 'pix_waiting' && (
            <div className="space-y-6 text-center py-4">
              <div className="space-y-2">
                <span className="bg-emerald-500/10 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/10 inline-flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                  Aguardando Pagamento Pix
                </span>
                <h4 className="font-display font-extrabold text-slate-900 text-lg">
                  Escaneie o QR Code ou Copie o código
                </h4>
              </div>

              {/* QR Code Container */}
              <div className="mx-auto w-48 h-48 bg-slate-50 border border-slate-100 rounded-3xl p-3 shadow-inner flex items-center justify-center">
                {pixQrCode ? (
                  <img 
                    src={pixQrCode.startsWith('data:') || pixQrCode.startsWith('http') ? pixQrCode : `data:image/png;base64,${pixQrCode}`}
                    alt="QR Code Pix"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                )}
              </div>

              {/* Copy Paste Code */}
              <div className="space-y-2">
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Você também pode pagar copiando e colando a chave abaixo no aplicativo do seu banco.
                </p>
                <div className="flex items-center space-x-2 max-w-sm mx-auto bg-slate-50 border border-slate-200/60 p-2 rounded-2xl">
                  <input
                    type="text"
                    readOnly
                    value={pixCopyPaste}
                    className="flex-1 bg-transparent text-xs text-slate-600 outline-none select-all truncate pl-1 border-none focus:ring-0"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-accent-blue rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                    title="Copiar Pix"
                  >
                    {copied ? (
                      <span className="text-[10px] font-bold text-emerald-600 px-1">Copiado!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Safety badge */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm mx-auto flex items-center justify-center space-x-2 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Ambiente Criptografado e Monitorado pelo Efí Bank</span>
              </div>
            </div>
          )}

          {/* STEP 4: Success State */}
          {currentStep === 'success' && (
            <div className="text-center py-10 space-y-6 animate-scale-in">
              <div className="mx-auto w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-lg">
                <CheckCircle2 className="w-12 h-12 animate-soft-pulse" />
              </div>

              <div className="space-y-2">
                <h4 className="font-display font-extrabold text-slate-900 text-2xl">
                  Pagamento Confirmado!
                </h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Sua transação foi processada com sucesso no Efí Bank. Estamos gerando sua licença e enviando os arquivos de acesso para o seu e-mail.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm mx-auto text-xs text-slate-500">
                Redirecionando em instantes...
              </div>
            </div>
          )}

        </div>

        {/* Footer info badge */}
        {currentStep !== 'success' && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center space-x-2 text-[10px] text-slate-450 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>Processado de forma 100% segura e confidencial</span>
          </div>
        )}

      </div>
    </div>
  </>
);
};
