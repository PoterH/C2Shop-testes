import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { CheckoutModal } from '../components/CheckoutModal';
import { getProductBySlug } from '../data/products';
import { 
  Check, 
  ShieldCheck, 
  MessageSquare, 
  ShoppingCart, 
  Monitor, 
  ChevronRight, 
  ArrowLeft,
  Star
} from 'lucide-react';
import { reviewsData } from '../data/reviews';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const product = useMemo(() => {
    if (!slug) return undefined;
    return getProductBySlug(slug);
  }, [slug]);

  const productReviews = useMemo(() => {
    if (!product) return [];
    return reviewsData[product.id] || [];
  }, [product]);

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return "5.0";
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  }, [productReviews]);

  useEffect(() => {
    if (searchParams.get('checkout') === 'true' && !product?.unavailable) {
      setIsCheckoutOpen(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('checkout');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, product]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-200 fill-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  // Set document title for SEO
  useEffect(() => {
    if (product) {
      document.title = `${product.name} Acesso Vitalício | C2Tech`;
      
      // Update meta description dynamically if needed (done through index.html originally, here dynamically)
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Adquira o ${product.name} com licença alternativa e acesso vitalício na C2Tech. Entrega automática por e-mail e suporte assistido inclusos.`);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 text-center space-y-4">
          <h2 className="font-display font-extrabold text-2xl text-slate-900">Software não encontrado</h2>
          <p className="text-slate-500 text-sm">O produto solicitado não foi encontrado no catálogo da C2Tech ou foi removido.</p>
          <div className="pt-2">
            <Link
              to="/catalogo"
              className="inline-flex items-center px-5 py-2.5 bg-accent-blue text-white font-semibold rounded-xl text-sm shadow hover:bg-accent-blue-dark transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const formattedOriginalPrice = product.originalPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const whatsappNumber = '5581997349300'; // Substitua pelo seu número real do WhatsApp
  const whatsappMessage = encodeURIComponent(`Olá, tenho interesse no software ${product.name} e gostaria de tirar uma dúvida sobre a compatibilidade ou instalação.`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Structured Data (JSON-LD Schema Markup) for Product SEO
  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "C2Tech"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BRL",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31"
    }
  };

  const renderPurchaseCard = (isMobile: boolean) => {
    return (
      <div 
        className={`bg-white rounded-3xl border border-slate-150 shadow-xl p-6 sm:p-8 space-y-6 ${
          isMobile ? 'block lg:hidden' : 'hidden lg:block'
        }`}
      >
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
            Licença Alternativa
          </span>
          <h3 className="font-display font-extrabold text-2xl text-slate-950">
            {product.name}
          </h3>
          {productReviews.length > 0 && (
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(parseFloat(averageRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-700">{averageRating}</span>
              <span className="text-slate-400">({productReviews.length} avaliações)</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            {product.unavailable ? (
              <span className="flex items-center text-rose-500 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                Temporariamente indisponível
              </span>
            ) : (
              <span className="flex items-center text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Em estoque para entrega imediata
              </span>
            )}
          </div>
        </div>

        {/* Price Details */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 line-through">De {formattedOriginalPrice}</p>
            <p className="text-2xl sm:text-3xl font-display font-black text-slate-950">
              Por <span className="text-accent-blue">{formattedPrice}</span>
            </p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              Pagamento Único. Sem Mensalidade.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="bg-emerald-500/10 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg border border-emerald-500/10">
              Desconto de 80%
            </span>
          </div>
        </div>

        {/* Trust highlights */}
        <ul className="space-y-2.5 text-xs text-slate-600">
          <li className="flex items-center">
            <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
            <span>Entrega automática por e-mail</span>
          </li>
          <li className="flex items-center">
            <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
            <span>Passo a passo de instalação ilustrado</span>
          </li>
          <li className="flex items-center">
            <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
            <span>Acesso vitalício para uso ilimitado</span>
          </li>
          <li className="flex items-center">
            <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
            <span>Suporte remoto quando necessário</span>
          </li>
        </ul>

        {/* CTAs */}
        <div className="space-y-3">
          {product.unavailable ? (
            <button
              disabled
              className="w-full flex items-center justify-center py-4 bg-slate-200 text-slate-500 font-bold rounded-2xl text-center cursor-not-allowed border-none font-display text-sm uppercase tracking-wider"
            >
              Temporariamente indisponível
            </button>
          ) : (
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full flex items-center justify-center py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-center shadow-lg transition-all animate-soft-pulse cursor-pointer border-none"
              id={`detail-buy-${isMobile ? 'mobile' : 'desktop'}-${product.id}`}
            >
              <ShoppingCart className="w-5 h-5 mr-2 shrink-0" />
              Comprar agora
            </button>
          )}
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-emerald-600 font-bold rounded-2xl text-center transition-all"
          >
            <MessageSquare className="w-5 h-5 text-emerald-500 mr-2 shrink-0" />
            Tirar dúvidas no WhatsApp
          </a>
        </div>

        {/* Secure payment banner */}
        <div className="pt-2 border-t border-slate-100 flex flex-col items-center justify-center space-y-2 text-center text-[10px] text-slate-400">
          <p className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-500 mr-1 shrink-0" />
            Checkout Seguro e Criptografado
          </p>
          <div className="flex items-center justify-center gap-1.5 opacity-60">
            <span className="px-1 border border-slate-200 rounded">PIX</span>
            <span className="px-1 border border-slate-200 rounded">CARTÃO</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen text-left">
      {/* Inject Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent-blue transition-colors">
            Início
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/catalogo" className="hover:text-accent-blue transition-colors">
            Catálogo
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 font-semibold truncate">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Media & Info details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual Header/Mockup Box */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Product Visual Area: Custom Image or Mockup Box */}
              {product.imageUrl ? (
                <div className="relative w-full md:w-64 h-36 bg-slate-50 rounded-2xl shadow-md border border-slate-100/50 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                /* Product Digital Mockup Box */
                <div className="relative w-40 h-48 bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-800 flex flex-col justify-between p-4 shrink-0">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl font-black font-display tracking-tight text-white select-none">C2</span>
                    <span className="bg-white/10 text-white/90 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      {product.compatibility}
                    </span>
                  </div>
                  
                  <div className="my-3 text-left">
                    <span className="text-sm font-bold leading-snug line-clamp-2 text-slate-100">
                      {product.name}
                    </span>
                    <span className="text-[10px] text-accent-blue font-semibold mt-1 block">
                      Versão Completa
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[8px] text-white/60 font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Acesso Vitalício
                  </div>
                </div>
              )}

              {/* General details */}
              <div className="space-y-4 flex-1">
                <span className="bg-emerald-500/10 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center border border-emerald-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                  Acesso vitalício
                </span>
                
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                  {product.name}
                </h1>
                
                <p className="text-slate-500 text-sm leading-relaxed">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                    Categoria: {product.category}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                    Versão: {product.version}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium flex items-center">
                    <Monitor className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {product.compatibility}
                  </span>
                </div>
              </div>

            </div>

            {/* Mobile Purchase Card */}
            {renderPurchaseCard(true)}

            {/* O que você recebe */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="font-display font-bold text-lg text-slate-950 border-b border-slate-50 pb-2">
                O que você recebe após a compra?
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start text-slate-700 text-sm">
                    <Check className="w-5 h-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
                <div className="flex items-start text-slate-700 text-sm">
                  <Check className="w-5 h-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                  <span>Guia de instalação ilustrado passo a passo</span>
                </div>
              </div>
            </div>

            {/* Sobre o Software */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="font-display font-bold text-lg text-slate-950 border-b border-slate-50 pb-2">
                Sobre o software
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {product.longDescription}
              </p>
              {product.notes && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-xs italic leading-relaxed">
                  {product.notes}
                </div>
              )}
            </div>

            {/* Requisitos de Sistema */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="font-display font-bold text-lg text-slate-950 border-b border-slate-50 pb-2">
                Requisitos mínimos do sistema
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  <p className="text-xs text-slate-400 font-bold uppercase">Sistema Operacional</p>
                  <p className="text-slate-800 font-medium mt-0.5">{product.requirements.os}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  <p className="text-xs text-slate-400 font-bold uppercase">Processador (CPU)</p>
                  <p className="text-slate-800 font-medium mt-0.5">{product.requirements.cpu}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  <p className="text-xs text-slate-400 font-bold uppercase">Memória RAM</p>
                  <p className="text-slate-800 font-medium mt-0.5">{product.requirements.ram}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  <p className="text-xs text-slate-400 font-bold uppercase">Espaço em Disco</p>
                  <p className="text-slate-800 font-medium mt-0.5">{product.requirements.storage}</p>
                </div>
                {product.requirements.gpu && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 sm:col-span-2">
                    <p className="text-xs text-slate-400 font-bold uppercase">Placa de Vídeo (GPU)</p>
                    <p className="text-slate-800 font-medium mt-0.5">{product.requirements.gpu}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Como funciona a entrega */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="font-display font-bold text-lg text-slate-950 border-b border-slate-50 pb-2">
                Como funciona a entrega?
              </h2>
              
              <div className="relative pl-6 space-y-6 border-l border-slate-200">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-4 border-white"></span>
                  <h4 className="text-sm font-bold text-slate-900">1. Pedido pelo Checkout Seguro</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Você clica em "Comprar agora" e finaliza a transação com segurança criptografada.</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-4 border-white"></span>
                  <h4 className="text-sm font-bold text-slate-900">2. Envio automático por E-mail</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Confirmado o pagamento, o sistema envia o e-mail contendo os links de acesso imediatamente.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-4 border-white"></span>
                  <h4 className="text-sm font-bold text-slate-900">3. Acesso aos arquivos e guias</h4>
                  <p className="text-slate-500 text-xs mt-0.5">O e-mail contém os arquivos de instalação e tutoriais passo a passo simples de executar.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white animate-pulse"></span>
                  <h4 className="text-sm font-bold text-slate-900 text-emerald-700">4. Suporte Assistido Completo</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Se tiver qualquer tipo de dúvida ou dificuldade na instalação, nossa equipe técnica auxilia remotamente.</p>
                </div>
              </div>
            </div>

            {/* Avaliações de Clientes */}
            {productReviews.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100/80 pb-5">
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-950">
                      Avaliações de Clientes
                    </h2>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Feedback real de quem já comprou e instalou este software
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-100 rounded-2xl p-3 shrink-0">
                    <div className="text-center">
                      <p className="text-3xl font-display font-black text-slate-900">{averageRating}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Média geral</p>
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div>
                      {renderStars(Math.round(parseFloat(averageRating)))}
                      <p className="text-[10px] font-semibold text-emerald-600 mt-1 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                        100% de satisfação
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 divide-y divide-slate-100">
                  {productReviews.map((review, idx) => (
                    <div key={idx} className={`${idx > 0 ? 'pt-5' : ''} space-y-2.5`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue/15 to-indigo-500/5 text-slate-700 font-bold text-sm flex items-center justify-center border border-slate-100 shadow-inner uppercase">
                            {review.author.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-bold text-slate-900">{review.author}</h4>
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Compra verificada
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">{review.date}</p>
                          </div>
                        </div>
                        
                        <div>
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed italic bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Checkout box */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Purchase Card */}
            {renderPurchaseCard(false)}

            {/* Fast FAQ Box */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wide">
                Dúvidas sobre o {product.name}
              </h4>
              
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">O software expira?</p>
                  <p className="text-slate-500 leading-relaxed">Não. Trata-se de uma versão completa e funcional com acesso vitalício, sem taxas de renovação.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">Posso reinstalar se trocar de computador?</p>
                  <p className="text-slate-500 leading-relaxed">Sim. O link enviado por e-mail permanece ativo para reinstalação futura caso formate ou substitua seu computador.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <CheckoutModal
        product={product}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};
