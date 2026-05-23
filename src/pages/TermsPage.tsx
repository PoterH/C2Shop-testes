import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card wrapper */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 space-y-6">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 border-b border-slate-100 pb-4">
            Termos de Uso C2Tech
          </h1>
          
          <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4">
            <p>
              Seja bem-vindo ao site da <strong>C2Tech</strong>. Ao acessar e adquirir qualquer produto digital em nosso portal, você concorda expressamente com os termos estabelecidos a seguir. Recomendamos a leitura atenta antes de prosseguir com qualquer transação.
            </p>

            <h3 className="font-display font-bold text-slate-950 text-base mt-6">1. Escopo das Soluções Comercializadas</h3>
            <p>
              A C2Tech é especializada no fornecimento e distribuição de softwares digitais para computadores locais sob a modalidade de <strong>licença alternativa</strong>. 
            </p>
            <p>
              Os arquivos adquiridos destinam-se ao funcionamento completo e funcional da ferramenta selecionada em máquina local, com <strong>acesso vitalício</strong> para a versão específica comercializada no momento da compra (conforme descrito em cada anúncio).
            </p>

            <h3 className="font-display font-bold text-slate-950 text-base mt-6">2. Limitações de Recursos em Nuvem e Atualizações</h3>
            <p>
              Os softwares e ferramentas fornecidos pela C2Tech são projetados para execução local. Devido à natureza da licença alternativa, o comprador está ciente de que:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Não estão inclusos serviços ou recursos integrados de armazenamento em nuvem (como espaço de armazenamento no OneDrive).</li>
              <li>Não há acesso a recursos integrados de servidores de inteligência artificial corporativa que dependam de logins em contas online na nuvem do fabricante.</li>
              <li>Não estão inclusas atualizações de versão garantidas lançadas posteriormente pelos fabricantes. O software operará estritamente na versão indicada no anúncio.</li>
            </ul>

            <h3 className="font-display font-bold text-slate-950 text-base mt-6">3. Entrega e Acesso</h3>
            <p>
              A C2Tech utiliza sistemas automatizados de processamento. A entrega dos links de download e dos tutoriais passo a passo é efetuada de forma automática por e-mail imediatamente após a confirmação de pagamento do checkout seguro. O cliente é inteiramente responsável por informar o endereço de e-mail correto no formulário de compra.
            </p>

            <h3 className="font-display font-bold text-slate-950 text-base mt-6">4. Suporte Técnico de Instalação</h3>
            <p>
              Nos comprometemos a garantir que o software adquirido esteja pronto para uso. Para isso, oferecemos o serviço de <strong>instalação assistida</strong> remota nos casos em que o comprador enfrente dificuldades ou encontre erros no processo de instalação autônomo. 
            </p>
            <p>
              O suporte é restrito à inicialização e funcionamento básico local do software, não englobando cursos de usabilidade, modelagens sob demanda, plugins externos de terceiros ou configurações avançadas de infraestrutura de rede corporativa do cliente.
            </p>

            <h3 className="font-display font-bold text-slate-950 text-base mt-6">5. Requisitos de Sistema e Responsabilidade</h3>
            <p>
              Cada software possui requisitos mínimos de hardware e sistema operacional descritos em sua respectiva página de detalhes. É responsabilidade exclusiva do cliente garantir que seu equipamento atenda a essas especificações técnicas antes de efetuar o pedido.
            </p>

            <h3 className="font-display font-bold text-slate-950 text-base mt-6">6. Modificações dos Termos</h3>
            <p>
              A C2Tech reserva-se o direito de modificar estes Termos de Uso a qualquer momento, visando adequar-se a mudanças técnicas, regulamentares ou de processos internos. A navegação contínua no site após a publicação de novos termos constitui aceitação tácita.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
