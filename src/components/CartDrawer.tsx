import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Tag, ShoppingBag, ShieldCheck, Ticket, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    couponCode,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    total,
    discountPercentage
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const hasSubscription = cartItems.some(item => item.isSubscription && item.selectedSubOption !== 'avulso');
  const hasLifetime = cartItems.some(item => !item.isSubscription || item.selectedSubOption === 'avulso');
  const isMixedCart = hasSubscription && hasLifetime;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    const result = applyCoupon(couponInput);
    setCouponFeedback(result);
    if (result.success) {
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponFeedback(null);
  };

  const handleGoToCatalog = () => {
    setIsCartOpen(false);
    navigate('/catalogo');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isCartOpen 
            ? 'bg-slate-950/40 backdrop-blur-[4px] pointer-events-auto' 
            : 'bg-slate-950/0 backdrop-blur-none pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sliding Drawer Container */}
      <div 
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-slate-100 shadow-2xl flex flex-col h-full transition-transform duration-300 ease-out transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-accent-blue" />
            <h3 className="font-display font-extrabold text-slate-900 text-lg">
              Seu Carrinho
            </h3>
            <span className="text-[11px] font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-12">
              <div className="w-16 h-16 bg-slate-50 text-slate-350 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1.5 max-w-[260px]">
                <h4 className="font-display font-bold text-slate-800 text-base">Seu carrinho está vazio</h4>
                <p className="text-slate-400 text-xs">Adicione softwares profissionais ao seu carrinho para aproveitar licenças vitalícias e descontos especiais.</p>
              </div>
              <button
                onClick={handleGoToCatalog}
                className="px-6 py-3 bg-accent-blue hover:bg-accent-blue-dark text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer border-none"
              >
                Explorar Softwares
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center space-x-3.5 p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all"
                >
                  {/* Product Image */}
                  <div className="w-14 h-14 bg-white border border-slate-100 rounded-xl p-1 overflow-hidden shrink-0 flex items-center justify-center">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-display font-bold text-slate-800 text-sm truncate leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-450 text-slate-400">
                      {item.isSubscription 
                        ? (item.selectedSubOption === 'avulso' ? 'Pagamento Único' : 'Assinatura Mensal')
                        : 'Licença vitalícia'} • {item.compatibility}
                    </span>
                    <div className="font-display font-black text-slate-900 text-sm mt-1">
                      {item.isSubscription
                        ? (item.selectedSubOption === 'avulso' 
                            ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            : (item.recurrencePrice || item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + ' /mês')
                        : item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 cursor-pointer"
                    title="Remover produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-5">
            {/* Mixed Cart Warning */}
            {isMixedCart && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[11px] text-amber-800 leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-550 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-900">Carrinho Misto Detectado</p>
                  <p>
                    Por motivos de cobrança recorrente no cartão, você não pode misturar assinaturas e licenças vitalícias no mesmo pedido.
                  </p>
                  <p className="font-semibold text-amber-950">
                    Remova um dos tipos para continuar.
                  </p>
                </div>
              </div>
            )}

            {/* Coupon Input Form */}
            {!couponCode ? (
              <div className="space-y-1.5">
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Cupom de Desconto"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-xl text-xs transition-all bg-white outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer border-none shrink-0"
                  >
                    Aplicar
                  </button>
                </form>
                {couponFeedback && (
                  <p className={`text-[10px] font-semibold ${couponFeedback.success ? 'text-emerald-600' : 'text-red-500'}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
                <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                  <Ticket className="w-4 h-4" />
                  <span>Cupom {couponCode} Ativo</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-750 font-bold transition-colors cursor-pointer bg-transparent border-none text-[11px]"
                >
                  Remover
                </button>
              </div>
            )}

            {/* Coupon rule alert for OFF10 if item count is 1 */}
            {couponCode === 'OFF10' && cartItems.length === 1 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-105 text-[11px] text-amber-800 leading-relaxed flex items-start space-x-1.5">
                <AlertCircle className="w-4 h-4 text-amber-550 shrink-0 mt-0.5" />
                <p>
                  O cupom <strong>OFF10</strong> só concede 10% de desconto a partir de <strong>2 softwares</strong> no carrinho. Adicione mais um item para ativá-lo!
                </p>
              </div>
            )}

            {/* Price list breakdown */}
            <div className="space-y-2.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>

              {discountPercentage > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Desconto (10% OFF10)</span>
                  <span>
                    -{discountAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm pt-2.5 border-t border-slate-200/60 text-slate-900 font-bold">
                <span className="font-display">Total do Pedido</span>
                <span className="font-display font-extrabold text-lg text-slate-950">
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            {/* CTA checkout button */}
            <div className="space-y-3 pt-1">
              <button
                onClick={handleCheckout}
                disabled={isMixedCart}
                className="w-full py-4 bg-accent-blue hover:bg-accent-blue-dark text-white font-bold rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Finalizar Compra</span>
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Garantia de Checkout 100% Criptografado</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render Checkout Modal if isCheckoutOpen is true */}
      {isCheckoutOpen && (
        <CheckoutModal 
          product={cartItems[0]} // Pass first product just in case fallback is needed
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      )}
    </>
  );
};
