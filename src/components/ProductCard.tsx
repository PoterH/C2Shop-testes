import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Monitor, Send, Info, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';
import { reviewsData } from '../data/reviews';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const productReviews = reviewsData[product.id] || [];
  const averageRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : "5.0";

  // Format price
  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const formattedOriginalPrice = product.originalPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  // Determine OS Icon
  const renderOSIcon = () => {
    if (product.compatibility === 'Windows') {
      return (
        <span className="inline-flex items-center text-xs text-slate-500 font-medium">
          <Monitor className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Windows
        </span>
      );
    } else if (product.compatibility === 'macOS') {
      return (
        <span className="inline-flex items-center text-xs text-slate-500 font-medium">
          <svg className="w-3.5 h-3.5 mr-1 fill-current text-slate-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
          </svg>
          macOS
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center text-xs text-slate-500 font-medium">
          <Monitor className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Win / Mac
        </span>
      );
    }
  };


  return (
    <div className="group bg-white rounded-3xl border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      <Link to={`/produto/${product.slug}`} className="flex flex-col flex-1 hover:no-underline text-inherit">
        {/* Product Image / Visual Area */}
        <div className="relative h-44 bg-slate-50 flex items-center justify-center border-b border-slate-50 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <>
              {/* Soft Decorative Gradient in Background */}
              <div className="absolute inset-0 bg-radial from-slate-100 to-slate-50 group-hover:scale-105 transition-transform duration-500"></div>
              
              {/* Mockup software card representation */}
              <div className="relative w-28 h-32 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700/50 flex flex-col justify-between p-3.5 transform group-hover:-translate-y-1.5 transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-xl font-bold font-display tracking-tight text-white select-none">
                    C2
                  </span>
                  <span className="bg-white/10 text-white/90 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {product.compatibility}
                  </span>
                </div>
                
                <div className="my-2 flex flex-col">
                  <span className="text-xs font-semibold leading-tight line-clamp-2 text-slate-200">
                    {product.name}
                  </span>
                  <span className="text-[9px] text-accent-blue font-medium mt-0.5">
                    v{product.version.split(' ')[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[7px] text-white/60 font-semibold tracking-wider uppercase">
                    Vitalício
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.unavailable ? (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center border border-rose-600/30 shadow-md uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>
                Indisponível
              </span>
            ) : (
              <>
                <span className="bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center border border-emerald-500/20 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Acesso vitalício
                </span>
                <span className="bg-white/90 backdrop-blur-md text-sky-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center border border-sky-500/20 shadow-sm">
                  <Send className="w-2.5 h-2.5 mr-1" />
                  Entrega imediata
                </span>
              </>
            )}
          </div>

          {/* Semi-transparent dark overlay for unavailable products */}
          {product.unavailable && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1.5px] z-10 flex items-center justify-center">
              <span className="bg-rose-600 text-white text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-lg border border-rose-500/30">
                Temporariamente Indisponível
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 pb-0 flex-1 flex flex-col">
          {/* Category & OS */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-accent-blue uppercase tracking-wider">
              {product.category}
            </span>
            {renderOSIcon()}
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-accent-blue transition-colors duration-200 mb-1">
            {product.name}
          </h3>

          {/* Rating Summary */}
          {productReviews.length > 0 && (
            <div className="flex items-center space-x-1 text-[11px] mb-1.5">
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
              <span className="text-slate-400">({productReviews.length})</span>
            </div>
          )}

          {/* Version Badge for clarity */}
          <div className="mb-2">
            <span className="inline-block bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded">
              Versão: {product.version}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Features / Bullet points */}
          <div className="space-y-1.5 mb-5 flex-1">
            <div className="flex items-start text-slate-600 text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0 mt-0.5" />
              <span>Versão completa e funcional</span>
            </div>
            <div className="flex items-start text-slate-600 text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0 mt-0.5" />
              <span>Instalação assistida inclusa</span>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-100 my-4" />

          {/* Pricing & CTA */}
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 line-through">
                De {formattedOriginalPrice}
              </span>
              <span className="text-xl font-display font-extrabold text-slate-900 tracking-tight">
                Por <span className="text-accent-blue">{formattedPrice}</span>
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold uppercase">
                Sem mensalidades
              </span>
            </div>

            <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 font-medium">
              Pix / Cartão
            </span>
          </div>
        </div>
      </Link>

      {/* CTA Buttons */}
      <div className="px-5 pb-5 pt-0 mt-auto">
        {product.unavailable ? (
          <Link
            to={`/produto/${product.slug}`}
            className="flex items-center justify-center py-2.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors duration-200 w-full"
          >
            <Info className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            Ver detalhes do software
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/produto/${product.slug}`}
              className="flex items-center justify-center py-2 px-3 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              <Info className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Detalhes
            </Link>
            <button
              onClick={() => addToCart(product)}
              className="flex items-center justify-center py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white transition-all duration-200 shadow-sm shadow-emerald-500/10 hover:shadow border-none cursor-pointer"
              id={`buy-now-${product.id}`}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              Comprar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


