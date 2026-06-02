import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Shield, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const whatsappNumber = '5581997349300';
  const whatsappMessage = encodeURIComponent('Olá, tenho interesse em um software da C2Tech e gostaria de tirar uma dúvida.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer className="relative bg-[#020617] text-slate-400 py-16 overflow-hidden z-0 border-t border-slate-950">
      
      {/* Morphing Glowing Background Blobs (Similar to the Hero) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] md:w-[500px] md:h-[500px] opacity-40">
          <div className="w-full h-full bg-gradient-to-br from-[#00d2ff]/20 via-[#0066FF]/15 to-[#0a21a5]/20 rounded-full blur-[80px] md:blur-[120px] animate-morph-blob-1"></div>
        </div>
        <div className="absolute -bottom-10 -right-20 w-[350px] h-[350px] md:w-[500px] md:h-[500px] opacity-40">
          <div className="w-full h-full bg-gradient-to-tr from-[#0066FF]/18 via-[#00d2ff]/15 to-[#0a21a5]/18 rounded-full blur-[80px] md:blur-[120px] animate-morph-blob-2"></div>
        </div>
        
        {/* Subtle Tech Grid Overlay */}
        <div className="absolute inset-0 bg-grid-tech opacity-40"></div>
        <div className="absolute inset-0 bg-dot-tech opacity-30"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glassmorphism Card Wrapper */}
        <div className="bg-slate-950/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Column 1 & 2: Brand Info */}
            <div className="space-y-6 col-span-1 md:col-span-2">
              <Link to="/" className="inline-block">
                <img 
                  src="/images/logo.png" 
                  alt="Logo C2Tech" 
                  className="w-10 h-10 rounded-xl object-cover shadow-[0_0_15px_rgba(7,212,243,0.25)] hover:scale-105 transition-transform duration-300" 
                />
              </Link>
              <div className="space-y-3">
                <h2 className="text-white text-lg sm:text-xl font-bold font-display tracking-tight leading-snug">
                  Você foca no projeto. A C2Tech cuida do resto.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                  Oferecemos soluções digitais profissionais com entrega rápida, acesso vitalício e suporte de instalação assistida. Adquira softwares robustos sem assinaturas e sem taxas recorrentes.
                </p>
              </div>
              
              {/* Circular Social Buttons with Glassmorphism */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-slate-950/50 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-center transition-all duration-300 text-slate-400 hover:text-emerald-400 group shadow-sm"
                  aria-label="WhatsApp Suporte"
                >
                  <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="https://www.instagram.com/c2techoficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-slate-950/50 hover:bg-pink-500/10 border border-slate-800 hover:border-pink-500/40 flex items-center justify-center transition-all duration-300 text-slate-400 hover:text-pink-400 group shadow-sm"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@C2Tech.Oficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-slate-950/50 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/40 flex items-center justify-center transition-all duration-300 text-slate-400 hover:text-red-500 group shadow-sm"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 3: Atalhos */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold font-display text-base tracking-tight">Atalhos</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/" className="hover:text-white hover:underline decoration-sky-500/50 underline-offset-4 transition-all">
                    Início
                  </Link>
                </li>
                <li>
                  <Link to="/catalogo" className="hover:text-white hover:underline decoration-sky-500/50 underline-offset-4 transition-all">
                    Catálogo de Softwares
                  </Link>
                </li>
                <li>
                  <Link to="/como-funciona" className="hover:text-white hover:underline decoration-sky-500/50 underline-offset-4 transition-all">
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link to="/suporte" className="hover:text-white hover:underline decoration-sky-500/50 underline-offset-4 transition-all">
                    Suporte Técnico
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white hover:underline decoration-sky-500/50 underline-offset-4 transition-all">
                    FAQ / Dúvidas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold font-display text-base tracking-tight">Legal</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/termos" className="flex items-center hover:text-white hover:underline decoration-sky-500/50 underline-offset-4 transition-all">
                    <FileText className="w-4 h-4 mr-2 text-slate-500" />
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="/privacidade" className="flex items-center hover:text-white hover:underline decoration-sky-500/50 underline-offset-4 transition-all">
                    <Shield className="w-4 h-4 mr-2 text-slate-500" />
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Contato & Info */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold font-display text-base tracking-tight">Fale conosco</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-slate-500" />
                  <a href="mailto:c2tech2025@gmail.com" className="hover:text-white transition-colors break-all">
                    c2tech2025@gmail.com
                  </a>
                </li>
                <li className="pt-3 border-t border-slate-800/60">
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                      Servidores Online
                    </span>
                    <span className="flex items-center text-xs text-slate-500">
                      SSL Criptografado
                    </span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Payment Methods & Security Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8 pt-8 border-t border-slate-800/60">
            {/* Left: Payment Methods */}
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
                Meios de Pagamento
              </span>
              <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start items-center">
                {/* Pix */}
                <div className="h-8 w-14 bg-white rounded-lg border border-slate-200/50 flex items-center justify-center p-1 hover:scale-105 transition-all duration-200 shadow-sm" title="Pix">
                  <svg viewBox="0 0 72 32" className="h-full w-full object-contain" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(8, 3)">
                      <path d="M13.2 2.1c-.2-.2-.5-.2-.7 0L7.3 7.3c-.3.3-.3.8 0 1.1l5.2 5.2c.2.2.5.2.7 0l5.2-5.2c.3-.3.3-.8 0-1.1L13.2 2.1zm-6.8 6.8c-.2-.2-.5-.2-.7 0L.5 14.1c-.3.3-.3.8 0 1.1l5.2 5.2c.2.2.5.2.7 0l5.2-5.2c.3-.3.3-.8 0-1.1l-5.2-5.2zm13.6 0c-.2-.2-.5-.2-.7 0l-5.2 5.2c-.3.3-.3.8 0 1.1l5.2 5.2c.2.2.5.2.7 0l5.2-5.2c.3-.3.3-.8 0-1.1l-5.2-5.2zm-6.8 6.8c-.2-.2-.5-.2-.7 0l-5.2 5.2c-.3.3-.3.8 0 1.1l5.2 5.2c.2.2.5.2.7 0l5.2-5.2c.3-.3.3-.8 0-1.1l-5.2-5.2z" fill="#32BCAD" />
                      <text x="30" y="19" fill="#32BCAD" fontFamily="sans-serif" fontWeight="950" fontSize="17.5" letterSpacing="0.2">pix</text>
                    </g>
                  </svg>
                </div>
                {/* Mastercard */}
                <div className="h-8 w-14 bg-white rounded-lg border border-slate-200/50 flex items-center justify-center p-1 hover:scale-105 transition-all duration-200 shadow-sm" title="Mastercard">
                  <svg viewBox="0 0 85 50" className="h-full w-full object-contain" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="25" r="21" fill="#FF1E00" />
                    <circle cx="56" cy="25" r="21" fill="#FF9900" />
                    <g fill="#FF5F00">
                      <path d="M 42 7 A 21 21 0 0 1 42 43 A 21 21 0 0 1 42 7 Z" opacity="0.4"/>
                    </g>
                    <text x="42" y="29" fill="#FFFFFF" fontFamily="Impact, Arial Black, sans-serif" fontWeight="bold" fontStyle="italic" fontSize="9.5" textAnchor="middle" stroke="#000000" strokeWidth="1.2" paintOrder="stroke fill">MasterCard</text>
                  </svg>
                </div>
                {/* Visa */}
                <div className="h-8 w-14 bg-white rounded-lg border border-slate-200/50 flex items-center justify-center p-1 hover:scale-105 transition-all duration-200 shadow-sm" title="Visa">
                  <svg viewBox="0 0 100 32" className="h-full w-full object-contain" xmlns="http://www.w3.org/2000/svg">
                    <g transform="skewX(-12) translate(10, 0)">
                      <path d="M5 6 L18 6 L12 18 L2 18 Z" fill="#F7A21C" />
                      <text x="14" y="26" fill="#0E4595" fontFamily="sans-serif" fontWeight="950" fontSize="26" fontStyle="italic" letterSpacing="-1.5">VISA</text>
                    </g>
                  </svg>
                </div>
                {/* Amex */}
                <div className="h-8 w-14 bg-white rounded-lg border border-slate-200/50 flex items-center justify-center p-1.5 hover:scale-105 transition-all duration-200 shadow-sm" title="American Express">
                  <svg viewBox="0 0 50 50" className="h-full w-full object-contain" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="3" fill="#0077A6" />
                    <text x="25" y="18" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="5.5" textAnchor="middle" letterSpacing="0.2">AMERICAN</text>
                    <text x="25" y="28" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="950" fontSize="7.5" textAnchor="middle" letterSpacing="0.4">EXPRESS</text>
                    <circle cx="6" cy="41" r="1.2" fill="none" stroke="#FFFFFF" strokeWidth="0.4"/>
                    <text x="6" y="42.2" fill="#FFFFFF" fontFamily="sans-serif" fontSize="2" textAnchor="middle" fontWeight="bold">R</text>
                  </svg>
                </div>
                {/* PayPal */}
                <div className="h-8 w-14 bg-white rounded-lg border border-slate-200/50 flex items-center justify-center p-1 hover:scale-105 transition-all duration-200 shadow-sm" title="PayPal">
                  <svg viewBox="0 0 110 32" className="h-full w-full object-contain" xmlns="http://www.w3.org/2000/svg">
                    <g transform="skewX(-12) translate(8, 0)">
                      <g transform="translate(0, 2)">
                        <path d="M7.5 2 L1.5 25 L6.5 25 L7.8 19 L11.5 19 C15 19 17.5 17 18.2 13 C18.9 9 16.5 6 12 6 H7.5 L7.5 2 Z" fill="#003087" />
                        <path d="M11 7 L5 30 L10 30 L11.3 24 L15 24 C18.5 24 21 22 21.7 18 C22.4 14 20 11 15.5 11 H11 L11 7 Z" fill="#0079C1" opacity="0.9" />
                      </g>
                      <text x="26" y="24" fill="#003087" fontFamily="sans-serif" fontWeight="950" fontStyle="italic" fontSize="19" letterSpacing="-0.8">Pay</text>
                      <text x="59" y="24" fill="#0079C1" fontFamily="sans-serif" fontWeight="950" fontStyle="italic" fontSize="19" letterSpacing="-0.8">Pal</text>
                    </g>
                  </svg>
                </div>
                {/* Hipercard */}
                <div className="h-8 w-14 bg-white rounded-lg border border-slate-200/50 flex items-center justify-center p-1 hover:scale-105 transition-all duration-200 shadow-sm" title="Hipercard">
                  <svg viewBox="0 0 120 45" className="h-full w-full object-contain" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="6" width="100" height="33" rx="6" fill="#B0101A" transform="skewX(-14)" />
                    <text x="58" y="27" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="950" fontStyle="italic" fontSize="14" textAnchor="middle" letterSpacing="-0.5">Hipercard</text>
                  </svg>
                </div>
                {/* Elo */}
                <div className="h-8 w-14 bg-white rounded-lg border border-slate-200/50 flex items-center justify-center p-1 hover:scale-105 transition-all duration-200 shadow-sm" title="Elo">
                  <svg viewBox="0 0 50 50" className="h-full w-full object-contain" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="23" fill="#111111" />
                    <text x="14" y="32" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="16" letterSpacing="-0.5">el</text>
                    <g transform="translate(34, 25) scale(0.7)">
                      <path d="M -8 -3 A 9 9 0 0 1 3 -9" fill="none" stroke="#E21B26" strokeWidth="4" strokeLinecap="round"/>
                      <path d="M 5 -6 A 9 9 0 0 1 8 5" fill="none" stroke="#00A2E2" strokeWidth="4" strokeLinecap="round"/>
                      <path d="M 6 8 A 9 9 0 0 1 -7 5" fill="none" stroke="#F4A21A" strokeWidth="4" strokeLinecap="round"/>
                    </g>
                  </svg>
                </div>
                {/* Boleto */}
                <div className="h-8 w-14 bg-white rounded-lg border border-slate-200/50 flex items-center justify-center p-1 hover:scale-105 transition-all duration-200 shadow-sm" title="Boleto Bancário">
                  <svg viewBox="0 0 65 50" className="h-full w-full object-contain" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(8, 6) scale(0.7)">
                      <rect x="0" y="0" width="6" height="32" fill="#000" />
                      <rect x="9" y="0" width="2" height="32" fill="#000" />
                      <rect x="13" y="0" width="8" height="32" fill="#000" />
                      <rect x="24" y="0" width="3" height="32" fill="#000" />
                      <rect x="30" y="0" width="6" height="32" fill="#000" />
                      <rect x="39" y="0" width="2" height="32" fill="#000" />
                      <rect x="43" y="0" width="8" height="32" fill="#000" />
                      <rect x="54" y="0" width="3" height="32" fill="#000" />
                      <rect x="60" y="0" width="6" height="32" fill="#000" />
                    </g>
                    <text x="32.5" y="36" fill="#000000" fontFamily="sans-serif" fontWeight="900" fontSize="6.5" textAnchor="middle" letterSpacing="-0.1">Boleto</text>
                    <text x="32.5" y="43" fill="#000000" fontFamily="sans-serif" fontWeight="900" fontSize="6.5" textAnchor="middle" letterSpacing="-0.1">Bancário</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Security Certificates */}
            <div className="space-y-3 text-center lg:text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
                Segurança
              </span>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-end items-center">
                {/* Selo Compra 100% Segura */}
                <div className="flex items-center space-x-2.5 bg-slate-900/40 border border-emerald-500/20 rounded-2xl px-4 py-2 hover:border-emerald-500/40 transition-colors shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 stroke-current fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-extrabold text-white leading-tight uppercase tracking-wider">Compra 100% Segura</p>
                    <p className="text-[8px] text-slate-450 text-slate-400 leading-none">Criptografia SSL (HTTPS)</p>
                  </div>
                </div>

                {/* Selo Loja Protegida */}
                <div className="flex items-center space-x-2.5 bg-slate-900/40 border border-sky-500/20 rounded-2xl px-4 py-2 hover:border-sky-500/40 transition-colors shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 stroke-current fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-extrabold text-white leading-tight uppercase tracking-wider">Loja Protegida</p>
                    <p className="text-[8px] text-slate-450 text-slate-400 leading-none">Ambiente 100% Seguro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <hr className="border-slate-800/60 my-10" />

          {/* Legal Compliance Text (Licença Alternativa) - Clean styling */}
          <div className="text-[11px] text-slate-500/80 space-y-3 max-w-5xl leading-relaxed">
            <p>
              <strong>Nota informativa importante:</strong> Os produtos comercializados neste site são fornecidos sob a modalidade de <strong>licença alternativa</strong> para uso pessoal e profissional de forma local. O acesso adquirido é <strong>vitalício</strong> para a versão específica comprada, configurada para funcionamento em máquina local sem necessidade de assinaturas recorrentes ou mensalidades.
            </p>
            <p>
              Não estão inclusos serviços integrados em nuvem ou atualizações automáticas de versão que dependam de servidores de assinatura externa (como armazenamento em nuvem OneDrive, recursos de inteligência artificial online de servidores remotos, ou bibliotecas integradas em nuvem). Os softwares são entregues prontos para uso em suas versões completas e funcionais com instruções detalhadas para auto-instalação ou com auxílio do nosso serviço de suporte remoto quando necessário.
            </p>
          </div>

          {/* Separator */}
          <hr className="border-slate-800/60 my-6" />

          {/* Bottom Bar: Copyright & CNPJ */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p className="text-center sm:text-left">
              &copy; {currentYear} C2Tech. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
            </p>
            <div className="text-slate-600 text-[10px]">
              Foco no projeto, tecnologia ao seu alcance.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
