export interface Review {
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export const reviewsData: Record<string, Review[]> = {
  autocad_2027_win: [
    {
      author: "Rodrigo S. Lima",
      rating: 5,
      date: "2 dias atrás",
      comment: "Instalou de primeira, meu note antigo rodo muito bem. Vendedor ajudou por video na hr da instalacao"
    },
    {
      author: "Lucas Menezes",
      rating: 5,
      date: "1 semana atrás",
      comment: "muito bom, veio certinho no email e a intalacao foi bem rapida. recomendo mt"
    },
    {
      author: "Marcos A. Fonseca",
      rating: 4,
      date: "2 semanas atrás",
      comment: "uso no escritorio td dia, funcioando 100% ate agora. so tive q desativar o antivirus antes mas deu td certo."
    },
    {
      author: "Julio Cesar",
      rating: 5,
      date: "3 semanas atrás",
      comment: "Melhor compra q ja fiz, ajuda mt no dia a dia da faculdade de civil"
    },
    {
      author: "Ana Carolina V.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Veio completo, sem frescura de assinatura. Vale cada centavo"
    },
    {
      author: "Eng. Pedro M.",
      rating: 5,
      date: "1 mês atrás",
      comment: "suporte de vcs é nota mil! me ligaram pelo whatsapp e resolveram uma pendencia de dll aq. mto grato"
    },
    {
      author: "Marcelo A.",
      rating: 4,
      date: "2 meses atrás",
      comment: "o programa é otimo, so achei a instalação um pouco demorada pela minha internet, mas rodou perfeito."
    }
  ],
  autocad_2027_mac: [
    {
      author: "Felipe G. Dias",
      rating: 5,
      date: "3 dias atrás",
      comment: "caramba rodou liso dmais no meu macbook m2. tava com medo de n dar certo por causa do m2 mas fico top"
    },
    {
      author: "Juliana Costa",
      rating: 5,
      date: "1 semana atrás",
      comment: "Mto bom msm! O suporte e super atencioso e responde rapido no whatsapp. salvou meu TCC"
    },
    {
      author: "Thiago Ramos",
      rating: 4,
      date: "3 semanas atrás",
      comment: "Otimo custo beneficio, roda nativo no mac e nao precisa de nenhuma gambiarra"
    },
    {
      author: "Mariana S.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Gostei muito. Roda direto sem precisar de emulador nem nada. Recomendo mto."
    }
  ],
  revit_2027: [
    {
      author: "Eng. Pedro Alencar",
      rating: 5,
      date: "Ontem",
      comment: "rapaz, o revit ta muito bom. a versao 2027 ta mais leve q as anteriores, curti dmais"
    },
    {
      author: "Beatriz Nogueira",
      rating: 5,
      date: "5 dias atrás",
      comment: "entrega foi na hora, o email chegou com o link e o tutorial bem detalhado. recomendo"
    },
    {
      author: "Carlos E. Souza",
      rating: 5,
      date: "2 semanas atrás",
      comment: "suporte me ajudou a instalar remoto pq sou meio lerdo com essas coisa kkkkk nota 10"
    },
    {
      author: "Ricardo F. Cruz",
      rating: 5,
      date: "3 semanas atrás",
      comment: "Muito bom msm o BIM dele ta funcionando 100%, todos os templates abrindo certin"
    },
    {
      author: "Daniela V.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Excelente, comprei pra usar no estagio e foi mt facil configurar"
    },
    {
      author: "Matheus N.",
      rating: 4,
      date: "2 meses atrás",
      comment: "Tudo certo, apenas o tutorial q podia ser um pouco mais curto mas fora isso o programa ta perfeito"
    }
  ],
  inventor_pro_2027: [
    {
      author: "Mateus Ribeiro",
      rating: 5,
      date: "4 dias atrás",
      comment: "Muito bom o software, pra quem trabalha com projetos mecanicos nao tem melhor. Ativou vitalicio certin"
    },
    {
      author: "André G. Silva",
      rating: 5,
      date: "1 semana atrás",
      comment: "tudo certo, recomendo a todos do ML e do site. Roda liso na minha rtx"
    },
    {
      author: "Renato Oliveira",
      rating: 4,
      date: "2 semanas atrás",
      comment: "demorou uns 5 minutinhos pra chegar o e-mail mas deu tudo certo e ta funcionando perfeito."
    }
  ],
  civil3d_2027: [
    {
      author: "José A. Santos",
      rating: 5,
      date: "3 dias atrás",
      comment: "comprei pro meu pai q e engenheiro de estradas, ele adorou, instalou facinho e ta usando td dia"
    },
    {
      author: "Luiz Fernando",
      rating: 5,
      date: "1 semana atrás",
      comment: "Mt bom msm, versao 2027 rodando sem travar com os arquivos pesados de topografia."
    },
    {
      author: "Mariana K.",
      rating: 4,
      date: "2 semanas atrás",
      comment: "Muito facil o passo a passo, qualquer um consegue. Recomendo dmais a loja"
    },
    {
      author: "Gustavo Mendes",
      rating: 5,
      date: "1 mês atrás",
      comment: "Tudo otimo, ja fiz 3 loteamento nele essa semana e nao deu nenhum crash."
    }
  ],
  navisworks_2027: [
    {
      author: "Fernando A. Rocha",
      rating: 5,
      date: "5 dias atrás",
      comment: "essencial pra ver compatibilizacao de projeto aki na empresa, funcionou perfeito"
    },
    {
      author: "Priscila M.",
      rating: 5,
      date: "1 semana atrás",
      comment: "o clash detector rodando liso aq. Preço otimo e entrega super rapida"
    },
    {
      author: "Gustavo B.",
      rating: 5,
      date: "3 semanas atrás",
      comment: "Muto bom, recomendo msm, o suporte me atendeu no zap rapidao pra tirar uma duvida."
    }
  ],
  sketchup_2026_win: [
    {
      author: "Ana Julia M.",
      rating: 5,
      date: "2 dias atrás",
      comment: "Uso pra fazer meus design de interiores, melhor compra q fiz esse ano. Super leve e facil"
    },
    {
      author: "Bruno F. Silveira",
      rating: 5,
      date: "6 dias atrás",
      comment: "Recomendo dmais, veio com todos os passos bem explicados e instalei em 5 minutos"
    },
    {
      author: "Diego Barbosa",
      rating: 4,
      date: "1 semana atrás",
      comment: "Otimo preço e funciona perfeitamente no windows 11. Tudo certinho."
    },
    {
      author: "Carolina Reis",
      rating: 5,
      date: "2 semanas atrás",
      comment: "Muito top, ja to usando com varios blocos pesados aq e nao travou nenhuma vez"
    },
    {
      author: "Mauricio L.",
      rating: 5,
      date: "3 semanas atrás",
      comment: "comprei e o link veio na hora. Suporte atencioso dms tirou duvida de plugin"
    },
    {
      author: "Fagner S.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Muito facil, o instalador faz quase tudo sozinho kkkkk indico mt"
    },
    {
      author: "Gabriela O.",
      rating: 4,
      date: "1 mês atrás",
      comment: "Gostei muito, funciona tudo e nao da aquelas telas de erro de licença"
    }
  ],
  sketchup_2026_mac: [
    {
      author: "Gabriel K.",
      rating: 5,
      date: "3 dias atrás",
      comment: "Instalou no meu macbook m1 de primeira, rodando super fluido. Nota 10"
    },
    {
      author: "Carla R. Pontes",
      rating: 5,
      date: "1 semana atrás",
      comment: "muito dificil achar coisa boa pra mac, esse deu super certo e e vitalicio mesmo"
    },
    {
      author: "Vinicius Lopes",
      rating: 4,
      date: "2 semanas atrás",
      comment: "Gostei bastante, suporte deu assistencia pelo zap pra configurar o LayOut."
    },
    {
      author: "Tiago M.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Muito bom, rodou tranquilo no Sonoma e o Layout funciona normal."
    }
  ],
  eberick_builder_2025: [
    {
      author: "Eng. Ricardo M.",
      rating: 5,
      date: "3 dias atrás",
      comment: "Melhor combo pra calculo estrutural e eletrico, comprei pra economizar e nao me arrependo"
    },
    {
      author: "Julio C. Prado",
      rating: 5,
      date: "1 semana atrás",
      comment: "suporte remoto deles e sensacional, me ajudaram a configurar o eberick q tava dando erro de dll"
    },
    {
      author: "Patricia G.",
      rating: 4,
      date: "3 semanas atrás",
      comment: "Muito bom os programas, estao funcionando sem travar. O preco e otimo pelo q entrega"
    },
    {
      author: "Henrique Silva",
      rating: 5,
      date: "1 mês atrás",
      comment: "Combo excelente pra quem quer fazer projetos complementares completos sem falha de compatibilidade"
    },
    {
      author: "Roberto D.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Tudo certo no download, os arquivos sao meio grandes mas o tutorial explica bem direitinho"
    }
  ],
  archicad_29: [
    {
      author: "Amanda V. Lopes",
      rating: 5,
      date: "Ontem",
      comment: "Archicad 29 em portugues rodando lisinho aq. A interface ta mt rapida, curti dmais"
    },
    {
      author: "Eduardo Santos",
      rating: 5,
      date: "4 dias atrás",
      comment: "Melhor q o autocad pra arquitetura, recomendo o site, entregou em segundos"
    },
    {
      author: "Roberto Farias",
      rating: 5,
      date: "1 semana atrás",
      comment: "tudo certo, instalei e ja to fazendo meu primeiro projeto no BIM. Muito bom."
    },
    {
      author: "Larissa M.",
      rating: 4,
      date: "3 semanas atrás",
      comment: "Roda liso e o bimmx funciona perfeitamente tb, recomendo a compra"
    }
  ],
  cype_2026: [
    {
      author: "Eng. Sergio N.",
      rating: 5,
      date: "4 dias atrás",
      comment: "Cypecad completo com todos os modulos ativos, perfeito pra calcular as sapatas e vigas."
    },
    {
      author: "Kleber Lima",
      rating: 5,
      date: "1 semana atrás",
      comment: "Estava com duvida se vinha com tudo mesmo e o suporte me mandou a lista dos modulos no zap. Otimo atendimeto"
    },
    {
      author: "Alexandre S.",
      rating: 4,
      date: "2 semanas atrás",
      comment: "Muito bom, rodou tranquilo no win10. Vale super a pena."
    },
    {
      author: "Jeferson O.",
      rating: 5,
      date: "1 mês atrás",
      comment: "O modulo de escadas e fundacoes funcionando certinho, otimo preco"
    }
  ],
  solidworks_2026: [
    {
      author: "Marcelo T. P.",
      rating: 5,
      date: "2 dias atrás",
      comment: "Solidworks premium rodando no talo, faco montagem gigante e n trava. Mto estavel"
    },
    {
      author: "Wellington G.",
      rating: 5,
      date: "6 dias atrás",
      comment: "Chegou na hora no email, tutorial e bem didatico e funciona mesmo"
    },
    {
      author: "Felipe Moreira",
      rating: 5,
      date: "2 semanas atrás",
      comment: "comprei pra faculdade e me atendeu super bem, melhor do q pagar assinatura cara"
    },
    {
      author: "Claudio J.",
      rating: 5,
      date: "3 semanas atrás",
      comment: "As ferramentas de chapas metalicas e simulacao estao perfeitas. Recomendo"
    },
    {
      author: "Otavio Ramos",
      rating: 4,
      date: "1 mês atrás",
      comment: "Muito bom, ativacao permanente. So achei pesado pra baixar mas compensa dms"
    },
    {
      author: "Alexandre D.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Tudo certo! Suporte me respondeu de madrugada pra me mandar o link q eu perdi kkkkk nota 10"
    }
  ],
  sisdea_2025: [
    {
      author: "Paula R. Silveira",
      rating: 5,
      date: "5 dias atrás",
      comment: "Perfeito para engenharia de avaliacoes, usei pra fazer tres laudos semana passada. 100% confiavel"
    },
    {
      author: "Fabricio Souza",
      rating: 5,
      date: "1 semana atrás",
      comment: "tudo funcionando certinho no windows 11. entrega foi imediata."
    },
    {
      author: "Renato D. Reis",
      rating: 4,
      date: "3 semanas atrás",
      comment: "Recomendo mto, programa essencial pra perito judicial e ta com o preco mto bom"
    }
  ],
  rhinoceros_8: [
    {
      author: "Guilherme B.",
      rating: 5,
      date: "3 dias atrás",
      comment: "Rhino 8 com Grasshopper ativo rodando perfeitamente. Otimo pra modelagem organica"
    },
    {
      author: "Leticia Andrade",
      rating: 5,
      date: "1 semana atrás",
      comment: "comprei e instalei em 10 minutos, muito facil o processo e o suporte responde na hora"
    },
    {
      author: "Daniel Ferreira",
      rating: 4,
      date: "2 semanas atrás",
      comment: "Muito satisfeito, o software e muito potente e a ativacao e permanente de vdd"
    },
    {
      author: "Renan T.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Excelente para desenho industrial, compatibilidade com outros cads ta otima"
    }
  ],
  zwcad_2026: [
    {
      author: "Carlos P. Neto",
      rating: 5,
      date: "4 dias atrás",
      comment: "Bem mais leve que o autocad, roda liso no meu notebook de escritorio mais antigo."
    },
    {
      author: "Juliano Borges",
      rating: 5,
      date: "1 semana atrás",
      comment: "Tive um probleminha no download pq minha net caiu mas o suporte me mandou outro link super rapido. Nota 10"
    },
    {
      author: "Arthur Martins",
      rating: 5,
      date: "2 semanas atrás",
      comment: "100% compativel com dwg, abri todos os meus projetos antigos sem erro nenhum"
    },
    {
      author: "Ricardo L.",
      rating: 4,
      date: "1 mês atrás",
      comment: "Interface identica, nao tive dificuldade nenhuma em me adaptar. Gostei do preco"
    }
  ],
  tekla_2025: [
    {
      author: "Eng. Maurício G.",
      rating: 5,
      date: "6 dias atrás",
      comment: "Melhor software para detalhamento de estrutura metalica do mercado. Funcionando 100%"
    },
    {
      author: "Vagner S. Castro",
      rating: 5,
      date: "1 semana atrás",
      comment: "Processo de instalacao bem direto e rapido, recomendo para os colegas de engenharia"
    },
    {
      author: "Lucas P. Santos",
      rating: 4,
      date: "3 semanas atrás",
      comment: "Muito bom o programa, entrega automatica mesmo, chegou na hora no meu gmail"
    }
  ],
  office_25_win: [
    {
      author: "Mauricio F.",
      rating: 5,
      date: "Ontem",
      comment: "Chega de pagar assinatura mensal pra microsoft, esse office e vitalicio e tem tudo q preciso"
    },
    {
      author: "Camila Rocha",
      rating: 5,
      date: "3 dias atrás",
      comment: "Instalou o word excel e powerpoint certinho no meu win11. Recomendo dmais"
    },
    {
      author: "Sandro M. G.",
      rating: 4,
      date: "1 semana atrás",
      comment: "otimo, veio com um guia facil de instalar. ja to usando pra trabalhar"
    },
    {
      author: "Fabio D. Neto",
      rating: 5,
      date: "2 semanas atrás",
      comment: "Mto rapido o envio no email, recomendo msm, economizei bastante ja q nao tem mensalidade"
    },
    {
      author: "Gisele Barbosa",
      rating: 5,
      date: "3 semanas atrás",
      comment: "Funciona muito bem, todos os programas ativados certinho. 10 de 10"
    },
    {
      author: "Luciano M.",
      rating: 5,
      date: "1 mês atrás",
      comment: "excelente, abriu os arquivos pesados de planilhas do trampo de boa"
    },
    {
      author: "Juliana Reis",
      rating: 4,
      date: "1 mês atrás",
      comment: "Excelente custo beneficio. Recomendo a todos da area administrativa"
    }
  ],
  office_25_mac: [
    {
      author: "Patricia H. M.",
      rating: 5,
      date: "2 dias atrás",
      comment: "Deu super certo no meu mac mini m2. Todos os apps rodando nativos e rapidos"
    },
    {
      author: "Otavio P. Santos",
      rating: 5,
      date: "5 dias atrás",
      comment: "Muito bom nao precisar mais assinar o 365, recomendo muito o site. Entrega rapida"
    },
    {
      author: "Marcela L. Dias",
      rating: 5,
      date: "2 semanas atrás",
      comment: "funciona perfeitamente, o excel abre super rapido. so elogios!"
    },
    {
      author: "Wanderson Silva",
      rating: 4,
      date: "3 semanas atrás",
      comment: "Instalação super tranquila no mac, as macros estao funcionando de boa no excel"
    },
    {
      author: "Rafaela K.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Tudo certo! Suporte me tirou umas duvidas sobre o outlook e deu td certo"
    }
  ],
  vray_7: [
    {
      author: "Ronaldo F. Silva",
      rating: 5,
      date: "3 dias atrás",
      comment: "Renders maravilhosos no sketchup, a versao 7 ta mto rapida pra renderizar externa"
    },
    {
      author: "Juliana P. Reis",
      rating: 5,
      date: "1 semana atrás",
      comment: "tudo certinho, comprei e em menos de 1 minuto o email ja tava na caixa de entrada"
    },
    {
      author: "Claudio G. Moreira",
      rating: 4,
      date: "2 semanas atrás",
      comment: "Muito bom, recomendo msm, o preco e muito em conta comparado ao oficial"
    },
    {
      author: "Breno Lima",
      rating: 5,
      date: "1 mês atrás",
      comment: "o vray 7 ta bruto dms, os materiais ficam mto realistas. Comprei e instalei facil"
    },
    {
      author: "Aline Fonseca",
      rating: 5,
      date: "1 mês atrás",
      comment: "Roda bem na rtx e nao deu tela azul nenhuma vez ate agora. Indico pra td mundo"
    }
  ],
  enscape: [
    {
      author: "Alessandra C.",
      rating: 5,
      date: "Ontem",
      comment: "Enscape e vida pra quem e arquiteto, renderiza na hora enquanto mexe no sketchup. Roda liso"
    },
    {
      author: "Tiago Nogueira",
      rating: 5,
      date: "4 dias atrás",
      comment: "O melhor renderizador em tempo real, facil de instalar e ativou vitalicio mesmo"
    },
    {
      author: "Luiz P. Santos",
      rating: 4,
      date: "1 semana atrás",
      comment: "Entrega imediata e funciona mto bem com minha rtx 3060. Muito bom"
    },
    {
      author: "Jessica R.",
      rating: 5,
      date: "3 semanas atrás",
      comment: "Caramba, os renders de interiores saem em 5 segundos, agilizou mto meu trabalho aq"
    },
    {
      author: "Matheus Ramos",
      rating: 5,
      date: "1 mês atrás",
      comment: "Tudo funcionando, recomendo dmais pra quem faz projetos comerciais"
    }
  ],
  promob_professional_2025: [
    {
      author: "Marceneiro Adelson",
      rating: 5,
      date: "2 dias atrás",
      comment: "Promob 2025 completo com cut pro funcionando perfeito. Catalogo atualizado e rodando liso"
    },
    {
      author: "Claudio P. Rosa",
      rating: 5,
      date: "5 dias atrás",
      comment: "suporte me ajudou a instalar por acesso remoto pq deu erro de permissao no meu windows. Excelente pos venda"
    },
    {
      author: "Bruna A. Freitas",
      rating: 5,
      date: "2 semanas atrás",
      comment: "Gostei muito, essencial pra minha marcenaria. Entrega super rapida no email"
    },
    {
      author: "Valter M. Ramos",
      rating: 5,
      date: "3 semanas atrás",
      comment: "Excelente programa, plano de corte ta gerando certinho e economizando mdf"
    },
    {
      author: "Cesar D.",
      rating: 4,
      date: "1 mês atrás",
      comment: "Tudo ok, ativação funcionando bem. Fiquei surpreso com a velocidade de envio."
    },
    {
      author: "Diego Pereira",
      rating: 5,
      date: "1 mês atrás",
      comment: "Recomendo msm a loja, suporte resolveu tudo pelo WhatsApp rapidinho."
    }
  ],
  promob_enterprise_2024: [
    {
      author: "Marcenaria Silva",
      rating: 5,
      date: "4 dias atrás",
      comment: "Rodando muito bem na minha marcenaria antiga, excelente custo beneficio."
    },
    {
      author: "Jeferson Costa",
      rating: 5,
      date: "1 semana atrás",
      comment: "O cut pro ajuda mto a economizar chapa de mdf, funciona perfeitamente o plano de corte"
    },
    {
      author: "Alexandre G.",
      rating: 4,
      date: "3 semanas atrás",
      comment: "tudo certo com a instalacao, recomendo a loja para todos"
    },
    {
      author: "Sandro B.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Muito bom, ativou facil e ta ajudando bastante nos projetos mais simples aq de casa"
    }
  ],
  coreldraw_2026: [
    {
      author: "Douglas Arte",
      rating: 5,
      date: "3 dias atrás",
      comment: "CorelDraw rodando sem travar com arquivos pesados de comunicacao visual. Recomendo dmais"
    },
    {
      author: "Fabio R. Ramos",
      rating: 5,
      date: "1 semana atrás",
      comment: "Uso pra fazer artes pra sublimacao, funciona tudo e nao fica dando erro de licenca."
    },
    {
      author: "Matheus N. Costa",
      rating: 4,
      date: "2 semanas atrás",
      comment: "Muito bom o software, chegou super rapido no email com os links certinho"
    },
    {
      author: "Vivian L.",
      rating: 5,
      date: "3 semanas atrás",
      comment: "Sempre usei Corel e essa versao 2026 ta mt estavel. Instalou sem dor de cabeca"
    },
    {
      author: "Alexandre Rocha",
      rating: 5,
      date: "1 mês atrás",
      comment: "entrega na hora e suporte tirou minhas duvidas rapidinho. Nota dez"
    }
  ],
  photoshop_2026: [
    {
      author: "Henrique G. P.",
      rating: 5,
      date: "Ontem",
      comment: "Photoshop 2026 sensacional, roda super leve e tem todas as ferramentas de edicao locais"
    },
    {
      author: "Jessica M. Rosa",
      rating: 5,
      date: "4 dias atrás",
      comment: "otimo custo beneficio, suporte tirou todas as minhas duvidas no whatsapp antes de eu comprar."
    },
    {
      author: "Wanderley Silva",
      rating: 4,
      date: "1 semana atrás",
      comment: "recomendo a todos, instalacao rapida e programa 100% funcional"
    },
    {
      author: "Felipe N.",
      rating: 5,
      date: "2 semanas atrás",
      comment: "Melhor ferramenta de edição de fotos local q existe. Comprei e ativou tudo certinho"
    },
    {
      author: "Luciana G.",
      rating: 5,
      date: "3 semanas atrás",
      comment: "Tudo funcionando liso no win 11. Uso pra trabalhar td dia e ta otimo"
    },
    {
      author: "Marcelo K.",
      rating: 5,
      date: "1 mês atrás",
      comment: "Fácil instalação e vem com passo a passo bem explicado no e-mail."
    },
    {
      author: "Artur Ramos",
      rating: 4,
      date: "2 meses atrás",
      comment: "o programa é muito bom e roda liso. Apenas o download que demorou um pouco por ser pesado."
    }
  ],
  proteus_9: [
    {
      author: "Jefferson Santos",
      rating: 5,
      date: "2 dias atrás",
      comment: "Melhor suite de simulacao de circuitos e layout pci, instalei e rodou os projetos do arduino sem problemas"
    },
    {
      author: "Gabriel R.",
      rating: 5,
      date: "1 semana atrás",
      comment: "tudo certo, simulando perfeitamente. Muito util para os meus estudos de engenharia eletrica"
    },
    {
      author: "Diego F. Melo",
      rating: 5,
      date: "3 semanas atrás",
      comment: "suporte ajudou no zap pq eu nao estava achando o link de download kkkkk recomendo dmais"
    }
  ],
  exocad_31: [
    {
      author: "Dr. Gustavo N.",
      rating: 5,
      date: "3 dias atrás",
      comment: "Instalou com todos os modulos clinicos ativos, perfeito pro meu laboratorio de protese. Recomendo"
    },
    {
      author: "Protetico Valter",
      rating: 5,
      date: "1 semana atrás",
      comment: "estava desconfiado pelo preco mas veio tudo certinho e funcionando perfeito. Otimo atendimento"
    },
    {
      author: "Dra. Aline Souza",
      rating: 4,
      date: "2 semanas atrás",
      comment: "muito bom, exocad rodando liso com meu scanner intraoral. Economizei um dinheirao"
    }
  ],
  parallels_desktop_26: [
    {
      author: "Renan Castilho",
      rating: 5,
      date: "2 dias atrás",
      comment: "cara mt bom, rodou o windows 11 no meu macbook air m1 super rapido. nem parece q e emulador, parece nativo!"
    },
    {
      author: "Thiago M. Albuquerque",
      rating: 5,
      date: "1 semana atrás",
      comment: "Tinha algums programas de engenharia q nao rodava no mac, com o parallels funcionou td certinho. ativou vitalicio de primeira"
    },
    {
      author: "Patricia V. Lima",
      rating: 4,
      date: "2 semanas atrás",
      comment: "otimo custo beneficio! a instalacao tem bastantes passos mas o tutorial em video q eles mandam ajuda muito."
    }
  ],
  coreldraw_2026_mac: [
    {
      author: "Gisele T. Andrade",
      rating: 5,
      date: "Ontem",
      comment: "Nossa muito bom! Roda direto no macOS sem precisar de emular nada e veio super bem explicado a instalacao. Amei!"
    },
    {
      author: "Rodrigo P. Martins",
      rating: 5,
      date: "5 dias atrás",
      comment: "tudo certo no meu macbook m2 pro. o corel roda nativo e as ferramentas de vetor estao super rapidas"
    },
    {
      author: "Fabiola S. Nogueira",
      rating: 4,
      date: "2 semanas atrás",
      comment: "comprei pra fazer artes e estampas e ate agora esta perfeito. o suporte me ajudou a instalar por chat no whatsapp, recomendo."
    }
  ]
};
