import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Mail, Settings, ArrowRight, MessageSquare } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      icon: <ShoppingBag className="w-8 h-8 text-sky-600" />,
      title: '1. Escolha o Software',
      desc: 'Navegue pelo nosso catálogo completo contendo as principais soluções profissionais de engenharia, arquitetura, design e produtividade do mercado. Escolha a versão adequada ao seu sistema operacional (Windows ou macOS).'
    },
    {
      icon: <CreditCard className="w-8 h-8 text-emerald-600" />,
      title: '2. Finalize o Pedido',
      desc: 'Adicione o produto ao carrinho e finalize a compra de forma ágil e segura em nosso checkout protegido por criptografia SSL. Você pode efetuar o pagamento via Pix (aprovação imediata) ou Cartão de Crédito.'
    },
    {
      icon: <Mail className="w-8 h-8 text-sky-600" />,
      title: '3. Receba no E-mail',
      desc: 'Segundos após a confirmação do pagamento, nosso sistema envia automaticamente um e-mail contendo os links de download direto dos arquivos e um tutorial passo a passo ilustrado extremamente simples de seguir.'
    },
    {
      icon: <Settings className="w-8 h-8 text-emerald-600" />,
      title: '4. Instalação e Pronto para Uso',
      desc: 'Baixe os arquivos e siga o tutorial de instalação para obter a versão completa e funcional do software com acesso vitalício. Caso surja qualquer dúvida, nossa equipe de suporte remoto estará pronta para auxiliar.'
    }
  ];

  const whatsappNumber = '5581997349300'; // Substitua pelo seu número real do WhatsApp
  const whatsappMessage = encodeURIComponent('Olá, gostaria de saber mais sobre o funcionamento da entrega e do suporte da C2Tech.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="bg-emerald-500/10 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-block">
            Processo Simples e Transparente
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Como funciona a C2Tech?
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto text-center">
            Entenda detalhadamente cada etapa da sua jornada, desde a escolha do software até a instalação no seu computador.
          </p>
        </div>

        {/* Steps Detailed Card List */}
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shrink-0">
                {step.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action banner */}
        <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-6">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
            Pronto para adquirir seu software profissional?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Acesso vitalício, pagamento único e suporte de instalação dedicado ao seu dispor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to="/catalogo"
              className="px-6 py-3.5 bg-accent-blue hover:bg-accent-blue-dark text-white font-bold rounded-2xl shadow hover:shadow-lg transition-all flex items-center justify-center"
            >
              Navegar no catálogo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-755 text-slate-200 hover:text-white font-bold rounded-2xl border border-slate-700 transition-all flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 text-emerald-500 mr-2" />
              Tirar dúvidas no WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
