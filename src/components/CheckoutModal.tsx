import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Lock, 
  Copy, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import type { Product } from '../data/products';
// @ts-ignore
import EfiPay from 'payment-token-efi';

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
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardExpiryMonth, setCardExpiryMonth] = useState('');
  const [cardExpiryYear, setCardExpiryYear] = useState('');
  const [cardInstallments, setCardInstallments] = useState('1');





  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.substring(i, i + 4));
    }
    setCardNumber(parts.join(' ').substring(0, 19));
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCardCvv(raw.substring(0, 4));
  };

  const getInstallmentOptions = () => {
    const options = [];
    const monthlyRate = 0.0299; // 2.99% ao mês

    for (let i = 1; i <= 12; i++) {
      let value = product.price;
      if (i > 1) {
        // Tabela Price (Juros Compostos)
        value = product.price * (monthlyRate * Math.pow(1 + monthlyRate, i)) / (Math.pow(1 + monthlyRate, i) - 1);
      }
      const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      options.push({
        value: String(i),
        label: `${i}x de ${formattedValue}`
      });
    }
    return options;
  };





  // Pix Payment Data from API
  const [pixCopyPaste, setPixCopyPaste] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Polling ref
  const pollingIntervalRef = useRef<any>(null);

  // Pix countdown state
  const [timeLeft, setTimeLeft] = useState<number>(600);

  // Clean polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Timer countdown for Pix
  useEffect(() => {
    let timerInterval: any = null;
    if (currentStep === 'pix_waiting') {
      setTimeLeft(600); // 10 minutos
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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





  // Helper functions for mathematical CPF/CNPJ verification
  const isValidCPF = (cpf: string): boolean => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(clean)) return false; // Sequence of same digits

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(clean.charAt(i)) * (10 - i);
    }
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(clean.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(clean.charAt(i)) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(clean.charAt(10))) return false;

    return true;
  };

  const isValidCNPJ = (cnpj: string): boolean => {
    const clean = cnpj.replace(/\D/g, '');
    if (clean.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(clean)) return false; // Sequence of same digits

    let size = clean.length - 2;
    let numbers = clean.substring(0, size);
    const digits = clean.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = clean.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
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
    
    // Validação matemática do documento
    if (cleanCpfCnpj.length === 11 && !isValidCPF(cleanCpfCnpj)) {
      setErrorMessage('CPF inválido. Por favor, verifique os números digitados.');
      return false;
    }
    if (cleanCpfCnpj.length === 14 && !isValidCNPJ(cleanCpfCnpj)) {
      setErrorMessage('CNPJ inválido. Por favor, verifique os números digitados.');
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

  // Submit Card Order - Appmax Transparent Checkout
  const handleCardCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      setErrorMessage('Por favor, insira um número de cartão válido.');
      return;
    }
    if (!cardHolderName.trim()) {
      setErrorMessage('Por favor, insira o nome do titular do cartão.');
      return;
    }
    if (!cardExpiryMonth || !cardExpiryYear) {
      setErrorMessage('Por favor, selecione o mês e o ano de vencimento.');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setErrorMessage('Por favor, insira o código de segurança (CVV) válido.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

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
          paymentMethod: 'credit_card',
          installments: parseInt(cardInstallments, 10),
          card: {
            number: cardNumber.replace(/\s/g, ''),
            holderName: cardHolderName,
            cvv: cardCvv,
            expirationMonth: parseInt(cardExpiryMonth, 10),
            expirationYear: parseInt(cardExpiryYear, 10)
          }
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || 'Erro ao processar o pagamento no cartão.');
      }

      if (data.status === 'approved' || data.status === 'paid' || data.status === 'confirmado') {
        setCurrentStep('success');
        setTimeout(() => {
          onClose();
          navigate('/obrigado');
        }, 3000);
      } else {
        throw new Error(`O pagamento está com status: ${data.status}. Por favor, verifique os dados do cartão.`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Houve um erro ao processar o pagamento. Verifique seus dados e tente novamente.');
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
                  <form onSubmit={handleCardCheckout} className="space-y-5 pt-2">
                    {/* DADOS DO CARTÃO */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 pb-1 border-b border-slate-100">
                        <CreditCard className="w-4 h-4 text-accent-blue" />
                        <h5 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">
                          Dados do Cartão de Crédito
                        </h5>
                      </div>

                      {/* Nome do Titular */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Nome no Cartão
                        </label>
                        <input
                          type="text"
                          required
                          value={cardHolderName}
                          onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
                          placeholder="Como impresso no cartão"
                          className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all outline-none"
                        />
                      </div>

                      {/* Número do Cartão */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="0000 0000 0000 0000"
                          className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all outline-none"
                        />
                      </div>

                      {/* Vencimento e CVV Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1 col-span-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Mês
                          </label>
                          <select
                            required
                            value={cardExpiryMonth}
                            onChange={(e) => setCardExpiryMonth(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all bg-white outline-none"
                          >
                            <option value="">Mês</option>
                            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1 col-span-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Ano
                          </label>
                          <select
                            required
                            value={cardExpiryYear}
                            onChange={(e) => setCardExpiryYear(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all bg-white outline-none"
                          >
                            <option value="">Ano</option>
                            {Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() + i)).map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1 col-span-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            CVV
                          </label>
                          <input
                            type="text"
                            required
                            value={cardCvv}
                            onChange={handleCardCvvChange}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all outline-none"
                          />
                        </div>
                      </div>

                      {/* Parcelas */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Opções de Parcelamento
                        </label>
                        <select
                          required
                          value={cardInstallments}
                          onChange={(e) => setCardInstallments(e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-sm transition-all bg-white outline-none"
                        >
                          {getInstallmentOptions().map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>



                    {/* Botão de Finalização */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-accent-blue hover:bg-accent-blue-dark text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-none outline-none"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processando Pagamento...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Pagar com Segurança</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Pix Waiting Area */}
          {currentStep === 'pix_waiting' && (
            <div className="space-y-6 text-center py-4">
              {timeLeft === 0 ? (
                <div className="space-y-4 py-6">
                  <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-display font-bold text-slate-800 text-sm">O tempo para pagamento expirou</h5>
                    <p className="text-slate-500 text-xs max-w-xs mx-auto">Não se preocupe! Você pode voltar e gerar um novo código ou escolher pagar com cartão.</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer border-none"
                  >
                    Gerar novo pagamento
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <span className="bg-emerald-500/10 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/10 inline-flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                      Aguardando Pagamento Pix
                    </span>
                    <h4 className="font-display font-extrabold text-slate-900 text-lg">
                      Escaneie o QR Code ou Copie o código
                    </h4>
                  </div>

                  {/* Timer display */}
                  <div className="space-y-1 bg-slate-50 border border-slate-100 p-3 rounded-2xl max-w-[200px] mx-auto">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">O QR Code expira em</p>
                    <p className="text-lg font-mono font-bold text-emerald-600">
                      {formatTime(timeLeft)}
                    </p>
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

                  {/* Back/Change method button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (pollingIntervalRef.current) {
                          clearInterval(pollingIntervalRef.current);
                          pollingIntervalRef.current = null;
                        }
                        setCurrentStep('payment');
                      }}
                      className="text-slate-500 hover:text-slate-700 text-xs font-semibold underline cursor-pointer border-none bg-transparent"
                    >
                      Voltar e escolher outra forma de pagamento
                    </button>
                  </div>
                </>
              )}
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
