export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  compatibility: 'Windows' | 'macOS' | 'Windows e macOS';
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  checkoutUrl: string;
  version: string;
  requirements: {
    os: string;
    cpu: string;
    ram: string;
    gpu?: string;
    storage: string;
  };
  features: string[];
  notes?: string;
  imageUrl?: string;
}

export const CATEGORIES = [
  'Todos',
  'Engenharia e Arquitetura',
  'Design e Criatividade',
  'Escritório e Produtividade',
  'Marcenaria e Móveis Planejados',
  'Projetos Elétricos e Eletrônicos',
  'Odontologia e CAD Dental'
] as const;

export const products: Product[] = [
  {
    id: 'autocad_2027_win',
    slug: 'autocad-2027-windows',
    name: 'AutoCAD 2027 (Windows)',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2027 (64-bits)',
    description: 'Ferramenta profissional para desenhos técnicos, projetos 2D e modelagem 3D no Windows.',
    longDescription: 'O AutoCAD 2027 para Windows é o software de desenho técnico auxiliado por computador (CAD) líder no mercado. Esta versão completa e funcional oferece precisão milimétrica, ferramentas poderosas de modelagem 2D e 3D, automação de tarefas e uma interface fluida que otimiza seu tempo de trabalho.',
    price: 137.90,
    originalPrice: 699.00,
    checkoutUrl: 'https://pay.cakto.com.br/3agirjy_453939',
    imageUrl: '/images/products/autocad-2027-windows.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: '2.5 GHz ou superior',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: '1 GB com suporte a DirectX 11 (Recomendável: 4 GB compatível com DirectX 12)',
      storage: '10 GB de espaço livre (SSD recomendado)'
    }
  },
  {
    id: 'autocad_2027_mac',
    slug: 'autocad-2027-macos',
    name: 'AutoCAD 2027 (macOS)',
    category: 'Engenharia e Arquitetura',
    compatibility: 'macOS',
    version: '2027 para Mac',
    description: 'Desenho técnico 2D e modelagem 3D profissional adaptado nativamente para macOS.',
    longDescription: 'O AutoCAD 2027 para Mac oferece um conjunto de ferramentas robusto projetado especificamente para o ecossistema Apple. Esta versão completa e funcional é compatível com processadores Apple Silicon e Intel, garantindo precisão, velocidade de renderização e estabilidade local para projetos industriais ou de arquitetura.',
    price: 147.90,
    originalPrice: 749.00,
    checkoutUrl: 'https://pay.cakto.com.br/fw49xt3',
    imageUrl: '/images/products/autocad-2027-macos.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'macOS 12 (Monterey) ou superior',
      cpu: 'Apple Silicon (M1/M2/M3/M4) ou Intel de múltiplos núcleos',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Suporte nativo a Metal da Apple',
      storage: '8 GB de espaço livre'
    }
  },
  {
    id: 'revit_2027',
    slug: 'revit-2027',
    name: 'Revit 2027',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2027 (64-bits)',
    description: 'Software profissional para projetos BIM, arquitetura, engenharia e construção.',
    longDescription: 'O Revit 2027 é o principal software focado na metodologia BIM (Building Information Modeling). Ele permite criar projetos de arquitetura, estrutura e instalações elétricas e hidráulicas de forma totalmente integrada. Com esta versão completa e funcional, você gera plantas, cortes, elevações e renderizações realistas a partir de um único modelo 3D unificado.',
    price: 147.90,
    originalPrice: 749.00,
    checkoutUrl: 'https://pay.cakto.com.br/33xszru_453977',
    imageUrl: '/images/products/revit-2027.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel i-Series de múltiplos núcleos ou AMD equivalente',
      ram: '8 GB (Recomendável: 16 GB ou mais)',
      gpu: 'Placa dedicada compatível com DirectX 11 ou posterior',
      storage: '30 GB de espaço livre'
    }
  },
  {
    id: 'inventor_pro_2027',
    slug: 'inventor-professional-2027',
    name: 'Inventor Professional 2027',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2027 (64-bits)',
    description: 'Modelagem 3D, simulação mecânica e desenvolvimento de produtos profissionais.',
    longDescription: 'O Inventor Professional 2027 oferece ferramentas profissionais de engenharia para projetos mecânicos 3D, simulação de produtos, criação de ferramentas e comunicação de projetos. Esta versão completa e funcional permite otimizar o fluxo de trabalho de fabricação digital com precisão extrema.',
    price: 167.90,
    originalPrice: 849.00,
    checkoutUrl: 'https://pay.cakto.com.br/pth7gb9_453983',
    imageUrl: '/images/products/inventor-professional-2027.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: '2.5 GHz ou superior (Recomendado: 3.0 GHz+)',
      ram: '8 GB (Recomendado: 16 GB ou 32 GB para grandes montagens)',
      gpu: '1 GB VRAM (Recomendado: 4 GB VRAM dedicada com suporte a DirectX 12)',
      storage: '40 GB de espaço livre'
    }
  },
  {
    id: 'civil3d_2027',
    slug: 'civil-3d-2027',
    name: 'Civil 3D 2027',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2027 (64-bits)',
    description: 'Desenho e documentação para projetos de infraestrutura civil e transportes.',
    longDescription: 'O Civil 3D 2027 é a solução padrão para engenharia civil, infraestrutura urbana e modelagem de terrenos. Esta versão completa e funcional suporta fluxos de trabalho BIM avançados para projetos de estradas, drenagens, topografia e terraplenagem com geração automatizada de perfis e relatórios técnicos.',
    price: 147.90,
    originalPrice: 749.00,
    checkoutUrl: 'https://pay.cakto.com.br/p8io5d6',
    imageUrl: '/images/products/civil-3d-2027.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: '2.5 GHz ou superior (Recomendável: 3.0 GHz+)',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: '1 GB compatível com DirectX 11 (Recomendável: 4 GB compatível com DirectX 12)',
      storage: '20 GB de espaço livre'
    }
  },
  {
    id: 'navisworks_2027',
    slug: 'navisworks-manage-2027',
    name: 'Navisworks Manage 2027',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2027 (64-bits)',
    description: 'Análise, simulação e coordenação de projetos BIM para detecção de interferências.',
    longDescription: 'O Navisworks Manage 2027 é o software essencial para a revisão de projetos em 3D, permitindo que profissionais de engenharia e construção combinem modelos de diversas disciplinas para identificar erros e incompatibilidades antes da execução da obra. Esta versão completa e funcional oferece ferramentas avançadas de clash detection, simulação 4D de cronogramas e quantificação.',
    price: 187.90,
    originalPrice: 949.00,
    checkoutUrl: 'https://pay.cakto.com.br/i7yjqej',
    imageUrl: '/images/products/navisworks-manage-2027.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel ou AMD de múltiplos núcleos',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Placa de vídeo compatível com Direct3D 9 e Shader Model 3.0',
      storage: '15 GB de espaço livre'
    }
  },
  {
    id: 'sketchup_2026_win',
    slug: 'sketchup-pro-2026-windows',
    name: 'SketchUp Pro 2026 (Windows)',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2026 (64-bits)',
    description: 'Modelagem 3D intuitiva para arquitetura, interiores e layouts no Windows.',
    longDescription: 'O SketchUp Pro 2026 para Windows é ideal para criar modelos 3D rápidos, layouts de maquete eletrônica e documentações em 2D de alta qualidade com a ferramenta LayOut. Esta versão completa e funcional permite o desenvolvimento de mobília, arquitetura comercial ou residencial de forma extremamente simplificada.',
    price: 137.90,
    originalPrice: 699.00,
    checkoutUrl: 'https://pay.cakto.com.br/37xdw4p_847334',
    imageUrl: '/images/products/sketchup-pro-2026-windows.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: '2.0 GHz ou superior',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Placa dedicada com suporte a OpenGL 3.1 ou superior (Mínimo 1 GB VRAM)',
      storage: '2 GB de espaço livre'
    }
  },
  {
    id: 'sketchup_2026_mac',
    slug: 'sketchup-pro-2026-macos',
    name: 'SketchUp Pro 2026 (macOS)',
    category: 'Engenharia e Arquitetura',
    compatibility: 'macOS',
    version: '2026 para Mac',
    description: 'Modelagem 3D rápida e layouts de design gráfico otimizados nativamente para macOS.',
    longDescription: 'O SketchUp Pro 2026 para Mac foi adaptado para rodar com alta fluidez e estabilidade em computadores Apple. Esta versão completa e funcional traz o clássico modelador 3D intuitivo aliado à renderização local precisa, compatível com processadores Apple Silicon e telas Retina.',
    price: 157.90,
    originalPrice: 799.00,
    checkoutUrl: 'https://pay.cakto.com.br/xogsm9p',
    imageUrl: '/images/products/sketchup-pro-2026-macos.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'macOS 12 (Monterey) ou superior',
      cpu: 'Apple Silicon (M1/M2/M3/M4) ou Intel Core de múltiplos núcleos',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Suporte nativo a Metal da Apple',
      storage: '3 GB de espaço livre'
    }
  },
  {
    id: 'eberick_builder_2025',
    slug: 'eberick-builder-2025',
    name: 'AltoQi Eberick + Builder 2025',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2025.04 (64-bits)',
    description: 'Solução nacional integrada para cálculo estrutural e projetos de instalações BIM.',
    longDescription: 'O AltoQi Eberick + Builder 2025 é o combo definitivo de ferramentas para engenharia civil no Brasil. O Eberick realiza análise estrutural e detalhamento de concreto armado, estruturas metálicas e blocos de fundação. O Builder cuida das instalações hidráulicas, elétricas, sanitárias e de gás. Ambos trabalham sob o conceito BIM para compatibilização total.',
    price: 367.90,
    originalPrice: 1899.00,
    checkoutUrl: 'https://pay.cakto.com.br/7jw8eyi_847943',
    imageUrl: '/images/products/eberick-builder-2025.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel Core i5 / AMD Ryzen 5 ou superior (Recomendado i7/Ryzen 7)',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Placa dedicada com suporte a OpenGL 3.3',
      storage: '10 GB de espaço livre'
    }
  },
  {
    id: 'archicad_29',
    slug: 'archicad-29-bra',
    name: 'ArchiCAD 29 BRA',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '29 (64-bits)',
    description: 'Software de autoria BIM líder para arquitetos com fluxos de trabalho avançados.',
    longDescription: 'O ArchiCAD 29 BRA é a referência em modelagem arquitetônica BIM. Desenvolvido especificamente por e para arquitetos, ele oferece uma modelagem flexível de volumes, documentação 2D automática a partir do modelo 3D, renderizações integradas e coordenação fluida com outros engenheiros.',
    price: 137.90,
    originalPrice: 699.00,
    checkoutUrl: 'https://pay.cakto.com.br/3fgpwfj_848451',
    imageUrl: '/images/products/archicad-29-bra.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel Core i5 ou AMD Ryzen equivalente (Recomendado i7/Ryzen 7)',
      ram: '8 GB (Recomendável: 16 GB ou mais)',
      gpu: 'Placa com 2 GB VRAM dedicada com suporte a OpenGL 4.5 (Recomendado 4 GB+)',
      storage: '5 GB de espaço livre para instalação (SSD recomendado)'
    }
  },
  {
    id: 'cype_2026',
    slug: 'cypecad-2026',
    name: 'Cype 2026.A (Completo)',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2026.a (64-bits)',
    description: 'Cálculo de estruturas de concreto, metálicas e projetos de instalações integradas.',
    longDescription: 'O Cype 2026.A (também conhecido como CYPECAD e Cype 3D) é uma suíte robusta para cálculo estrutural e detalhamento de estruturas no padrão brasileiro de normas (NBR). Esta versão completa e funcional inclui todos os 45 módulos ativos, permitindo projetar vigas, pilares, sapatas, blocos sobre estacas e galpões metálicos com rapidez e geração automática de plantas e memórias de cálculo.',
    price: 307.90,
    originalPrice: 1599.00,
    checkoutUrl: 'https://pay.cakto.com.br/nyooujd_454658',
    imageUrl: '/images/products/cypecad-2026.png',
    features: [
      'Versão completa e funcional com todos os 45 módulos ativos',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Processador de múltiplos núcleos (Intel ou AMD)',
      ram: '8 GB RAM',
      gpu: 'Compatível com OpenGL 3.3',
      storage: '10 GB de espaço livre'
    }
  },
  {
    id: 'solidworks_2026',
    slug: 'solidworks-2026',
    name: 'SolidWorks 2026 Premium',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2026 SP0 (64-bits)',
    description: 'Modelagem mecânica 3D, conjuntos complexos e simulações físicas avançadas.',
    longDescription: 'O SolidWorks 2026 Premium é o padrão global da indústria mecânica para modelagem tridimensional de peças, conjuntos de grande porte, testes de resistência (FEA) e detalhamento de chapas metálicas. Essencial para projetistas industriais e engenheiros que exigem precisão paramétrica absoluta.',
    price: 187.90,
    originalPrice: 949.00,
    checkoutUrl: 'https://pay.cakto.com.br/7hh4cvt_847441',
    imageUrl: '/images/products/solidworks-2026.jpg',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: '3.3 GHz ou superior (Intel i7/i9 ou Ryzen equivalente)',
      ram: '16 GB (Recomendado: 32 GB)',
      gpu: 'Placa certificada com no mínimo 4 GB VRAM (GeForce / RTX ou Quadro)',
      storage: '25 GB de espaço livre em SSD'
    }
  },
  {
    id: 'sisdea_2025',
    slug: 'sisdea-2025',
    name: 'SisDEA 2025',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2025 (64-bits)',
    description: 'Software de engenharia de avaliações de imóveis por regressão linear e redes neurais.',
    longDescription: 'O SisDEA 2025 é o software líder para engenheiros de avaliações e peritos judiciais realizarem avaliações mercadológicas de imóveis urbanos e rurais de acordo com as normas da ABNT NBR 14653. Esta versão completa e funcional realiza tratamentos estatísticos avançados, regressões lineares múltiplas e análises por redes neurais artificiais.',
    price: 197.90,
    originalPrice: 999.00,
    checkoutUrl: 'https://pay.cakto.com.br/3cg7y55',
    imageUrl: '/images/products/sisdea-2025.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel Core i3 / AMD Ryzen 3 ou superior',
      ram: '4 GB RAM (Recomendável: 8 GB)',
      gpu: 'Sem requisitos dedicados específicos',
      storage: '1 GB de espaço livre'
    }
  },
  {
    id: 'rhinoceros_8',
    slug: 'rhinoceros-8',
    name: 'Rhinoceros 8 Rhino 3D',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '8.x Professional',
    description: 'Modelador 3D matemático avançado baseado em curvas NURBS para superfícies complexas.',
    longDescription: 'O Rhinoceros 8 (Rhino 3D) é amplamente utilizado por designers de produtos, engenheiros navais, joalheiros e arquitetos devido ao seu incrível motor matemático baseado em curvas NURBS. Permite criar formas curvas orgânicas com máxima precisão geométrica, além de incluir o Grasshopper integrado para modelagem paramétrica algorítmica.',
    price: 167.90,
    originalPrice: 849.00,
    checkoutUrl: 'https://pay.cakto.com.br/owkfuvv_850623',
    imageUrl: '/images/products/rhinoceros-8.png',
    features: [
      'Versão completa e funcional com Grasshopper incluso',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel ou AMD de 64 bits de múltiplos núcleos',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Compatível com OpenGL 4.1 (Recomendado NVIDIA GeForce)',
      storage: '5 GB de espaço livre'
    }
  },
  {
    id: 'zwcad_2026',
    slug: 'zwcad-professional-2026',
    name: 'ZWCAD 2026 Professional',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2026 (64-bits)',
    description: 'Alternativa CAD rápida e leve, 100% compatível com arquivos DWG e interface clássica.',
    longDescription: 'O ZWCAD Professional 2026 é uma excelente alternativa ao AutoCAD, mantendo a compatibilidade de comandos (LISP) e arquivos DWG nativos. Por ser extremamente leve, roda com excelente desempenho mesmo em computadores ou notebooks antigos, sendo a escolha ideal para o dia a dia de escritórios técnicos.',
    price: 137.90,
    originalPrice: 699.00,
    checkoutUrl: 'https://pay.cakto.com.br/ecx56mf',
    imageUrl: '/images/products/zwcad-2026.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel Core 2 Duo ou AMD equivalente',
      ram: '4 GB (Recomendável: 8 GB)',
      gpu: '1 GB VRAM ou superior',
      storage: '4 GB de espaço livre'
    }
  },
  {
    id: 'tekla_2025',
    slug: 'tekla-structures-2025',
    name: 'Tekla Structures 2025',
    category: 'Engenharia e Arquitetura',
    compatibility: 'Windows',
    version: '2025 (64-bits)',
    description: 'Detalhamento de estruturas metálicas e concreto para grandes projetos de engenharia.',
    longDescription: 'O Tekla Structures 2025 é o software BIM líder mundial para detalhamento estrutural de aço e estruturas pré-moldadas de concreto. Ele permite criar modelos construtivos 3D ricos em informações físicas, gerando desenhos de fabricação, listas de materiais automáticas e conexões CNC diretamente do modelo tridimensional de forma estável.',
    price: 237.90,
    originalPrice: 1199.00,
    checkoutUrl: '[LINK_CHECKOUT_TEKLA]',
    imageUrl: '/images/products/tekla-structures-2025.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel Core i5 / AMD Ryzen 5 ou superior (Recomendado i7/Ryzen 7)',
      ram: '16 GB RAM (Recomendável: 32 GB)',
      gpu: 'Placa de vídeo dedicada de 4 GB VRAM dedicada (NVIDIA GeForce/RTX ou Quadro)',
      storage: '10 GB de espaço livre (SSD)'
    }
  },
  {
    id: 'office_25_win',
    slug: 'office-2024-professional-plus',
    name: 'Office 2024 Professional Plus (Windows)',
    category: 'Escritório e Produtividade',
    compatibility: 'Windows',
    version: '2024 Professional Plus',
    description: 'Pacote de produtividade com Word, Excel, PowerPoint, Access e Outlook para Windows.',
    longDescription: 'O Office 2024 Professional Plus é o conjunto clássico de aplicativos de escritório locais da Microsoft para o Windows. Contém as aplicações em suas versões completas e funcionais locais instaladas diretamente na máquina, eliminando a dependência de assinaturas de nuvem.',
    price: 127.90,
    originalPrice: 649.00,
    checkoutUrl: 'https://pay.cakto.com.br/g2h5czk_443849',
    imageUrl: '/images/products/office-2024-professional-plus.jpg',
    notes: 'Nota: A licença é local e não inclui espaço de armazenamento em nuvem no OneDrive.',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: '1.6 GHz ou superior, 2 núcleos',
      ram: '4 GB RAM',
      gpu: 'Compatível com DirectX 9 ou superior',
      storage: '4 GB de espaço livre'
    }
  },
  {
    id: 'office_25_mac',
    slug: 'office-2024-professional-mac',
    name: 'Office 2024 Professional (macOS)',
    category: 'Escritório e Produtividade',
    compatibility: 'macOS',
    version: '2024 Home & Business para Mac',
    description: 'Pacote Office local adaptado nativamente para computadores Mac.',
    longDescription: 'O Office 2024 para Mac foi desenvolvido sob medida para o macOS da Apple. Ele traz suporte integrado completo para processadores Apple Silicon (M1/M2/M3/M4) e Intel, garantindo desempenho nativo para Word, Excel, PowerPoint e Outlook sem mensalidades.',
    price: 187.90,
    originalPrice: 949.00,
    checkoutUrl: 'https://pay.cakto.com.br/363brvw',
    imageUrl: '/images/products/office-2024-professional-mac.png',
    notes: 'Nota: A licença é local e não inclui espaço de armazenamento em nuvem no OneDrive.',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'macOS (Três versões mais recentes suportadas)',
      cpu: 'Intel ou Apple Silicon (M1/M2/M3/M4)',
      ram: '4 GB RAM (Recomendado 8 GB)',
      gpu: 'Sem requisitos específicos dedicados',
      storage: '10 GB de espaço livre no formato APFS'
    }
  },
  {
    id: 'vray_7',
    slug: 'vray-7-windows',
    name: 'Chaos V-Ray 7',
    category: 'Design e Criatividade',
    compatibility: 'Windows',
    version: 'v7.0 Professional',
    description: 'Motor de renderização fotorrealista de alta fidelidade para CADs e modeladores.',
    longDescription: 'O Chaos V-Ray 7 é a ferramenta de renderização fotorrealista mais renomada na arquitetura e efeitos visuais. Compatível com SketchUp, 3ds Max e Revit, esta versão completa e funcional permite criar imagens e animações em nível profissional utilizando aceleração por GPU de forma nativa e local.',
    price: 87.90,
    originalPrice: 449.00,
    checkoutUrl: 'https://pay.cakto.com.br/t5qr5by_847341',
    imageUrl: '/images/products/vray-7-windows.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel ou AMD de 64 bits com suporte a SSE4.2',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Placa dedicada compatível com CUDA e DirectX 12 (NVIDIA GeForce/RTX recomendada)',
      storage: '2 GB de espaço livre'
    }
  },
  {
    id: 'enscape',
    slug: 'chaos-enscape-windows',
    name: 'Chaos Enscape (Windows)',
    category: 'Design e Criatividade',
    compatibility: 'Windows',
    version: '4.x Professional',
    description: 'Renderizador em tempo real e realidade virtual integrado para SketchUp, Revit e Rhino.',
    longDescription: 'O Chaos Enscape é o renderizador em tempo real favorito de arquitetos que necessitam visualizar seus projetos de modelagem 3D instantaneamente enquanto desenham. Ele se integra como uma aba dentro de softwares como SketchUp e Revit, gerando renders de interiores e exteriores em segundos com iluminação global realista.',
    price: 97.90,
    originalPrice: 499.00,
    checkoutUrl: 'https://pay.cakto.com.br/u9uowmi_847345',
    imageUrl: '/images/products/chaos-enscape-windows.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel ou AMD de múltiplos núcleos',
      ram: '8 GB (Recomendado 16 GB)',
      gpu: 'Mínimo de 2 GB VRAM dedicada com suporte a Ray Tracing (NVIDIA GTX/RTX ou AMD Radeon)',
      storage: '2 GB de espaço livre'
    }
  },
  {
    id: 'promob_professional_2025',
    slug: 'promob-plus-professional-2025',
    name: 'Promob Plus Professional 2025',
    category: 'Marcenaria e Móveis Planejados',
    compatibility: 'Windows',
    version: 'v5.60.40.4',
    description: 'Modulação avançada e renderização de projetos com Cut Pro, Revest e Real Scene 2.0.',
    longDescription: 'O Promob Plus Professional 2025 é a solução profissional definitiva para marcenarias e designers de interiores. Esta versão completa e funcional inclui as ferramentas Cut Pro, Revest e o motor de renderização Real Scene 2.0, oferecendo uma biblioteca 2025 atualizada e catálogo 3D dinâmico alimentado semanalmente. Licença válida para instalação em 1 máquina por vez (não sendo possível transferir a licença).',
    price: 307.90,
    originalPrice: 1599.00,
    checkoutUrl: 'https://pay.cakto.com.br/i5whsbp_853381',
    imageUrl: '/images/products/promob-plus-professional-2025.png',
    notes: 'Nota: A ativação é válida para 1 máquina por vez, sem possibilidade de transferência de licença.',
    features: [
      'Versão completa e funcional com Cut Pro e Real Scene 2.0',
      'Ferramenta Revest inclusa para detalhamento',
      'Biblioteca 2025 e catálogo 3D atualizado semanalmente',
      'Instalação limitada a 1 máquina por vez (licença não transferível)',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel Core i5 / AMD Ryzen 5 ou superior',
      ram: '8 GB (Recomendado: 16 GB)',
      gpu: 'Placa dedicada com suporte a OpenGL (NVIDIA GeForce de 2 GB VRAM ou superior)',
      storage: '5 GB de espaço livre'
    }
  },
  {
    id: 'promob_enterprise_2024',
    slug: 'promob-plus-enterprise-2024',
    name: 'Promob Plus Enterprise 2024',
    category: 'Marcenaria e Móveis Planejados',
    compatibility: 'Windows',
    version: 'v5.60.16.28',
    description: 'Desenvolvimento e detalhamento de projetos residenciais com Cut Pro e Real Scene 1.0.',
    longDescription: 'O Promob Plus Enterprise 2024 é voltado para projetistas de móveis e designers de interiores que buscam uma solução local eficiente. Esta versão completa e funcional inclui a ferramenta Cut Pro para planos de corte de chapas, renderizador Real Scene 1.0 integrado, além de biblioteca de modulação clássica e catálogo 3D para detalhamento de móveis.',
    price: 137.90,
    originalPrice: 699.00,
    checkoutUrl: 'https://pay.cakto.com.br/fvvtpwg',
    imageUrl: '/images/products/promob-enterprise-2024.png',
    features: [
      'Versão completa e funcional com Cut Pro e Real Scene 1.0',
      'Biblioteca de modulação e catálogo 3D inclusos',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel Core i5 / AMD Ryzen 5 ou superior',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Placa dedicada com suporte a OpenGL (NVIDIA GeForce de 2 GB VRAM ou superior)',
      storage: '5 GB de espaço livre'
    }
  },
  {
    id: 'coreldraw_2026',
    slug: 'coreldraw-graphics-suite-2026',
    name: 'CorelDRAW Graphics Suite 2026',
    category: 'Design e Criatividade',
    compatibility: 'Windows',
    version: 'Graphics Suite 2026',
    description: 'Solução profissional para design gráfico, artes vetoriais e materiais de comunicação.',
    longDescription: 'O CorelDRAW Graphics Suite 2026 é o software clássico e de alto rendimento para criação de vetores publicitários, estampas têxteis, layouts e edição profissional de imagens (Corel PHOTO-PAINT). Esta versão completa e funcional roda localmente com alta performance.',
    price: 97.00,
    originalPrice: 499.00,
    checkoutUrl: 'https://pay.cakto.com.br/35jm335_853466',
    imageUrl: '/images/products/coreldraw-graphics-suite-2026.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits) com atualizações recentes',
      cpu: 'Intel Core i3/i5/i7 ou AMD Ryzen equivalente',
      ram: '8 GB RAM',
      gpu: 'Placa gráfica compatível com OpenCL 1.2 com 3 GB VRAM ou superior',
      storage: '5.5 GB de espaço livre'
    }
  },
  {
    id: 'photoshop_2026',
    slug: 'adobe-photoshop-2026',
    name: 'Adobe Photoshop 2026',
    category: 'Design e Criatividade',
    compatibility: 'Windows',
    version: '2026 (64-bits)',
    description: 'Edição, retoque fotorrealista e criação de imagens raster profissional.',
    longDescription: 'O Adobe Photoshop 2026 é o software padrão de ouro mundial para processamento de fotos digitais, fotomontagens complexas com camadas e ilustrações artísticas. Esta versão completa e funcional oferece alto rendimento local para fotógrafos e designers gráficos.',
    price: 97.00,
    originalPrice: 499.00,
    checkoutUrl: 'https://pay.cakto.com.br/uso8h4c',
    imageUrl: '/images/products/adobe-photoshop-2026.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 de 64 bits (versão 22H2 ou superior) ou Windows 11',
      cpu: 'Processador Intel ou AMD com suporte a 64 bits; 2 GHz ou mais rápido',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Compatível com DirectX 12, mínimo de 2 GB VRAM (Recomendável: 4 GB VRAM)',
      storage: '20 GB de espaço livre (SSD recomendado)'
    }
  },
  {
    id: 'proteus_9',
    slug: 'proteus-9-professional',
    name: 'Proteus 9 Professional Design Suite',
    category: 'Projetos Elétricos e Eletrônicos',
    compatibility: 'Windows',
    version: '9.x Professional',
    description: 'Simulação SPICE de circuitos eletrônicos e projeto automatizado de placas PCI (ARES).',
    longDescription: 'O Proteus 9 Design Suite combina a captura de esquemáticos eletrônicos robustos com simulação avançada SPICE de microcontroladores (Arduino, PIC, ARM) e design automatizado de placas de circuito impresso (ARES). Excelente para engenheiros eletrônicos e de automação.',
    price: 97.00,
    originalPrice: 499.00,
    checkoutUrl: 'https://pay.cakto.com.br/xsxm4u5_853714',
    imageUrl: '/images/products/proteus-9.jpg',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: '2.0 GHz Intel ou equivalente',
      ram: '4 GB (Recomendável: 8 GB)',
      gpu: 'Compatível com OpenGL 2.0 ou DirectX 9',
      storage: '2 GB de espaço livre'
    }
  },
  {
    id: 'exocad_31',
    slug: 'exocad-dentalcad-31-rijeka',
    name: 'ExoCAD DentalCAD 3.1 Rijeka',
    category: 'Odontologia e CAD Dental',
    compatibility: 'Windows',
    version: '3.1 Rijeka (64-bits)',
    description: 'Solução CAD de odontologia e prótese dentária com módulos clínicos integrados.',
    longDescription: 'O ExoCAD DentalCAD 3.1 Rijeka é a plataforma líder absoluta para laboratórios de prótese dentária e clínicas odontológicas digitais. Esta versão completa e funcional permite o design digital de coroas, pontes, facetas, inlays, implantes e próteses sobre implantes com alta fidelidade tridimensional e suporte local completo.',
    price: 350.00,
    originalPrice: 1799.00,
    checkoutUrl: '[LINK_CHECKOUT_EXOCAD]',
    imageUrl: '/images/products/exocad-dentalcad-31.jpg',
    features: [
      'Versão completa e funcional com módulos clínicos integrados',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'Windows 10 ou 11 (64-bits)',
      cpu: 'Intel Core i5 / AMD Ryzen 5 ou superior (Recomendado i7/Ryzen 7)',
      ram: '8 GB (Recomendado: 16 GB ou mais)',
      gpu: 'Placa dedicada com suporte a DirectX 11 ou superior (NVIDIA GeForce de 4 GB VRAM recomendada)',
      storage: '5 GB de espaço livre'
    }
  },
  {
    id: 'parallels_desktop_26',
    slug: 'parallels-desktop-26',
    name: 'Parallels Desktop 26',
    category: 'Escritório e Produtividade',
    compatibility: 'macOS',
    version: 'v26.0 para Mac',
    description: 'Execute Windows e outras aplicações de PC diretamente no seu Mac sem reiniciar.',
    longDescription: 'O Parallels Desktop 26 para Mac é a solução de virtualização líder de mercado, permitindo que você execute aplicativos do Windows lado a lado com seus aplicativos favoritos do macOS. Compatível nativamente com processadores Apple Silicon (M1/M2/M3/M4) e Intel, esta versão completa oferece desempenho gráfico aprimorado, suporte para DirectX 12 e integração fluida entre sistemas operacionais.',
    price: 247.90,
    originalPrice: 1249.00,
    checkoutUrl: 'https://pay.cakto.com.br/iqu3oi2',
    imageUrl: '/images/products/parallels-desktop-26.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'macOS 12 (Monterey) ou superior',
      cpu: 'Apple Silicon (M1/M2/M3/M4) ou Intel de múltiplos núcleos',
      ram: '8 GB (Recomendável: 16 GB ou mais)',
      gpu: 'Suporte nativo a Metal da Apple',
      storage: '600 MB para instalação do Parallels + espaço para máquina virtual (SSD recomendado)'
    }
  },
  {
    id: 'coreldraw_2026_mac',
    slug: 'coreldraw-graphics-suite-2026-macos',
    name: 'CorelDRAW Graphics Suite 2026 (macOS)',
    category: 'Design e Criatividade',
    compatibility: 'macOS',
    version: 'Graphics Suite 2026 para Mac',
    description: 'Criação profissional de gráficos vetoriais, ilustrações e layouts de página adaptados nativamente para macOS.',
    longDescription: 'O CorelDRAW Graphics Suite 2026 para Mac foi otimizado para rodar com fluidez no macOS, com suporte completo para processadores Apple Silicon e telas Retina de alta definição. Esta versão completa e funcional oferece todas as ferramentas profissionais de ilustração vetorial, edição de fotos com o Corel PHOTO-PAINT e design de layouts sem custos de assinatura mensal.',
    price: 137.90,
    originalPrice: 699.00,
    checkoutUrl: 'https://pay.cakto.com.br/jnap84i',
    imageUrl: '/images/products/coreldraw-graphics-suite-2026-macos.png',
    features: [
      'Versão completa e funcional',
      'Acesso vitalício para uso ilimitado',
      'Instalação assistida inclusa',
      'Entrega automática no e-mail após o pagamento',
      'Suporte remoto quando necessário',
      'Pronto para uso imediato'
    ],
    requirements: {
      os: 'macOS 12 (Monterey) ou superior',
      cpu: 'Apple Silicon (M1/M2/M3/M4) ou Intel de múltiplos núcleos',
      ram: '8 GB (Recomendável: 16 GB)',
      gpu: 'Suporte nativo a Metal da Apple',
      storage: '4 GB de espaço livre'
    }
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}
