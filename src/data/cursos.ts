// Cursos Alltak, transcritos das páginas do site antigo (alltak.com.br/cursos/,
// out/2026). O conteúdo fica em português, como os artigos do blog; a
// interface é traduzida. Datas e inscrições continuam na Alltak Store e na
// Doity, como no site antigo.

export type Bloco = { titulo: string; texto?: string[]; lista?: string[] }
export type Evento = { titulo: string; local: string; data: string; quando: string; url: string }
export type Curso = {
  slug: string
  nome: string
  chamada: string
  resumo: string
  imagem: string
  banner?: string
  modulos?: string[] // slugs dos módulos (Academia)
  pai?: string
  blocos: Bloco[]
  fatos?: { carga?: string; investimento?: string; local?: string; requisitos?: string }
  incluso?: string[]
  leia?: string[]
  agenda?: string
  eventos?: Evento[]
  galeria?: string[]
}

const UP = './wp-uploads'
export const CONTATO_CURSOS = { email: 'cursos@alltak.com.br', telefone: '(11) 3988-5022', whatsapp: '5511989483158' }
export const HOSPEDAGEM = 'https://www.booking.com/searchresults.pt-br.html?ss=Guarulhos'
const LOCAL_ALLTAK = 'Estúdio de Envelopamento Alltak · Rua Tamotsu Iwasse, 1273, Vila Nova Bonsucesso, Guarulhos – SP · CEP 07176-000'

const INTRO_ACADEMIA = [
  'A Alltak® tornou-se referência quando o assunto é envelopamento automotivo. Por isso, há alguns anos vem realizando um trabalho focado na formação e na qualificação de profissionais para este segmento, viajando o país com workshops e cursos para que cada vez mais pessoas que querem ingressar no ramo, ou que já estão no mercado, possam oferecer o melhor serviço ao cliente, entendendo as necessidades e as dificuldades dos instaladores e das empresas em capacitar a sua equipe.',
  'Baseado no método criado por Thiago Sossai (Instrutor Certificado PRO EXPERT®), criamos a Academia de Envelopamento Automotivo Alltak®: um curso moderno e dinâmico, com uma visão geral de todos os aspectos envolvidos no envelopamento automotivo, do equilíbrio entre qualidade, durabilidade e eficiência.',
]

const MERCADO_E_METODO: Bloco[] = [
  {
    titulo: 'Mercado de trabalho',
    texto: [
      'O mercado de envelopamento automotivo está em alta, e a cada ano cresce a procura por profissionais que dominam as técnicas corretas de instalação.',
      'Quem investe para aprender com profissionais certificados, diretamente da indústria que produz o próprio material, tem um grande diferencial para prestar um bom serviço ao cliente, no envelopamento automotivo, na comunicação visual ou na decoração. Quem se dedicar e colocar em prática tudo o que absorver no treinamento terá condições de ser referência na área.',
    ],
  },
  {
    titulo: 'Método',
    texto: [
      'A Alltak oferece treinamento prático, com técnicas corretas e atualizadas, em peças reais. Durante o treinamento o aluno vivencia a rotina de um instalador no dia a dia e trabalha em equipe para entregar um carro todo envelopado.',
      'O método proporciona um fluxo de trabalho limpo e organizado, que facilita a vida do instalador, diminuindo o tempo de aplicação e evitando erros, perdas e retrabalho.',
    ],
  },
]

const REGRAS = [
  'As aulas são 100% práticas, com certificado no final do curso.',
  'Recomendamos roupas leves. O acesso à fábrica é restrito para quem estiver de bermuda, camiseta regata ou de time, sandálias, salto alto, chinelos ou similares.',
  'É proibido o acesso de acompanhantes, fumar, gravar, filmar ou fotografar dentro das dependências da fábrica.',
  'Se o aluno não cumprir a carga horária total do curso, não receberá o certificado, a reposição da aula nem reembolso ou diferença do valor.',
  'A Alltak não tem vagas internas de estacionamento durante o treinamento; os veículos podem ser estacionados do lado externo da fábrica.',
  'Em caso de cancelamento da inscrição, será debitada multa de 20% do valor se a Alltak não for notificada até 72 horas antes da realização. Em caso de falta no dia do curso, o valor não é devolvido.',
  'As inscrições são validadas somente após a confirmação do pagamento.',
  'Ao adquirir o curso, você autoriza, de forma gratuita, a Alltak Indústria e Comércio de Adesivo Ltda (CNPJ 28.931.874/0001-81) a usar a sua imagem ou depoimento para fins de divulgação, testemunho de experiências ou colaboração no evento. Fica eleito o Foro da Comarca de Guarulhos para dirimir eventuais questões.',
]

export const CURSOS: Curso[] = [
  {
    slug: 'academia-de-envelopamento',
    nome: 'Academia de Envelopamento',
    chamada: 'Envelopamento automotivo sem mistérios',
    resumo: 'O método Alltak de envelopamento automotivo, criado por Thiago Sossai, em dois módulos: Intermediário e Avançado.',
    imagem: `${UP}/2021/01/banner-alltak-academia-de-envelopamento.jpg`,
    banner: `${UP}/2021/01/banner-alltak-academia-de-envelopamento.jpg`,
    modulos: ['modulo-intermediario', 'modulo-avancado'],
    blocos: [{ titulo: 'Sobre a Academia', texto: INTRO_ACADEMIA }],
  },
  {
    slug: 'modulo-intermediario',
    pai: 'academia-de-envelopamento',
    nome: 'Módulo Intermediário',
    chamada: 'Envelopamento automotivo sem mistérios',
    resumo: 'Para quem já atua no mercado e para quem busca iniciar no ramo: um fluxo de trabalho limpo e organizado, que diminui o tempo de aplicação e evita erros, perdas e retrabalho.',
    imagem: `${UP}/2021/01/banner-alltak-academia-de-envelopamento.jpg`,
    banner: `${UP}/2021/01/banner-alltak-academia-de-envelopamento.jpg`,
    blocos: [
      { titulo: 'O curso', texto: INTRO_ACADEMIA },
      ...MERCADO_E_METODO,
      {
        titulo: 'Programa · primeiro dia',
        lista: [
          'Apresentação Alltak', 'Diferenças entre materiais', 'Qual o produto correto?', 'O que é material calandrado',
          'Preparação do ambiente de trabalho', 'Preparação para a avaliação técnica com o cliente', 'Tipos de ferramentas',
          'Como limpar e remover interferências', 'Acabamentos, cortes e cantos (manipulação correta do estilete)',
          'Aplicação (manuseio da espátula e demais ferramentas auxiliares)',
          'Técnicas de aplicação: linha mestra, triangulação e cortes de alívio',
        ],
      },
      {
        titulo: 'Programa · segundo dia',
        lista: [
          'Como instalar corretamente o autoadesivo nos retrovisores', 'Memória elástica do PVC (soprador térmico e aquecimento)',
          'Áreas de recesso e concavidades', 'Para-choques', 'Finalização, remoção e revisão final',
        ],
      },
    ],
    fatos: {
      carga: '16 horas em 2 dias, das 8h às 17h, com 1h de almoço',
      investimento: 'R$ 1.119,99 em até 6x sem juros',
      local: LOCAL_ALLTAK,
      requisitos: 'Ser maior de 18 anos.',
    },
    incluso: ['Acesso ao conteúdo online (videoaula + apostila)', 'Certificado', '5 metros de adesivo da linha Alltak Tuning'],
    leia: REGRAS,
    agenda: 'https://www.alltakstore.com.br/academia-de-envelopamento',
  },
  {
    slug: 'modulo-avancado',
    pai: 'academia-de-envelopamento',
    nome: 'Módulo Avançado',
    chamada: 'Envelopamento automotivo para profissionais do mercado',
    resumo: 'Para quem já participou do Intermediário e atua no envelopamento: técnicas para veículos mais complexos. É a preparação para a certificação Pro Expert.',
    imagem: `${UP}/2021/01/banner-alltak-academia-de-envelopamento.jpg`,
    banner: `${UP}/2021/01/banner-alltak-academia-de-envelopamento.jpg`,
    blocos: [
      {
        titulo: 'O curso',
        texto: [
          ...INTRO_ACADEMIA,
          'O Módulo Avançado é 100% voltado a profissionais que já têm vivência no envelopamento automotivo e querem se aprofundar em técnicas e práticas avançadas, para aprimorar a qualidade dos trabalhos e evoluir profissionalmente. Este módulo é a premissa para se preparar para a certificação Pro Expert.',
        ],
      },
      ...MERCADO_E_METODO,
      {
        titulo: 'Descritivo',
        lista: [
          'Metodologia aplicada: troca de cor do veículo', 'Memória do vinil adesivo', 'Pós-aquecimento', 'Quebra de memória',
          'Instalação em maçanetas', 'Instalação em antena tubarão', 'Instalação em espelhos', 'Retrovisores complexos',
          'Instalação em aerofólio', 'Instalação em para-choques', 'Acesso a um bônus exclusivo',
        ],
      },
    ],
    fatos: {
      carga: '16 horas em 2 dias, das 8h às 17h, com 1h de almoço',
      local: LOCAL_ALLTAK,
      requisitos: 'Ser maior de 18 anos, ter experiência no mercado e, de preferência, ter feito o Módulo Intermediário.',
    },
    incluso: ['Acesso ao conteúdo online', 'Certificado (impresso e digital)', '5 metros de adesivo da linha Alltak Tuning'],
    leia: [...REGRAS, 'A Alltak escolhe qual material será cedido no final do curso como cortesia.'],
    agenda: 'https://www.alltakstore.com.br/avancado',
  },
  {
    slug: 'treinamento-alltak-decor',
    nome: 'Treinamento Alltak Decor',
    chamada: 'Aprenda envelopamento decorativo com a Alltak',
    resumo: 'Revestimento de paredes, móveis, geladeiras e vidros num ambiente que simula situações reais, para você oferecer tudo o que o revestimento vinílico pode trazer ao design de interiores.',
    imagem: `${UP}/2021/06/envelopamento-decorativo-alltak-decor-aplicacao1.jpg`,
    banner: `${UP}/2021/06/envelopamento-decorativo-alltak-decor-desktop.jpg`,
    blocos: [
      {
        titulo: 'Obra limpa',
        texto: [
          'Todo mundo já passou por uma obra, onde o transtorno, o quebra-quebra, a sujeira e o barulho são inevitáveis. Os revestimentos vinílicos adesivos Alltak Decor se tornaram uma realidade na hora de transformar um ambiente, seja corporativo, hoteleiro, hospitalar ou residencial, permitindo o que os arquitetos chamam de “obra limpa”: sem os transtornos da reforma, sem cheiro durante e após a instalação, e com menos tempo na entrega do projeto.',
          'A versatilidade também é um grande diferencial: dá para instalar em móveis, paredes, eletrodomésticos, objetos e muito mais.',
        ],
      },
      {
        titulo: 'Vantagens',
        lista: [
          'Agilidade na aplicação: no Programa Decora (GNT), o arquiteto Maurício Arruda transformou uma brinquedoteca com acabamento madeirado em apenas 1 dia',
          'Renovação e proteção: móveis e objetos renovados e protegidos',
          'Processo 100% reversível: cansou, trocou. Ótimo para imóveis alugados ou espaços temporários',
          'Excelente custo-benefício: um ambiente visualmente novo, sem o custo de uma obra convencional',
        ],
      },
      {
        titulo: 'Mercado',
        texto: [
          'Além de ser uma área com grande procura, estudos apontam que ambientes corporativos bem decorados motivam e inspiram os colaboradores, trazendo melhor desempenho e criatividade.',
          'Ao longo dos anos a Alltak® vem percebendo a expansão do mercado de envelopamento decorativo, e com ela a demanda e a necessidade de qualificação. Por isso elaboramos um treinamento dinâmico, focado em cada detalhe, do revestimento de paredes aos móveis, geladeiras e vidros, para você aumentar a sua rentabilidade.',
        ],
      },
      {
        titulo: 'O curso',
        texto: ['O curso é ministrado num ambiente preparado e realista, simulando todas as situações de um ambiente de verdade.'],
        lista: [
          'Apresentação', 'Composição e construção do material', 'Vantagens do envelopamento decorativo', 'Combinações de cores e texturas',
          'Análise de ambiente', 'Tipos de superfícies', 'Tipos de ferramentas', 'Técnicas de espatulagem',
          'Técnicas de corte e manuseio do estilete', 'Técnicas de encaixe da imagem e sobreposição',
          'Aplicação em superfícies planas: parede e piso', 'Cantos e bordas', 'Acabamento em cantos e bordas', 'Aplicação em móveis',
          'Aplicação em superfícies curvas', 'Aplicação em áreas complexas', 'Aplicação e acabamentos', 'Como envelopar geladeiras',
          'Aplicação em vidros sem mistérios', 'Finalização da decoração no espaço', 'Remoção e revisão final',
        ],
      },
    ],
    fatos: {
      carga: '16 horas, das 8h às 17h, com 1h de almoço',
      investimento: 'R$ 1.119,99 em até 6x sem juros',
      local: 'Fábrica da Alltak® em Guarulhos – SP',
      requisitos: 'Ser maior de 18 anos.',
    },
    incluso: ['5 metros de material', 'Certificado impresso e digital'],
    leia: REGRAS,
    agenda: 'https://www.alltakstore.com.br/cursos-decorativo',
    galeria: [1, 2, 3, 4, 6, 7, 8].map((n) => `${UP}/2021/06/envelopamento-decorativo-alltak-decor-aplicacao${n}.jpg`),
  },
  {
    slug: 'alltak-experience',
    nome: 'Alltak Experience',
    chamada: 'Workshops gratuitos pelo Brasil',
    resumo: 'A equipe Alltak® viaja pelo Brasil com distribuidores e parceiros, num bate-papo sobre as possibilidades criativas e lucrativas em decoração, comunicação visual e envelopamento automotivo.',
    imagem: `${UP}/2023/09/WhatsApp-Image-2023-09-26-at-17.30.22.jpeg`,
    blocos: [
      {
        titulo: 'Sobre a Alltak Experience',
        texto: [
          'A equipe Alltak® está viajando pelo Brasil, sempre em parceria com um distribuidor ou parceiro de negócios, apresentando toda a sua linha de produtos num bate-papo sobre as possibilidades criativas e lucrativas nas áreas de decoração, comunicação visual e envelopamento automotivo.',
          'O workshop é totalmente sem custo, com coffee break e sorteio de brindes exclusivos Alltak no final. As vagas são limitadas.',
          'O objetivo dos workshops é despertar a criatividade, usando os produtos de diversas formas, agregando valor e versatilidade, com uma visão inovadora e pensando na expansão do mercado.',
        ],
      },
    ],
    eventos: [
      { titulo: 'Wrap Revolution Tour – Rio de Janeiro/RJ', local: 'Danifilm', data: '2026-07-31', quando: '31 de julho de 2026, a partir das 9h', url: 'https://doity.com.br/workshop-automotivo--danifilm--rio-de-janeirorj' },
      { titulo: 'Wrap Revolution Tour – Caruaru/PE', local: 'Potisigns', data: '2026-08-04', quando: '4 de agosto de 2026, a partir das 9h', url: 'https://doity.com.br/alltak-lab-potisigns-caruaru' },
      { titulo: 'Wrap Revolution Tour – Teresina/PI', local: 'CDL Teresina', data: '2026-08-12', quando: '12 de agosto de 2026, a partir das 18h30', url: 'https://doity.com.br/workshop-decorativo--teresinapi' },
    ],
    galeria: [
      '2023/09/WhatsApp-Image-2023-09-26-at-16.43.42.jpeg', '2023/09/WhatsApp-Image-2023-09-26-at-17.30.22-1.jpeg',
      '2023/09/WhatsApp-Image-2023-09-26-at-17.30.22-2.jpeg', '2023/09/WhatsApp-Image-2023-09-26-at-16.43.42-1.jpeg',
      '2023/09/WhatsApp-Image-2023-09-26-at-16.43.42-2.jpeg', '2023/09/WhatsApp-Image-2023-09-26-at-16.43.41.jpeg',
    ].map((f) => `${UP}/${f}`),
  },
]

// a página de Cursos mostra os três cursos de topo, como o site antigo
export const CURSOS_TOPO = ['academia-de-envelopamento', 'alltak-experience', 'treinamento-alltak-decor']
export const cursoPorSlug = (s?: string) => CURSOS.find((c) => c.slug === s)
