import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      q: 'Como recebo o acesso ao software que comprei?',
      a: 'A entrega é automática. Logo após o checkout seguro e aprovação do pagamento, você receberá um e-mail com os links para download dos arquivos de instalação e tutoriais passo a passo. Verifique sua Caixa de Entrada, Lixo Eletrônico, Spam e Aba de Promoções.'
    },
    {
      q: 'O que significa licença alternativa?',
      a: 'Trata-se de uma modalidade de licenciamento voltada para computadores locais que garante o funcionamento completo e funcional do software sem necessidade de login em contas oficiais na nuvem ou pagamentos mensais. O acesso é permanente e de uso ilimitado.'
    },
    {
      q: 'O acesso ao software realmente é vitalício?',
      a: 'Sim, o acesso é vitalício para a versão específica que você adquiriu. Você paga apenas uma vez e utiliza o programa localmente por tempo ilimitado, eliminando mensalidades e assinaturas recorrentes.'
    },
    {
      q: 'As atualizações de versão estão inclusas?',
      a: 'Não. O software é fornecido na versão informada (por exemplo, AutoCAD 2027 ou Revit 2027) e não inclui direito a upgrades automáticos para novas versões lançadas posteriormente pelo fabricante.'
    },
    {
      q: 'A C2Tech auxilia na instalação do software?',
      a: 'Sim! Todos os nossos produtos acompanham manuais detalhados e ilustrados. Caso surjam dificuldades ou erros durante a instalação, nossa equipe técnica está disponível para suporte de instalação assistida remota.'
    },
    {
      q: 'Os softwares funcionam em computadores Mac?',
      a: 'Apenas os softwares descritos explicitamente como compatíveis com macOS (ex: "Office 2024 para Mac"). A maioria dos softwares profissionais de engenharia e modelagem pesada oferecidos são compatíveis exclusivamente com Windows.'
    },
    {
      q: 'Posso reinstalar o software se eu formatar o computador?',
      a: 'Sim. Os arquivos e instruções de instalação ficam salvos no seu e-mail e você poderá acessá-los e reinstalar o programa na mesma máquina sempre que precisar.'
    },
    {
      q: 'Quais são as formas de pagamento disponíveis?',
      a: 'Oferecemos pagamento rápido via Pix (com liberação e entrega imediata), além de cartões de crédito (com parcelamento).'
    },
    {
      q: 'Recebo nota fiscal da compra?',
      a: 'Configurações de emissão de documento fiscal e dados de faturamento podem ser configuradas pelo comprador ou solicitadas por meio dos nossos canais de suporte técnico (Espaço reservado para configuração do lojista).'
    },
    {
      q: 'Posso realizar a compra diretamente pelo WhatsApp?',
      a: 'Sim! Caso prefira sanar dúvidas específicas sobre requisitos mínimos de sistema antes de fechar a compra, nossa equipe de vendas poderá te guiar e finalizar o processo via chat.'
    },
    {
      q: 'Como funcionam os planos de assinatura mensal?',
      a: 'Para softwares específicos (como Canva Pro e CapCut Pro), oferecemos opções de assinatura mensal exclusiva via Pix. O acesso é válido por 30 dias com renovação a cada mês.'
    },
    {
      q: 'O que recebo ao assinar um plano mensal?',
      a: 'Ao adquirir uma assinatura, você receberá credenciais de login e senha oficiais no seu e-mail de compra para logar diretamente na ferramenta. Para garantir a segurança e evitar lotação de acessos simultâneos na mesma conta, trocamos/atualizamos as senhas periodicamente e enviamos a você as novas credenciais.'
    }
  ];

  const whatsappNumber = '5581997349300'; // Substitua pelo seu número real do WhatsApp
  const whatsappMessage = encodeURIComponent('Olá, tenho uma dúvida e gostaria de falar com a equipe da C2Tech.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="bg-sky-500/10 text-sky-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-block">
            Central de Dúvidas
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Perguntas Frequentes (FAQ)
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto text-center">
            Esclareça suas dúvidas gerais sobre entrega, licenciamento vitalício, suporte remoto e compatibilidade.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-slate-900 hover:text-accent-blue transition-colors focus:outline-none"
                aria-expanded={openIndex === idx}
              >
                <span className="text-sm sm:text-base pr-4">{item.q}</span>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === idx ? 'max-h-96 border-t border-slate-50' : 'max-h-0'
                }`}
              >
                <div className="p-5 text-slate-600 text-xs sm:text-sm leading-relaxed bg-slate-50/50">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Callout */}
        <div className="mt-12 text-center p-8 bg-white rounded-3xl border border-slate-150 shadow-sm space-y-4 max-w-xl mx-auto">
          <HelpCircle className="w-8 h-8 text-sky-500 mx-auto" />
          <h3 className="font-display font-bold text-slate-900 text-base">
            Sua dúvida não está listada aqui?
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Não se preocupe! Fale agora mesmo com nosso atendimento humano no WhatsApp e tire todas as suas dúvidas em minutos.
          </p>
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Falar no WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
