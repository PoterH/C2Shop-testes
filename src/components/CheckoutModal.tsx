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
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  initialSubOption?: 'recurrent' | 'avulso';
}

type Step = 'info' | 'payment' | 'pix_waiting' | 'boleto_waiting' | 'success';
type PaymentMethod = 'pix' | 'card' | 'boleto';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, isOpen, onClose, initialSubOption }) => {
  const navigate = useNavigate();
  const { cartItems, total, discountAmount, couponCode, clearCart } = useCart();
  const activeProduct = product || cartItems[0];
  
  // Steps & Tabs
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Boleto State
  const [boletoBarcode, setBoletoBarcode] = useState('');
  const [boletoUrl, setBoletoUrl] = useState('');
  const [copiedBarcode, setCopiedBarcode] = useState(false);

  // Success message states
  const [successTitle, setSuccessTitle] = useState('Pagamento Confirmado!');
  const [successDescription, setSuccessDescription] = useState('Sua transação foi processada com sucesso. Estamos gerando sua licença e enviando os arquivos de acesso para o seu e-mail.');

  // Form State: Personal Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [subOption, setSubOption] = useState<'recurrent' | 'avulso'>('recurrent');

  // Form State: Credit Card Info
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Masks for credit card fields
  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    return raw.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatCardExpiry = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 4);
    if (raw.length <= 2) return raw;
    return `${raw.substring(0, 2)}/${raw.substring(2, 4)}`;
  };

  const formatCardCvv = (val: string) => {
    return val.replace(/\D/g, '').substring(0, 4);
  };

  // Sincroniza a opção inicial quando o modal abre
  useEffect(() => {
    if (isOpen) {
      if (activeProduct?.isSubscription) {
        const initial = activeProduct.selectedSubOption || initialSubOption || 'recurrent';
        setSubOption(initial);
        if (initial === 'recurrent') {
          setPaymentMethod('card');
        } else {
          setPaymentMethod('pix');
        }
      } else {
        setSubOption('avulso');
        setPaymentMethod('pix');
      }
    }
  }, [initialSubOption, isOpen, activeProduct]);



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
      if (activeProduct?.isSubscription) {
        setPaymentMethod('card');
      }
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
          products: cartItems.map(item => ({ slug: item.slug })),
          coupon: couponCode || null,
          subOption: activeProduct?.isSubscription ? subOption : undefined,
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
                products: cartItems.map(item => ({ slug: item.slug, name: item.name, price: item.price })),
                subOption: activeProduct?.isSubscription ? subOption : undefined,
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

          setSuccessTitle('Pagamento Confirmado!');
          setSuccessDescription('Sua transação Pix foi processada com sucesso via Efí Bank. Estamos gerando sua licença e enviando os arquivos de acesso para o seu e-mail.');
          setCurrentStep('success');
          clearCart(); // Limpa o carrinho
          
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


  // Copy Pix code to clipboard
  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit Boleto Order
  const handleBoletoCheckout = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: cartItems.map(item => ({ slug: item.slug })),
          coupon: couponCode || null,
          buyer: {
            name: fullName,
            email: email,
            cpf: cpfCnpj,
            phone: phone
          },
          paymentMethod: 'boleto'
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao gerar boleto bancário.');
      }

      setBoletoBarcode(data.barcode);
      setBoletoUrl(data.ticketUrl);
      setCurrentStep('boleto_waiting');
      clearCart();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Houve um erro ao gerar o boleto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Card Order
  const handleCardCheckout = async () => {
    // Basic field validation
    if (!cardNumber.trim() || cardNumber.replace(/\D/g, '').length < 15) {
      setErrorMessage('Por favor, informe um número de cartão válido.');
      return;
    }
    if (!cardHolder.trim() || cardHolder.trim().split(' ').length < 2) {
      setErrorMessage('Por favor, informe o nome completo do titular como impresso no cartão.');
      return;
    }
    if (!cardExpiry.trim() || cardExpiry.replace(/\D/g, '').length < 4) {
      setErrorMessage('Por favor, informe a validade do cartão (MM/AA).');
      return;
    }
    if (!cardCvv.trim() || cardCvv.replace(/\D/g, '').length < 3) {
      setErrorMessage('Por favor, informe o código de segurança (CVV).');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const mpPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || 'mock_payee_code';

    // Get brand or default to visa
    const cardNumClean = cardNumber.replace(/\D/g, '');
    let brand = 'visa';
    if (cardNumClean.startsWith('5')) brand = 'master'; // mapped to master for MP
    else if (cardNumClean.startsWith('3')) brand = 'amex';
    else if (cardNumClean.startsWith('6')) brand = 'elo';
    else if (cardNumClean.startsWith('4')) brand = 'visa';

    try {
      let paymentToken = 'mock_token_cc_' + Math.random().toString(36).substring(2, 15);
      
      // Attempt actual tokenization if mpPublicKey is available and not a mock value
      if (mpPublicKey && mpPublicKey !== 'mock_payee_code' && !mpPublicKey.startsWith('YOUR_')) {
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
          console.warn('Falha na tokenização Mercado Pago:', tokErr);
          throw new Error(tokErr.message || 'Erro ao processar dados do cartão de crédito junto ao Mercado Pago.');
        }
      }

      // Collect device profile session id for antifraude bypass
      const deviceId = (window as any).MP_DEVICE_SESSION_ID || null;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: cartItems.map(item => ({ slug: item.slug })),
          coupon: couponCode || null,
          subOption: activeProduct?.isSubscription ? subOption : undefined,
          buyer: {
            name: fullName,
            email: email,
            cpf: cpfCnpj,
            phone: phone
          },
          paymentMethod: 'credit_card',
          card: {
            token: paymentToken,
            brand: brand
          },
          paymentToken: paymentToken,
          paymentMethodId: brand,
          installments: Number(installments),
          deviceId: deviceId
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar pagamento com cartão de crédito.');
      }

      // If approved or authorized
      if (data.status === 'approved' || data.status === 'authorized') {
        setSuccessTitle('Pagamento Aprovado!');
        setSuccessDescription('Seu pagamento via Cartão de Crédito foi processado com sucesso pelo Mercado Pago. Suas credenciais e links de acesso foram enviados para o seu e-mail.');
        setCurrentStep('success');
        clearCart();
        
        setTimeout(() => {
          onClose();
          navigate('/obrigado');
        }, 3000);
      } else if (data.status === 'in_process') {
        setSuccessTitle('Pagamento em Análise!');
        setSuccessDescription('Seu pagamento está passando por uma revisão de segurança do Mercado Pago. Assim que for aprovado, você receberá a licença em seu e-mail.');
        setCurrentStep('success');
        clearCart();

        setTimeout(() => {
          onClose();
          navigate('/obrigado');
        }, 4000);
      } else {
        throw new Error(`O pagamento foi retornado com status: ${data.status}. Tente novamente ou use outro cartão.`);
      }

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Erro ao concluir pagamento com cartão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Pricing math
  const getCheckoutTotal = () => {
    if (activeProduct?.isSubscription) {
      return subOption === 'recurrent' ? (activeProduct.recurrencePrice || activeProduct.price) : activeProduct.price;
    }
    return total;
  };
  const checkoutTotal = getCheckoutTotal();
  const formattedPrice = checkoutTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getPixPrice = () => {
    if (activeProduct?.isSubscription) {
      return checkoutTotal; // Subscriptions have set net prices
    }
    return total * 0.98;
  };
  const pixDiscountPrice = getPixPrice();
  const formattedPixPrice = pixDiscountPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Auto-adjust installments if it exceeds the max allowed for the current price
  useEffect(() => {
    const maxAllowed = checkoutTotal < 90 ? 3 : 12;
    if (parseInt(installments, 10) > maxAllowed) {
      setInstallments(String(maxAllowed));
    }
  }, [checkoutTotal, installments]);

  // Installment Options Calculation with 2.99% monthly interest rate
  const maxInstallments = checkoutTotal < 90 ? 3 : 12;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => {
    const num = i + 1;
    if (num === 1) {
      const value = checkoutTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return { num, value, label: `1x de ${value} à vista` };
    }
    
    // Taxa de juros padrão de mercado para parcelamento assumido pelo comprador (ex: 2.99% a.m.)
    const monthlyRate = 0.0299;
    const factor = (monthlyRate * Math.pow(1 + monthlyRate, num)) / (Math.pow(1 + monthlyRate, num) - 1);
    const installmentValue = checkoutTotal * factor;
    
    const valueStr = installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return { 
      num, 
      value: valueStr, 
      label: `${num}x de ${valueStr} *` 
    };
  });

  const selectedInstallmentObj = installmentOptions.find(opt => opt.num === parseInt(installments, 10));
  const cardButtonLabel = selectedInstallmentObj 
    ? (selectedInstallmentObj.num === 1 
        ? `Finalizar Compra - ${formattedPrice}` 
        : `Finalizar Compra - ${selectedInstallmentObj.num}x de ${selectedInstallmentObj.value}`)
    : `Finalizar Compra - ${formattedPrice}`;

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
              {cartItems.length === 1 ? activeProduct?.name : `${cartItems.length} Softwares`}
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
            <div className="p-4 bg-red-50 text-red-800 text-xs font-semibold rounded-2xl border border-red-100 flex flex-col gap-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-left leading-normal">{errorMessage}</p>
              </div>
              {/* Fallback option to pay via Cakto */}
              {activeProduct?.checkoutUrl && (
                <div className="pt-3 border-t border-red-200/50 mt-1 flex flex-col gap-2 text-left">
                  <p className="text-slate-650 font-normal leading-relaxed">
                    Dica: Se o pagamento falhar ou for recusado no cartão, você pode concluir a compra diretamente pelo nosso checkout alternativo da Cakto:
                  </p>
                  <a
                    href={activeProduct.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md transition-all duration-200 self-start hover:no-underline"
                  >
                    Concluir Compra na Cakto
                  </a>
                </div>
              )}
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

              {/* List of items in checkout */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resumo do pedido</span>
                {activeProduct?.isSubscription ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">{activeProduct.name}</span>
                      <span className="font-bold text-slate-900">
                        {checkoutTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        {subOption === 'recurrent' && <span className="text-[10px] text-slate-500 font-normal"> /mês</span>}
                      </span>
                    </div>
                    
                    {/* Compact toggle buttons for plan */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSubOption('recurrent');
                          setPaymentMethod('card');
                        }}
                        className={`py-2 px-3 text-center rounded-xl border text-[10px] font-bold transition-all ${
                          subOption === 'recurrent'
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Assinatura Mensal ({activeProduct.recurrencePrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSubOption('avulso');
                          setPaymentMethod('pix');
                        }}
                        className={`py-2 px-3 text-center rounded-xl border text-[10px] font-bold transition-all ${
                          subOption === 'avulso'
                            ? 'border-accent-blue bg-accent-blue/10 text-accent-blue-dark'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Pagamento Único ({activeProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      {subOption === 'recurrent' ? (
                        <span>👉 Cobrança recorrente mensal no cartão de crédito via Mercado Pago. Cancele a qualquer momento.</span>
                      ) : (
                        <span>👉 Licença com pagamento único. Sem mensalidade ou recorrência futura.</span>
                      )}
                    </p>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700">{item.name}</span>
                        <span className="font-bold text-slate-900">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                    ))}
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold pt-2 border-t border-slate-200/60">
                        <span>Desconto (10% OFF10)</span>
                        <span>-{discountAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                    )}
                  </>
                )}
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
                
                 {/* Method selector cards */}
                 {(!activeProduct?.isSubscription || subOption === 'avulso') ? (
                   <div className="grid grid-cols-3 gap-3 pb-2">
                     {/* Pix Card */}
                     <button
                       type="button"
                       onClick={() => setPaymentMethod('pix')}
                       className={`relative flex flex-col justify-between items-start p-4 h-24 text-left w-full cursor-pointer transition-all rounded-2xl border-2 ${
                         paymentMethod === 'pix'
                           ? 'border-emerald-500 bg-slate-50/50 shadow-sm'
                           : 'border-slate-200/80 bg-slate-50/20 hover:bg-slate-50'
                       }`}
                     >
                       {/* Pix Icon */}
                       <svg className={`w-5 h-5 ${paymentMethod === 'pix' ? 'text-emerald-500' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M12 2L2 12l10 10 10-10L12 2z" />
                         <path d="M12 7l-5 5 5 5 5-5-5-5z" fill="currentColor" />
                       </svg>

                       <span className="text-xs font-bold text-slate-800">Pix</span>

                       {/* 2% OFF Badge */}
                       <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10 whitespace-nowrap">
                         2% OFF
                       </div>
                     </button>

                     {/* Credit Card Card */}
                     <button
                       type="button"
                       onClick={() => setPaymentMethod('card')}
                       className={`flex flex-col justify-between items-start p-4 h-24 text-left w-full cursor-pointer transition-all rounded-2xl border-2 ${
                         paymentMethod === 'card'
                           ? 'border-sky-500 bg-slate-50/50 shadow-sm'
                           : 'border-slate-200/80 bg-slate-50/20 hover:bg-slate-50'
                       }`}
                     >
                       {/* Credit Card Icon */}
                       <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-sky-500' : 'text-slate-400'}`} />

                       <span className="text-xs font-bold text-slate-800">Cartão</span>
                     </button>

                     {/* Boleto Card */}
                     <button
                       type="button"
                       onClick={() => setPaymentMethod('boleto')}
                       className={`flex flex-col justify-between items-start p-4 h-24 text-left w-full cursor-pointer transition-all rounded-2xl border-2 ${
                         paymentMethod === 'boleto'
                           ? 'border-amber-500 bg-slate-50/50 shadow-sm'
                           : 'border-slate-200/80 bg-slate-50/20 hover:bg-slate-50'
                       }`}
                     >
                       {/* Boleto Icon (FileText) */}
                       <FileText className={`w-5 h-5 ${paymentMethod === 'boleto' ? 'text-amber-500' : 'text-slate-400'}`} />

                       <span className="text-xs font-bold text-slate-800">Boleto</span>
                     </button>
                   </div>
                 ) : (
                   <div className="p-3.5 bg-sky-500/10 text-sky-800 text-xs font-bold rounded-2xl border border-sky-500/20 text-center flex items-center justify-center gap-1.5">
                     <span>⚡ Assinatura Recorrente via Cartão de Crédito</span>
                   </div>
                 )}
 
                {/* Pix Area */}
                {paymentMethod === 'pix' && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-slate-700 leading-relaxed space-y-1">
                      <p className="font-bold text-emerald-800 flex items-center">
                        {activeProduct?.isSubscription ? '⚡ Assinatura Pix Automática' : '⚡ Desconto Exclusivo Pix'}
                      </p>
                      <p>
                        {activeProduct?.isSubscription 
                          ? `A ativação do seu plano ${activeProduct.name} será realizada imediatamente após a confirmação do pagamento Pix.` 
                          : 'Ganhe 2% de desconto exclusivo pagando via Pix! O pagamento é aprovado imediatamente e o acesso será enviado ao seu e-mail em segundos.'}
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

                {/* Boleto Area */}
                {paymentMethod === 'boleto' && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[11px] text-slate-700 leading-relaxed space-y-1">
                      <p className="font-bold text-amber-800 flex items-center">
                        📄 Pagamento via Boleto Bancário
                      </p>
                      <p>
                        O boleto será gerado com vencimento em até 3 dias úteis. A compensação bancária ocorre de 1 a 2 dias úteis após o pagamento. Seus arquivos de acesso serão enviados automaticamente para o seu e-mail assim que o pagamento for confirmado.
                      </p>
                    </div>

                    <button
                      onClick={handleBoletoCheckout}
                      disabled={loading}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Gerando Boleto Seguro...</span>
                        </>
                      ) : (
                        <span>Gerar Boleto de {formattedPrice}</span>
                      )}
                    </button>
                  </div>
                )}

                {/* Credit Card Area */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-[11px] text-slate-700 leading-relaxed">
                      <p className="font-bold text-sky-800 flex items-center mb-0.5">
                        💳 Transação Segura via Mercado Pago
                      </p>
                      <p>
                        Seus dados são criptografados de ponta a ponta. Não armazenamos informações do seu cartão.
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      {/* Número do Cartão */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Número do Cartão</label>
                        <input 
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full px-4 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all outline-none"
                        />
                      </div>

                      {/* Nome do Titular */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nome do Titular (como no cartão)</label>
                        <input 
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="EX: JOAO S SANTOS"
                          className="w-full px-4 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all outline-none"
                        />
                      </div>

                      {/* Validade e CVV */}
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Validade (MM/AA)</label>
                          <input 
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                            placeholder="MM/AA"
                            maxLength={5}
                            className="w-full px-4 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all outline-none text-center"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Código CVV</label>
                          <input 
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(formatCardCvv(e.target.value))}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-4 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all outline-none text-center"
                          />
                        </div>
                      </div>

                      {/* Parcelas */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Opções de Parcelamento</label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs bg-white outline-none"
                        >
                          {installmentOptions.map((opt) => (
                            <option key={opt.num} value={opt.num}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleCardCheckout}
                      disabled={loading}
                      className="w-full mt-2 py-4 bg-accent-blue hover:bg-accent-blue-dark text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-none"
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

          {/* STEP 3B: Boleto Waiting Area */}
          {currentStep === 'boleto_waiting' && (
            <div className="space-y-6 text-center py-4">
              <div className="space-y-2">
                <span className="bg-amber-500/10 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-500/10 inline-flex items-center">
                  Boleto Gerado com Sucesso
                </span>
                <h4 className="font-display font-extrabold text-slate-900 text-lg">
                  Copie o código de barras ou imprima o boleto
                </h4>
              </div>

              {/* PDF Ticket Redirection Button */}
              {boletoUrl && (
                <div className="space-y-2 max-w-sm mx-auto">
                  <a
                    href={boletoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Visualizar / Imprimir Boleto
                  </a>
                </div>
              )}

              {/* Barcode Copy display */}
              {boletoBarcode && (
                <div className="space-y-2">
                  <p className="text-slate-555 text-slate-500 text-xs max-w-sm mx-auto">
                    Você também pode pagar utilizando o código de barras no aplicativo do seu banco:
                  </p>
                  <div className="flex items-center space-x-2 max-w-sm mx-auto bg-slate-50 border border-slate-200/60 p-2 rounded-2xl">
                    <input
                      type="text"
                      readOnly
                      value={boletoBarcode}
                      className="flex-1 bg-transparent text-xs text-slate-650 outline-none select-all truncate pl-1 border-none focus:ring-0"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(boletoBarcode);
                        setCopiedBarcode(true);
                        setTimeout(() => setCopiedBarcode(false), 2000);
                      }}
                      className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-accent-blue rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                      title="Copiar Código de Barras"
                    >
                      {copiedBarcode ? (
                        <span className="text-[10px] font-bold text-emerald-600 px-1">Copiado!</span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm mx-auto text-[11px] text-slate-500 text-left space-y-1.5">
                <p className="font-bold text-slate-700">Informações Importantes:</p>
                <p>• O boleto foi enviado para o seu e-mail: <strong className="text-slate-700">{email}</strong>.</p>
                <p>• Prazo de compensação: de 1 a 2 dias úteis após o pagamento.</p>
                <p>• Assim que compensado, os links de acesso serão enviados automaticamente para o seu e-mail.</p>
              </div>

              {/* Close and Return Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/obrigado');
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer border-none"
                >
                  Concluir e Ir para Obrigado
                </button>
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
                  {successTitle}
                </h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  {successDescription}
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
