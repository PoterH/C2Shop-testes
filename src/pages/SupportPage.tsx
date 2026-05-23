import React from 'react';
import { MessageSquare, Clock, ShieldAlert, HelpCircle } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const whatsappNumber = '5581997349300'; // Substitua pelo seu número real do WhatsApp
  const whatsappMessage = encodeURIComponent('Olá, sou cliente da C2Tech e gostaria de solicitar suporte de instalação para o meu software.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="bg-emerald-500/10 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-block">
            Suporte Técnico Especializado
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Central de Suporte C2Tech
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto text-center">
            Precisa de ajuda com a instalação ou configuração de seu produto? Nossa equipe técnica está pronta para te atender.
          </p>
        </div>

        {/* Support Options and Details */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* Main Info */}
          <div className="space-y-4">
            <h2 className="font-display font-extrabold text-xl text-slate-900">
              Como solicitar assistência?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Todos os produtos comercializados na C2Tech acompanham tutoriais passo a passo autoexplicativos. No entanto, caso você tenha alguma dificuldade no processo, oferecemos o serviço de <strong>instalação assistida</strong> via suporte remoto (utilizando softwares como AnyDesk ou TeamViewer).
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Clock / Hours */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3.5">
              <Clock className="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Horário de Atendimento</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Segunda a Domingo<br />
                  <strong>Das 09:00 às 22:00</strong>
                </p>
              </div>
            </div>

            {/* Scope / Requirement */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3.5">
              <ShieldAlert className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Verificação de Pedido</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  O suporte é exclusivo para clientes. Favor informar o <strong>nome completo e e-mail</strong> usados na compra ao iniciar o chat.
                </p>
              </div>
            </div>

          </div>

          {/* Warning Note */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed space-y-1">
              <p className="font-bold text-slate-800">Escopo do suporte técnico:</p>
              <p>
                O suporte assistido é restrito à correta instalação, ativação e inicialização do software adquirido. A equipe C2Tech não oferece treinamentos de uso profissional, consultoria de projetos ou suporte a plugins/extensões adicionais de terceiros não descritos no produto.
              </p>
            </div>
          </div>

          {/* CTA WhatsApp Button */}
          <div className="text-center pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Falar com suporte no WhatsApp
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
