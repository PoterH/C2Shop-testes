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
