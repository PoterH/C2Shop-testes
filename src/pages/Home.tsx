import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Settings, 
  ShieldCheck, 
  Infinity as InfinityIcon, 
  ArrowRight, 
  MessageSquare, 
  ChevronDown,
  ChevronUp,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { products, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
          ticking = false;
        });
        ticking = true;
      }
    };
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Filter products for the landing page grid (show max 16 of active category)
  const filteredProducts = products
    .filter(p => !p.isSubscription && (activeCategory === 'Todos' || p.category === activeCategory))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    .slice(0, 16);

  // Filter subscription products for the dedicated carousel
  const subscriptionProducts = products
    .filter(p => p.isSubscription)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  const [isPlaying, setIsPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const subCarouselRef = useRef<HTMLDivElement>(null);

  // Reset scroll to 0 when category changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [activeCategory]);

  // Auto scroll effect for carousel
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const el = carouselRef.current;
      if (el) {
        const scrollAmount = 320 + 24; // Card width + gap
        const currentScroll = el.scrollLeft;
        const maxScroll = el.scrollWidth - el.clientWidth;
        
        if (currentScroll >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollTo({ left: currentScroll + scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, filteredProducts]);

  const scrollLeft = () => {
    const el = carouselRef.current;
    if (el) {
      const scrollAmount = 320 + 24;
      el.scrollTo({ left: el.scrollLeft - scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const el = carouselRef.current;
    if (el) {
      const scrollAmount = 320 + 24;
      el.scrollTo({ left: el.scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollSubLeft = () => {
    const el = subCarouselRef.current;
    if (el) {
      const scrollAmount = 320 + 24;
      el.scrollTo({ left: el.scrollLeft - scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollSubRight = () => {
    const el = subCarouselRef.current;
    if (el) {
      const scrollAmount = 320 + 24;
      el.scrollTo({ left: el.scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };


  const trustBadges = [
    {
      icon: <Zap className="w-6 h-6 text-sky-500" />,
      title: 'Entrega imediata',
      desc: 'Acesso enviado automaticamente para o seu e-mail após a compra.'
    },
    {
      icon: <Settings className="w-6 h-6 text-emerald-500" />,
      title: 'Instalação assistida',
      desc: 'Passo a passo detalhado e suporte remoto dedicado caso precise.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-500" />,
      title: 'Compra protegida',
      desc: 'Transações criptografadas e checkout seguro.'
    },
    {
      icon: <InfinityIcon className="w-6 h-6 text-emerald-500" />,
      title: 'Acesso vitalício',
      desc: 'Pague apenas uma vez e utilize o software sem mensalidades.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Escolha o software',
      desc: 'Selecione o produto ideal para seu uso profissional em nosso catálogo.'
    },
    {
      number: '2',
      title: 'Finalize o pedido',
      desc: 'Pagamento rápido e seguro em nosso checkout criptografado.'
    },
    {
      number: '3',
      title: 'Receba no e-mail',
      desc: 'O link com os arquivos e instruções é enviado segundos após o pagamento.'
    },
    {
      number: '4',
      title: 'Instale com orientação',
      desc: 'Siga o tutorial detalhado ou solicite auxílio do suporte remoto se necessário.'
    }
  ];

  const reviews = [
    {
      author: 'Felipe P.',
      role: 'Engenheiro Civil',
      comment: 'Comprei o AutoCAD e chegou no e-mail rapidinho. Tive uma dúvida na instalação e me ajudaram pelo suporte remoto de forma rápida.',
      stars: 5,
    },
    {
      author: 'Mariana L.',
      role: 'Arquiteta',
      comment: 'Gostei bastante, o processo foi simples e consegui instalar tudo seguindo o tutorial enviado. Muito bom custo-benefício.',
      stars: 5,
    },
    {
      author: 'Rafael M.',
      role: 'Designer Gráfico',
      comment: 'Fiquei com receio no começo, mas deu tudo certo. Recebi o acesso imediatamente no e-mail e estou usando o software normalmente.',
      stars: 5,
    },
    {
      author: 'Camila R.',
      role: 'Projetista de Interiores',
      comment: 'O atendimento foi muito bom e me orientaram pelo WhatsApp quando não consegui abrir o instalador de primeira. Recomendo.',
      stars: 5,
    }
  ];

  const faqItems = [
    {
      q: 'Como recebo meu produto?',
      a: 'Após a confirmação do pagamento, os detalhes de acesso e os links de download são enviados de forma 100% automática para o e-mail que você informou no checkout. Verifique também suas pastas de Spam e Promoções.'
    },
    {
      q: 'O acesso é vitalício?',
      a: 'Sim, o acesso é vitalício para a versão que você adquiriu. Não existem assinaturas recorrentes, taxas anuais ou mensalidades. Você paga apenas uma vez e utiliza sem limitações de tempo.'
    },
    {
      q: 'As atualizações estão inclusas?',
      a: 'Não. O produto adquirido corresponde à versão informada na página do software. Atualizações para novas versões lançadas no futuro não estão inclusas.'
    },
    {
      q: 'Vocês ajudam na instalação?',
      a: 'Sim. Todos os softwares acompanham um guia de instalação passo a passo muito simples de seguir. Caso encontre dificuldades, nossa equipe técnica oferece suporte de instalação assistida e remoto via WhatsApp.'
    },
    {
      q: 'Funciona em Mac?',
      a: 'Apenas os softwares descritos explicitamente como compatíveis com macOS (por exemplo, "Office 2024 para Mac"). A maioria dos softwares de engenharia é compatível apenas com o sistema operacional Windows.'
    },
    {
      q: 'Recebo nota fiscal?',
      a: 'Configurações de emissão de documento fiscal e dados de faturamento podem ser alteradas e visualizadas em sua conta ou solicitadas por meio dos nossos canais de suporte técnico (Espaço reservado para configuração do lojista).'
    },
    {
      q: 'Posso comprar ou tirar dúvidas pelo WhatsApp?',
      a: 'Sim, com certeza! Se preferir falar com um atendente humano para sanar dúvidas sobre compatibilidade ou pagamentos antes de finalizar sua compra, basta clicar em qualquer botão do WhatsApp no site.'
    }
  ];

  const whatsappNumber = '5581997349300'; // Substitua pelo seu número real do WhatsApp
  const whatsappMessage = encodeURIComponent('Olá, tenho interesse em um software da C2Tech e gostaria de tirar uma dúvida.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="pt-0">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#020617] pt-20 pb-12 md:pt-40 md:pb-32 overflow-hidden text-center z-0">
        
        {/* Background Layers Wrapper (z-0 sits above section's bg color but behind relative z-10 content) */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          {/* Large Morphing Blue/Indigo/Cyan Mists (Ambient Organic Shapes) */}
          <div 
            className="absolute -top-10 -left-10 w-[450px] h-[450px] md:w-[650px] md:h-[650px] will-change-transform"
            style={{ transform: 'translate3d(calc(var(--scroll-y, 0px) * 0.02), calc(var(--scroll-y, 0px) * 0.08), 0)' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#00d2ff]/25 via-[#0066FF]/20 to-[#0a21a5]/25 rounded-full blur-[100px] md:blur-[140px] animate-morph-blob-1"></div>
          </div>
          <div 
            className="absolute top-40 -right-10 w-[400px] h-[400px] md:w-[600px] md:h-[600px] will-change-transform"
            style={{ transform: 'translate3d(calc(var(--scroll-y, 0px) * -0.02), calc(var(--scroll-y, 0px) * -0.05), 0)' }}
          >
            <div className="w-full h-full bg-gradient-to-tr from-[#0066FF]/22 via-[#00d2ff]/20 to-[#0a21a5]/22 rounded-full blur-[90px] md:blur-[130px] animate-morph-blob-2"></div>
          </div>
          <div 
            className="absolute bottom-10 left-[10%] w-[350px] h-[350px] md:w-[550px] md:h-[550px] will-change-transform"
            style={{ transform: 'translate3d(calc(var(--scroll-y, 0px) * -0.01), calc(var(--scroll-y, 0px) * 0.04), 0)' }}
          >
            <div className="w-full h-full bg-gradient-to-tl from-[#00d2ff]/18 via-[#0066FF]/20 to-[#0a21a5]/18 rounded-full blur-[80px] md:blur-[120px] animate-morph-blob-3"></div>
          </div>
          
          {/* Subtle top ambient light glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#00d2ff]/15 via-transparent to-transparent blur-3xl"></div>

          {/* Tech Grid & Dot Patterns for premium background depth */}
          <div className="absolute inset-0 bg-grid-tech opacity-70"></div>
          <div className="absolute inset-0 bg-dot-tech opacity-50"></div>

          {/* Floating Sparkles/Telemetry Dots */}
          <div className="absolute top-[20%] left-[10%] w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-pulse opacity-40"></div>
          <div className="absolute top-[65%] left-[22%] w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
          <div className="absolute top-[35%] right-[18%] w-1 h-1 bg-[#00d2ff] rounded-full animate-pulse opacity-50"></div>
          <div className="absolute top-[80%] right-[12%] w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 md:space-y-8 flex flex-col items-center">
          
          {/* 1. Pill Badge with Avatars */}
          <div 
            className="inline-flex items-center space-x-2.5 bg-slate-900/60 backdrop-blur-md rounded-full border border-sky-500/30 px-3.5 py-1.5 shadow-[0_0_20px_rgba(2,132,199,0.1)] hover:border-sky-500/50 transition-all duration-300 pointer-events-none select-none animate-soft-pulse"
          >
            {/* Overlapping Avatars */}
            <div className="flex -space-x-2">
              <img className="w-6 h-6 rounded-full border-2 border-slate-950 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Cliente 1" />
              <img className="w-6 h-6 rounded-full border-2 border-slate-950 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80" alt="Cliente 2" />
              <img className="w-6 h-6 rounded-full border-2 border-slate-950 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" alt="Cliente 3" />
              <img className="w-6 h-6 rounded-full border-2 border-slate-950 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80" alt="Cliente 4" />
              <img className="w-6 h-6 rounded-full border-2 border-slate-950 object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64&q=80" alt="Cliente 5" />
            </div>
            <span className="text-[11px] font-bold text-sky-400 tracking-wide">
              +5.000 clientes satisfeitos
            </span>
          </div>

          {/* 2. Headline */}
          <div className="space-y-2 md:space-y-4 max-w-5xl text-center">
            <h1 className="font-display text-white tracking-tight leading-[1.1] text-balance">
              <span className="font-light text-2xl sm:text-[36px] md:text-[44px] lg:text-[48px] xl:text-[52px] block text-white/90">
                Você só foca no projeto.
              </span>
              <span className="font-black text-4xl sm:text-[56px] md:text-[68px] lg:text-[76px] xl:text-[80px] block mt-1 sm:mt-2">
                A <span className="bg-gradient-to-r from-[#00d2ff] via-[#0066FF] to-[#0a21a5] bg-clip-text text-transparent">C2Tech</span> cuida do resto.
              </span>
            </h1>
            
            {/* 3. Sub-headline */}
            <p className="text-slate-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-normal md:leading-relaxed text-balance">
              Catálogo completo, área do cliente, entrega automática por e-mail e suporte técnico completo no WhatsApp! Tudo pronto para ativação vitalícia local, no mesmo lugar. E você só paga uma única vez por isso.
            </p>
          </div>

          {/* 4. Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-3xl pt-0 md:pt-4">
            <Link
              to="/catalogo"
              className="flex items-center justify-center px-8 py-4 md:px-12 md:py-5 text-base md:text-lg lg:text-xl font-bold text-white bg-accent-blue hover:bg-accent-blue-dark rounded-2xl md:rounded-3xl shadow-[0_4px_20px_rgba(2,132,199,0.25)] hover:shadow-[0_4px_25px_rgba(2,132,199,0.35)] transition-all duration-300 group whitespace-nowrap hover:scale-105 active:scale-95"
            >
              <span>Explorar softwares</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/catalogo?tab=assinaturas"
              className="flex items-center justify-center px-8 py-4 md:px-12 md:py-5 text-base md:text-lg lg:text-xl font-bold text-white bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/80 rounded-2xl md:rounded-3xl border border-sky-500/30 hover:border-sky-500/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_25px_rgba(2,132,199,0.15)] transition-all duration-300 group whitespace-nowrap hover:scale-105 active:scale-95"
            >
              <span>Planos de Assinatura</span>
              <span className="ml-2.5 px-2 py-0.5 text-[10px] font-extrabold bg-sky-500 text-white rounded-md uppercase tracking-wider animate-pulse shrink-0">
                Novo
              </span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 5. Laptop AutoCAD Mockup (Static Image Only) */}
          <div 
            className="w-full max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mt-4 md:mt-12 transition-all duration-500"
            style={{ transform: 'translate3d(0, calc(var(--scroll-y, 0px) * 0.03), 0)' }}
          >
            <img 
              src="/images/laptop_autocad.png" 
              alt="Mockup do software AutoCAD em um notebook de alta performance" 
              className="w-full h-auto select-none pointer-events-none block border-0 drop-shadow-[0_20px_35px_rgba(7,212,243,0.12)]"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg className="relative block w-full h-[40px] md:h-[80px]" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,80 Q720,20 1440,80 L1440,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Down Arrow (Placed outside Hero to prevent clipping by overflow-hidden) */}
      <div className="relative z-30 h-0 w-full flex justify-center pointer-events-none">
        <button 
          onClick={() => {
            const nextSection = document.getElementById('confidence-section');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="absolute -translate-y-1/2 w-8 h-8 md:w-10 h-10 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(2,132,199,0.2)] flex items-center justify-center border border-slate-100/50 pointer-events-auto cursor-pointer animate-bounce transition-all duration-300 focus:outline-none"
          aria-label="Rolar para baixo"
        >
          <ChevronDown className="w-4 h-4 md:w-5 h-5 text-sky-500" />
        </button>
      </div>

      {/* 2. CONFIDENCE SECTION */}
      <section id="confidence-section" className="py-12 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => (
              <div 
                key={i} 
                className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-slate-200 transition-all duration-300 flex items-start space-x-4 text-left"
              >
                <div className="p-3 bg-white rounded-xl shadow-sm shrink-0 border border-slate-100">
                  {badge.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm text-slate-950">{badge.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATALOG SECTION */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-[11px] font-extrabold text-accent-blue uppercase tracking-wider">
              Loja Completa
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Encontre o software ideal para o seu projeto
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Explore nossa seleção de ferramentas profissionais de alta performance com licença alternativa e pagamento único.
            </p>
          </div>

          {/* Dynamic Catalog Notice Banner */}
          <div className="max-w-4xl mx-auto mb-8 bg-sky-50/70 border border-sky-100/80 rounded-2xl p-4 text-center flex flex-col md:flex-row items-center justify-center gap-2 text-sky-950 text-sm shadow-sm select-none">
            <span className="font-bold flex items-center justify-center text-accent-blue shrink-0">
              💡 Apenas Alguns Destaques:
            </span>
            <span>
              Esta é uma vitrine rotativa. Temos dezenas de outros softwares profissionais disponíveis em nosso catálogo completo!
            </span>
          </div>

          {/* Categories Slider/Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-none justify-start md:justify-center -mx-4 px-4 gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 border ${
                  activeCategory === category
                    ? 'bg-slate-900 border-slate-900 text-white shadow'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Carousel */}
          {filteredProducts.length > 0 ? (
            <div className="relative group/carousel w-full">
              {/* Left Navigation Arrow */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-30 w-11 h-11 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>

              {/* Scrollable Container */}
              <div
                ref={carouselRef}
                className="flex overflow-x-auto gap-6 pb-6 pt-2 px-1 scroll-smooth scrollbar-none snap-x snap-mandatory"
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
              >
                {filteredProducts.map((product) => (
                  <div key={product.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start flex flex-col">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Right Navigation Arrow */}
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-30 w-11 h-11 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 text-sm font-medium">Nenhum software cadastrado nesta categoria no momento.</p>
            </div>
          )}

          {/* View Catalog Button */}
          <div className="text-center mt-12">
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-sm font-bold text-slate-800 hover:text-slate-900 shadow-sm transition-all duration-200"
            >
              <span>Ver catálogo de softwares completo</span>
              <ArrowRight className="w-4 h-4 ml-2 text-slate-500" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3.5 PREMIUM SUBSCRIPTION CAROUSEL SECTION */}
      <section className="py-20 bg-gradient-to-b from-[#090d16] to-[#05070c] relative overflow-hidden border-b border-slate-900">
        {/* Subtle glowing ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-purple-500/10 to-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -right-32 bottom-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span>Novidade</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Planos de Assinatura Mensal
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Acesse ferramentas de design e criação líderes de mercado como <strong className="text-white font-semibold">Canva Pro</strong> e <strong className="text-white font-semibold">CapCut Pro</strong>. Sem fidelidade, com faturamento simplificado no Pix e suporte completo incluso.
            </p>
          </div>

          {/* Subscription Carousel */}
          {subscriptionProducts.length > 0 ? (
            <div className="relative group/sub-carousel w-full">
              {/* Left Navigation Arrow */}
              {subscriptionProducts.length > 2 && (
                <button
                  onClick={scrollSubLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-30 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none opacity-0 group-hover/sub-carousel:opacity-100 focus-visible:opacity-100"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Scrollable Container */}
              <div
                ref={subCarouselRef}
                className={`flex overflow-x-auto gap-6 pb-6 pt-2 px-1 scroll-smooth scrollbar-none snap-x snap-mandatory ${
                  subscriptionProducts.length <= 2 ? 'md:justify-center' : ''
                }`}
              >
                {subscriptionProducts.map((product) => (
                  <div key={product.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start flex flex-col">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Right Navigation Arrow */}
              {subscriptionProducts.length > 2 && (
                <button
                  onClick={scrollSubRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-30 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none opacity-0 group-hover/sub-carousel:opacity-100 focus-visible:opacity-100"
                  aria-label="Próximo"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800">
              <p className="text-slate-500 text-sm font-medium">Nenhuma assinatura cadastrada no momento.</p>
            </div>
          )}

          {/* View Catalog Button */}
          <div className="text-center mt-12">
            <Link
              to="/catalogo?tab=assinaturas"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white shadow-[0_4px_20px_rgba(147,51,234,0.25)] hover:shadow-[0_4px_25px_rgba(147,51,234,0.35)] transition-all duration-200 group"
            >
              <span>Ver todos os planos de assinatura</span>
              <ArrowRight className="w-4 h-4 ml-2 text-white/95 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-[11px] font-extrabold text-accent-blue uppercase tracking-wider">
              Praticidade
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Como funciona o processo de compra?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Da escolha do software ao uso pleno, sem complicação e com agilidade absoluta.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Visual connector line in desktop */}
            <div className="hidden md:block absolute top-10 left-12 right-12 h-0.5 bg-slate-100 -z-10"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200/80 shadow-sm flex items-center justify-center font-display font-extrabold text-lg text-accent-blue mx-auto relative group-hover:scale-105 transition-transform">
                  <span className="absolute inset-1.5 rounded-full bg-white border border-slate-100 flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <div className="space-y-1.5 max-w-xs mx-auto">
                  <h3 className="font-display font-bold text-base text-slate-900">{step.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SUPPORT BANNER */}
      <section className="relative bg-slate-900 text-white py-16 overflow-hidden">
        {/* Parallax Background Glows */}
        <div 
          className="absolute -right-24 -top-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl will-change-transform pointer-events-none"
          style={{ transform: 'translate3d(0, calc((var(--scroll-y, 0px) - 1500px) * 0.08), 0)' }}
        ></div>
        <div 
          className="absolute -left-24 -bottom-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl will-change-transform pointer-events-none"
          style={{ transform: 'translate3d(0, calc((var(--scroll-y, 0px) - 1500px) * -0.06), 0)' }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-block border border-emerald-500/20">
              Instalação Garantida
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Precisa de ajuda com a instalação?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Nossa equipe dedicada oferece orientação especializada para a correta instalação e configuração dos produtos adquiridos na C2Tech.
            </p>
            
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800 max-w-md mx-auto space-y-1 text-slate-300 text-xs sm:text-sm">
              <p>🕒 <strong>Atendimento de suporte:</strong> Segunda a Domingo, das 09:00 às 22:00.</p>
              <p className="text-slate-400 text-[11px]">Nota: Suporte exclusivo para clientes C2Tech. Poderá ser solicitado o e-mail informado na compra para localização do pedido.</p>
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5 mr-2 shrink-0" />
                Falar com suporte no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REVIEWS SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-[11px] font-extrabold text-accent-blue uppercase tracking-wider">
              Feedback Real
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Quem compra na C2Tech aprova
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Veja as avaliações reais enviadas por nossos clientes profissionais.
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {reviews.map((rev, i) => (
              <div 
                key={i} 
                className="bg-slate-50 rounded-3xl p-6 border border-slate-100/60 shadow-sm flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  {/* Stars */}
                  <div className="flex space-x-1">
                    {[...Array(rev.stars)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {/* Comment */}
                  <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
                {/* Author Info */}
                <div className="pt-6 border-t border-slate-200/40 mt-6">
                  <h4 className="font-display font-bold text-sm text-slate-900">{rev.author}</h4>
                  <p className="text-slate-500 text-[11px] font-medium">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-3 mb-12">
            <span className="text-[11px] font-extrabold text-accent-blue uppercase tracking-wider">
              FAQ Resumido
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Dúvidas frequentes de nossos clientes
            </h2>
            <p className="text-slate-600 text-sm">
              Confira as respostas para as perguntas mais comuns recebidas por nosso time.
            </p>
          </div>

          {/* Accordion FAQ */}
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-slate-900 hover:text-accent-blue transition-colors focus:outline-none"
                  aria-expanded={openFaqIndex === idx}
                >
                  <span className="text-sm sm:text-base pr-4">{item.q}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                
                {/* Toggleable answer */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaqIndex === idx ? 'max-h-64 border-t border-slate-50' : 'max-h-0'
                  }`}
                >
                  <div className="p-5 text-slate-600 text-xs sm:text-sm leading-relaxed bg-slate-50/50">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Help Notice / WhatsApp CTA */}
          <div className="mt-12 text-center p-6 bg-white rounded-3xl border border-slate-150 shadow-sm max-w-xl mx-auto space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
              Ainda tem alguma dúvida específica?
            </h3>
            <p className="text-slate-500 text-xs">
              Nosso time está online no WhatsApp para te ajudar a escolher a versão correta do software.
            </p>
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors duration-200"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Tirar dúvidas no WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
