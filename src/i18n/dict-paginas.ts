import type { Lang } from './index'

// Textos da área "paginas" (PT, EN, ES). Ligado ao dicionário principal em dict.ts.
export const DICT_PAGINAS: Record<string, Record<Lang, string>> = {
  'prod.sobreLinha': { pt: 'Sobre a linha', en: 'About the line', es: 'Sobre la línea' },
  'prod.fichaCompleta': { pt: 'Ficha técnica completa', en: 'Full technical sheet', es: 'Ficha técnica completa' },
  'prod.menos': { pt: 'Mostrar menos', en: 'Show less', es: 'Mostrar menos' },
  'prod.fonte': { pt: 'Fonte: catálogo', en: 'Source: catalog', es: 'Fuente: catálogo' },
  'cor.ficha': { pt: 'Ficha técnica', en: 'Technical sheet', es: 'Ficha técnica' },
  'cor.sobre': { pt: 'Sobre o padrão', en: 'About this pattern', es: 'Sobre el diseño' },
  // ---- página de segmento (Aplicações Técnicas, Wrap Care, Acessórios) ----
  'seg.eyebrow': { pt: 'Linhas de produto', en: 'Product lines', es: 'Líneas de producto' },
  'seg.todos': { pt: 'Todos os produtos', en: 'All products', es: 'Todos los productos' },
  'seg.item': { pt: 'foto', en: 'photo', es: 'foto' },
  'seg.itens': { pt: 'fotos', en: 'photos', es: 'fotos' },
  'seg.verProduto': { pt: 'Ver produto', en: 'View product', es: 'Ver producto' },
  'seg.aplicacoes': {
    pt: 'Linha Alltak® Tec para aplicações técnicas: dupla face, laminações, máscaras de proteção e de transferência e pisos. Clique em um produto para ver a ficha técnica.',
    en: 'Alltak® Tec line for technical applications: double-sided tape, laminates, protection and transfer masks, and floors. Click a product to see its technical sheet.',
    es: 'Línea Alltak® Tec para aplicaciones técnicas: doble faz, laminados, máscaras de protección y de transferencia, y pisos. Haz clic en un producto para ver su ficha técnica.',
  },
  'seg.wrapcare': {
    pt: 'Linha de cuidados para o envelopamento: remoção de cola, preparação da superfície e proteção do vinil. Clique em um produto para ver o modo de uso.',
    en: 'Care line for vehicle wrapping: glue removal, surface preparation and vinyl protection. Click a product to see how to use it.',
    es: 'Línea de cuidado para la rotulación: remoción de pegamento, preparación de la superficie y protección del vinilo. Haz clic en un producto para ver el modo de uso.',
  },
  'seg.acessorios': {
    pt: 'Acessórios para o acabamento do envelopamento. Clique no produto para ver os detalhes.',
    en: 'Accessories for finishing vehicle wraps. Click the product to see the details.',
    es: 'Accesorios para el acabado de la rotulación. Haz clic en el producto para ver los detalles.',
  },
  // ---- Sobre ----
  'sobre.eyebrow': { pt: 'Quem somos', en: 'Who we are', es: 'Quiénes somos' },
  'sobre.titulo': { pt: 'Sobre a Alltak', en: 'About Alltak', es: 'Sobre Alltak' },
  'sobre.headerSub': {
    pt: 'Uma das principais fabricantes de adesivos do Brasil, especializada em envelopamento, decoração e comunicação visual. Do começo ao fim, com padrão Alltak.',
    en: 'One of the leading adhesive vinyl manufacturers in Brazil, specialized in vehicle wrapping, decor and visual communication. From start to finish, to the Alltak standard.',
    es: 'Uno de los principales fabricantes de vinilos adhesivos de Brasil, especializado en rotulación, decoración y comunicación visual. De principio a fin, con el estándar Alltak.',
  },
  'sobre.historiaTag': { pt: 'Nossa história', en: 'Our story', es: 'Nuestra historia' },
  'sobre.historiaTitulo': {
    pt: 'Adesivo nacional, padrão internacional',
    en: 'Made in Brazil, world-class standard',
    es: 'Vinilo nacional, estándar internacional',
  },
  'sobre.historia1': {
    pt: 'Fundada em 2017 e sediada em Guarulhos, na Grande São Paulo, a Alltak nasceu para transformar o mercado auto adesivo brasileiro com produção 100% nacional.',
    en: 'Founded in 2017 and headquartered in Guarulhos, in Greater São Paulo, Alltak was created to transform the Brazilian self-adhesive market with 100% local production.',
    es: 'Fundada en 2017 y con sede en Guarulhos, en el Gran São Paulo, Alltak nació para transformar el mercado autoadhesivo brasileño con producción 100% nacional.',
  },
  'sobre.historia2': {
    pt: 'São 7.500 metros quadrados totalmente dedicados à fabricação de laminados de PVC para envelopamento e customização de veículos, decoração, sign & design, comunicação visual, impressão, laminação e aplicações técnicas.',
    en: 'That is 7,500 square meters fully dedicated to manufacturing PVC films for vehicle wrapping and customization, decor, sign & design, visual communication, printing, lamination and technical applications.',
    es: 'Son 7.500 metros cuadrados totalmente dedicados a la fabricación de laminados de PVC para rotulación y personalización de vehículos, decoración, sign & design, comunicación visual, impresión, laminación y aplicaciones técnicas.',
  },
  'sobre.historia3': {
    pt: 'A marca se destaca pela qualidade, texturas, inovação, novas tecnologias, moldabilidade e, principalmente, pelo brilho, consolidando-se cada vez mais no Brasil e em países da América do Sul, América do Norte e Europa.',
    en: 'The brand stands out for its quality, textures, innovation, new technologies, conformability and, above all, its gloss, growing ever stronger in Brazil and in countries across South America, North America and Europe.',
    es: 'La marca se destaca por su calidad, texturas, innovación, nuevas tecnologías, moldeabilidad y, sobre todo, por su brillo, consolidándose cada vez más en Brasil y en países de América del Sur, América del Norte y Europa.',
  },
  'sobre.stat.fundacao': { pt: 'Fundação, em Guarulhos (SP)', en: 'Founded in Guarulhos (SP)', es: 'Fundación, en Guarulhos (SP)' },
  'sobre.stat.producao': { pt: 'Dedicados à produção', en: 'Dedicated to production', es: 'Dedicados a la producción' },
  'sobre.stat.nacional': { pt: 'Adesivos de fabricação nacional', en: 'Vinyl made in Brazil', es: 'Vinilos de fabricación nacional' },
  'sobre.stat.continentes': { pt: 'Continentes atendidos', en: 'Continents served', es: 'Continentes atendidos' },
  'sobre.missao': { pt: 'Missão', en: 'Mission', es: 'Misión' },
  'sobre.missaoTexto': {
    pt: 'Produzir laminados de PVC com qualidade, inovação, pontualidade e preços justos, gerando empregos e cativando clientes por meio da qualificação constante das equipes e da agilidade nas decisões.',
    en: 'To produce PVC films with quality, innovation, punctuality and fair prices, creating jobs and winning customers through the constant development of our teams and agile decision-making.',
    es: 'Producir laminados de PVC con calidad, innovación, puntualidad y precios justos, generando empleos y cautivando clientes mediante la capacitación constante de los equipos y la agilidad en las decisiones.',
  },
  'sobre.visao': { pt: 'Visão', en: 'Vision', es: 'Visión' },
  'sobre.visaoTexto': {
    pt: 'Ser a maior empresa de laminados de PVC atuando nos mercados interno e externo, por meio de pesquisa e desenvolvimento de produtos e serviços, cumprindo seu papel social e respeitando o meio ambiente.',
    en: 'To be the largest PVC film company in the domestic and international markets, through research and development of products and services, fulfilling its social role and respecting the environment.',
    es: 'Ser la mayor empresa de laminados de PVC en los mercados interno y externo, mediante la investigación y el desarrollo de productos y servicios, cumpliendo su papel social y respetando el medio ambiente.',
  },
  'sobre.valoresTag': { pt: 'Nossos valores', en: 'Our values', es: 'Nuestros valores' },
  'sobre.valoresTitulo': { pt: 'O que nos move', en: 'What drives us', es: 'Lo que nos mueve' },
  'sobre.valor.inovacao': { pt: 'Inovação', en: 'Innovation', es: 'Innovación' },
  'sobre.valor.etica': { pt: 'Ética', en: 'Ethics', es: 'Ética' },
  'sobre.valor.respeito': { pt: 'Respeito', en: 'Respect', es: 'Respeto' },
  'sobre.valor.uniao': { pt: 'União', en: 'Unity', es: 'Unión' },
  'sobre.valor.agilidade': { pt: 'Agilidade', en: 'Agility', es: 'Agilidad' },
  'sobre.valor.qualidade': { pt: 'Qualidade', en: 'Quality', es: 'Calidad' },
  'sobre.linhasTag': { pt: 'Para todas as superfícies', en: 'For every surface', es: 'Para todas las superficies' },
  'sobre.linhasTitulo': { pt: 'O que produzimos', en: 'What we make', es: 'Lo que producimos' },
  'sobre.linha.envelopamento': {
    pt: 'Envelopamento e Customização de Veículos',
    en: 'Vehicle Wrapping and Customization',
    es: 'Rotulación y Personalización de Vehículos',
  },
  'sobre.linha.decoracao': { pt: 'Decoração', en: 'Decor', es: 'Decoración' },
  'sobre.linha.sign': { pt: 'Sign & Design', en: 'Sign & Design', es: 'Sign & Design' },
  'sobre.linha.comunicacao': { pt: 'Comunicação Visual', en: 'Visual Communication', es: 'Comunicación Visual' },
  'sobre.linha.impressao': { pt: 'Impressão', en: 'Printing', es: 'Impresión' },
  'sobre.linha.laminacao': { pt: 'Laminação', en: 'Lamination', es: 'Laminación' },
  'sobre.linha.tecnicas': { pt: 'Aplicações Técnicas', en: 'Technical Applications', es: 'Aplicaciones Técnicas' },
  'sobre.sustTag': { pt: 'Sustentabilidade', en: 'Sustainability', es: 'Sostenibilidad' },
  'sobre.sustTitulo': { pt: 'Usina de Reciclagem própria', en: 'Our own Recycling Plant', es: 'Planta de Reciclaje propia' },
  'sobre.sust1': {
    pt: 'Comprometida em construir um futuro sustentável para as novas gerações, a Alltak criou sua própria Usina de Reciclagem.',
    en: 'Committed to building a sustainable future for new generations, Alltak created its own Recycling Plant.',
    es: 'Comprometida con construir un futuro sostenible para las nuevas generaciones, Alltak creó su propia Planta de Reciclaje.',
  },
  'sobre.sust2': {
    pt: 'O centro de reciclagem processa aparas e materiais que são transformados para dar origem a novos produtos, reduzindo o impacto ambiental de toda a operação.',
    en: 'The recycling center processes trimmings and materials that are transformed into new products, reducing the environmental impact of the entire operation.',
    es: 'El centro de reciclaje procesa recortes y materiales que se transforman para dar origen a nuevos productos, reduciendo el impacto ambiental de toda la operación.',
  },
  'sobre.sustCard': { pt: 'Do resíduo ao novo produto', en: 'From waste to new product', es: 'Del residuo al nuevo producto' },
  'sobre.sustCardTexto': {
    pt: 'Economia circular aplicada à produção de laminados de PVC.',
    en: 'Circular economy applied to PVC film production.',
    es: 'Economía circular aplicada a la producción de laminados de PVC.',
  },
  'sobre.ctaTitulo': {
    pt: 'Quer levar o padrão Alltak para o seu projeto?',
    en: 'Want to bring the Alltak standard to your project?',
    es: '¿Quieres llevar el estándar Alltak a tu proyecto?',
  },
  'sobre.ctaFale': { pt: 'Fale com a gente', en: 'Talk to us', es: 'Habla con nosotros' },

  // ---- Contato ----
  'contato.eyebrow': { pt: 'Fale com a Alltak', en: 'Talk to Alltak', es: 'Habla con Alltak' },
  'contato.headerSub': {
    pt: 'Preencha o formulário e nossa equipe retornará. Para compras, use a Alltak Store; para dúvidas técnicas, o suporte especializado.',
    en: 'Fill out the form and our team will get back to you. For purchases, use the Alltak Store; for technical questions, our specialized support.',
    es: 'Completa el formulario y nuestro equipo te responderá. Para compras, usa la Alltak Store; para dudas técnicas, el soporte especializado.',
  },
  'contato.enviado': { pt: 'Mensagem enviada!', en: 'Message sent!', es: '¡Mensaje enviado!' },
  'contato.enviadoTexto': {
    pt: 'Obrigado pelo contato. Retornaremos em breve. (Formulário de demonstração, integrar ao e-mail/CRM da Alltak.)',
    en: 'Thank you for reaching out. We will get back to you soon. (Demo form, to be connected to Alltak’s email/CRM.)',
    es: 'Gracias por contactarnos. Te responderemos pronto. (Formulario de demostración, integrar al correo/CRM de Alltak.)',
  },
  'contato.nome': { pt: 'Nome', en: 'Name', es: 'Nombre' },
  'contato.empresa': { pt: 'Empresa', en: 'Company', es: 'Empresa' },
  'contato.email': { pt: 'E-mail', en: 'Email', es: 'Correo electrónico' },
  'contato.whatsapp': { pt: 'WhatsApp', en: 'WhatsApp', es: 'WhatsApp' },
  'contato.cidade': { pt: 'Cidade', en: 'City', es: 'Ciudad' },
  'contato.estado': { pt: 'Estado', en: 'State', es: 'Estado' },
  'contato.perfil': { pt: 'Perfil', en: 'Profile', es: 'Perfil' },
  'contato.assunto': { pt: 'Assunto', en: 'Subject', es: 'Asunto' },
  'contato.mensagem': { pt: 'Mensagem', en: 'Message', es: 'Mensaje' },
  'contato.enviar': { pt: 'Enviar mensagem', en: 'Send message', es: 'Enviar mensaje' },
  'contato.perfil.aplicador': { pt: 'Aplicador', en: 'Installer', es: 'Instalador' },
  'contato.perfil.distribuidor': { pt: 'Distribuidor', en: 'Distributor', es: 'Distribuidor' },
  'contato.perfil.arquiteto': { pt: 'Arquiteto', en: 'Architect', es: 'Arquitecto' },
  'contato.perfil.grafica': { pt: 'Gráfica', en: 'Print shop', es: 'Imprenta' },
  'contato.perfil.consumidor': { pt: 'Consumidor final', en: 'End consumer', es: 'Consumidor final' },
  'contato.outro': { pt: 'Outro', en: 'Other', es: 'Otro' },
  'contato.assunto.compra': { pt: 'Compra', en: 'Purchase', es: 'Compra' },
  'contato.assunto.produto': { pt: 'Produto', en: 'Product', es: 'Producto' },
  'contato.assunto.suporte': { pt: 'Suporte técnico', en: 'Technical support', es: 'Soporte técnico' },
  'contato.assunto.revenda': { pt: 'Revenda', en: 'Reselling', es: 'Reventa' },
  'contato.assunto.cursos': { pt: 'Cursos', en: 'Courses', es: 'Cursos' },
  'contato.assunto.institucional': { pt: 'Institucional', en: 'Corporate', es: 'Institucional' },
  'contato.atendimento': { pt: 'Atendimento', en: 'Business hours', es: 'Atención' },
  'contato.horario': { pt: 'Seg. a Sex., 8h às 18h', en: 'Mon. to Fri., 8 a.m. to 6 p.m.', es: 'Lun. a vie., de 8 a 18 h' },
  'contato.endereco': { pt: 'Endereço', en: 'Address', es: 'Dirección' },
  'contato.enderecoTexto': {
    pt: 'Preencher com o endereço oficial da Alltak.',
    en: 'To be filled in with Alltak’s official address.',
    es: 'Completar con la dirección oficial de Alltak.',
  },

  // ---- Onde comprar ----
  'onde.eyebrow': { pt: 'Rede de distribuição', en: 'Distribution network', es: 'Red de distribución' },
  'onde.titulo': { pt: 'Onde comprar', en: 'Where to buy', es: 'Dónde comprar' },
  'onde.headerSub': {
    pt: 'Encontre distribuidores Alltak perto de você. Selecione o estado para filtrar a lista.',
    en: 'Find Alltak distributors near you. Select a state to filter the list.',
    es: 'Encuentra distribuidores Alltak cerca de ti. Selecciona el estado para filtrar la lista.',
  },
  'onde.todos': { pt: 'Todos', en: 'All', es: 'Todos' },
  'onde.verMapa': { pt: 'Ver no mapa', en: 'View on map', es: 'Ver en el mapa' },

  // ---- Instaladores ----
  'inst.eyebrow': { pt: 'Rede credenciada', en: 'Accredited network', es: 'Red acreditada' },
  'inst.titulo': { pt: 'Instaladores Pro-Expert', en: 'Pro-Expert Installers', es: 'Instaladores Pro-Expert' },
  'inst.headerSub': {
    pt: 'aplicadores certificados pela Alltak no Brasil e na América Latina. Qualidade de aplicação com o padrão Alltak, do começo ao fim.',
    en: 'Alltak-certified installers in Brazil and Latin America. Application quality to the Alltak standard, from start to finish.',
    es: 'instaladores certificados por Alltak en Brasil y América Latina. Calidad de aplicación con el estándar Alltak, de principio a fin.',
  },
  'inst.fechar': { pt: 'Fechar', en: 'Close', es: 'Cerrar' },

  // ---- Cursos ----
  'cursos.eyebrow': { pt: 'Academia Alltak', en: 'Alltak Academy', es: 'Academia Alltak' },
  'cursos.titulo': { pt: 'Cursos', en: 'Courses', es: 'Cursos' },
  'cursos.headerSub': {
    pt: 'Treinamentos para elevar o nível da sua aplicação. Sem turmas com data aberta no momento. Deixe seu interesse para as próximas.',
    en: 'Training to take your application skills to the next level. No classes are currently scheduled. Register your interest for the upcoming ones.',
    es: 'Capacitaciones para elevar el nivel de tu aplicación. No hay grupos con fecha abierta en este momento. Deja tu interés para los próximos.',
  },
  'cursos.interesse': { pt: 'Tenho interesse', en: 'I’m interested', es: 'Me interesa' },
  'cursos.academia.nome': { pt: 'Academia de Envelopamento', en: 'Wrapping Academy', es: 'Academia de Rotulación' },
  'cursos.academia.nivel': { pt: 'Básico', en: 'Basic', es: 'Básico' },
  'cursos.academia.desc': {
    pt: 'Fundamentos de aplicação e manuseio dos materiais.',
    en: 'Fundamentals of application and material handling.',
    es: 'Fundamentos de aplicación y manejo de los materiales.',
  },
  'cursos.intermediario.nome': { pt: 'Módulo Intermediário', en: 'Intermediate Module', es: 'Módulo Intermedio' },
  'cursos.intermediario.nivel': { pt: 'Intermediário', en: 'Intermediate', es: 'Intermedio' },
  'cursos.intermediario.desc': {
    pt: 'Técnicas de aplicação em superfícies complexas.',
    en: 'Application techniques for complex surfaces.',
    es: 'Técnicas de aplicación en superficies complejas.',
  },
  'cursos.avancado.nome': { pt: 'Módulo Avançado', en: 'Advanced Module', es: 'Módulo Avanzado' },
  'cursos.avancado.nivel': { pt: 'Avançado', en: 'Advanced', es: 'Avanzado' },
  'cursos.avancado.desc': {
    pt: 'Acabamento profissional e produtividade.',
    en: 'Professional finishing and productivity.',
    es: 'Acabado profesional y productividad.',
  },
  'cursos.decor.nome': { pt: 'Treinamento Alltak Decor', en: 'Alltak Decor Training', es: 'Capacitación Alltak Decor' },
  'cursos.decor.nivel': { pt: 'Especial', en: 'Special', es: 'Especial' },
  'cursos.decor.desc': {
    pt: 'Aplicação de revestimentos em ambientes.',
    en: 'Applying surface coverings in interiors.',
    es: 'Aplicación de revestimientos en ambientes.',
  },
  'cursos.experience.nome': { pt: 'Alltak Experience', en: 'Alltak Experience', es: 'Alltak Experience' },
  'cursos.experience.nivel': { pt: 'Imersão', en: 'Immersion', es: 'Inmersión' },
  'cursos.experience.desc': {
    pt: 'Experiência completa com a marca e os produtos.',
    en: 'A complete experience with the brand and its products.',
    es: 'Experiencia completa con la marca y los productos.',
  },

  // ---- Catálogos ----
  'cat.eyebrow': { pt: 'Materiais de apoio', en: 'Support materials', es: 'Materiales de apoyo' },
  'cat.headerSub': {
    pt: 'Organizados por linha para facilitar a escolha do produto certo. Baixe, consulte e resolva rápido no atendimento, na especificação e na aplicação.',
    en: 'Organized by line to make choosing the right product easier. Download, look things up and get answers fast for customer service, specification and application.',
    es: 'Organizados por línea para facilitar la elección del producto correcto. Descarga, consulta y resuelve rápido en la atención, la especificación y la aplicación.',
  },
  'cat.catalogo': { pt: 'Catálogo', en: 'Catalog', es: 'Catálogo' },
  'cat.emBreve': { pt: 'Em breve', en: 'Coming soon', es: 'Próximamente' },
  'cat.marcaTag': { pt: 'Materiais da marca', en: 'Brand materials', es: 'Materiales de la marca' },
  'cat.marcaTitulo': { pt: 'Logos e manuais', en: 'Logos and manuals', es: 'Logos y manuales' },
  'cat.marcaTexto': {
    pt: 'Baixe os materiais oficiais da Alltak. O download é liberado após um cadastro rápido, para mantermos você por dentro das novidades e do suporte.',
    en: 'Download Alltak’s official materials. The download is unlocked after a quick sign-up, so we can keep you up to date on news and support.',
    es: 'Descarga los materiales oficiales de Alltak. La descarga se habilita tras un registro rápido, para mantenerte al tanto de las novedades y del soporte.',
  },
  'cat.grupo.logos': { pt: 'Logos da marca', en: 'Brand logos', es: 'Logos de la marca' },
  'cat.grupo.patterns': { pt: 'Patterns', en: 'Patterns', es: 'Patterns' },
  'cat.grupo.perfis': { pt: 'Perfis de cor', en: 'Color profiles', es: 'Perfiles de color' },
  'cat.grupo.wallpapers': { pt: 'Wallpapers Alltak Tuning', en: 'Alltak Tuning Wallpapers', es: 'Wallpapers Alltak Tuning' },
  'cat.grupo.instalador': { pt: 'Materiais do instalador', en: 'Installer materials', es: 'Materiales del instalador' },
  'cat.arquivo': { pt: 'Arquivo', en: 'File', es: 'Archivo' },
  'cat.baixar': { pt: 'Baixar ↓', en: 'Download ↓', es: 'Descargar ↓' },

  // ---- Blog ----
  'blog.eyebrow': { pt: 'Conteúdo Alltak', en: 'Alltak content', es: 'Contenido Alltak' },
  'blog.headerSub': {
    pt: 'artigos sobre envelopamento automotivo, decoração com adesivos, tendências e cuidados com a aplicação.',
    en: 'articles on vehicle wrapping, decorating with vinyl, trends and application care. Articles are in Portuguese.',
    es: 'artículos sobre rotulación vehicular, decoración con vinilos, tendencias y cuidados en la aplicación. Los artículos están en portugués.',
  },
  'blog.buscar': { pt: 'Buscar artigo…', en: 'Search articles…', es: 'Buscar artículo…' },
  'blog.artigos': { pt: 'artigos', en: 'articles', es: 'artículos' },
  'blog.carregarMais': { pt: 'Carregar mais', en: 'Load more', es: 'Cargar más' },
  'blog.restantes': { pt: 'restantes', en: 'remaining', es: 'restantes' },
  'blog.naoEncontrado': { pt: 'Artigo não encontrado', en: 'Article not found', es: 'Artículo no encontrado' },
  'blog.voltar': { pt: 'Voltar ao blog', en: 'Back to the blog', es: 'Volver al blog' },
  'blog.leiaTambem': { pt: 'Leia também', en: 'Read also', es: 'Lee también' },

  // ---- Transparência salarial ----
  'transp.eyebrow': { pt: 'Institucional', en: 'Corporate', es: 'Institucional' },
  'transp.titulo': { pt: 'Transparência Salarial', en: 'Pay Transparency', es: 'Transparencia Salarial' },
  'transp.headerSub': {
    pt: 'Relatório de Transparência Salarial (RTS), em conformidade com a Lei 14.611/2023.',
    en: 'Pay Transparency Report (RTS), in compliance with Brazilian Law 14,611/2023.',
    es: 'Informe de Transparencia Salarial (RTS), de conformidad con la Ley brasileña 14.611/2023.',
  },
  // aviso só em EN/ES: o relatório oficial e o texto abaixo ficam em português
  'transp.aviso': {
    pt: '',
    en: 'This report is a Brazilian legal requirement. The official report and the text below are available in Portuguese only.',
    es: 'Este informe es una exigencia legal brasileña. El informe oficial y el texto a continuación están disponibles solo en portugués.',
  },
  'transp.vigente': { pt: 'Relatório vigente', en: 'Current report', es: 'Informe vigente' },
  'transp.semestre': { pt: '2º Semestre', en: '2nd Half', es: '2.º Semestre' },
  'transp.docOficial': {
    pt: 'Documento oficial publicado conforme a periodicidade semestral prevista na Lei 14.611/2023 e no Decreto 11.795/2023.',
    en: 'Official document published every six months, as required by Law 14,611/2023 and Decree 11,795/2023 (in Portuguese).',
    es: 'Documento oficial publicado con la periodicidad semestral prevista en la Ley 14.611/2023 y el Decreto 11.795/2023 (en portugués).',
  },
  'transp.baixar': { pt: 'Baixe o relatório aqui ↓', en: 'Download the report ↓', es: 'Descarga el informe aquí ↓' },

  // ---- Política de privacidade ----
  'priv.eyebrow': { pt: 'Legal', en: 'Legal', es: 'Legal' },
  'priv.titulo': { pt: 'Política de Privacidade', en: 'Privacy Policy', es: 'Política de Privacidad' },
  'priv.intro': {
    pt: 'Esta página descreve como a Alltak trata os dados coletados neste site. Conteúdo de demonstração. Substituir pelo texto jurídico oficial.',
    en: 'This page describes how Alltak handles the data collected on this website. Demo content. To be replaced with the official legal text.',
    es: 'Esta página describe cómo Alltak trata los datos recopilados en este sitio. Contenido de demostración. Sustituir por el texto jurídico oficial.',
  },
  'priv.usoTitulo': { pt: 'Uso de dados', en: 'Use of data', es: 'Uso de datos' },
  'priv.usoTexto': {
    pt: 'Os dados informados em formulários são utilizados exclusivamente para contato e atendimento.',
    en: 'The data provided in forms is used exclusively for contact and customer service.',
    es: 'Los datos informados en los formularios se utilizan exclusivamente para contacto y atención.',
  },
  'priv.cookiesTitulo': { pt: 'Cookies', en: 'Cookies', es: 'Cookies' },
  'priv.cookiesTexto': {
    pt: 'Utilizamos cookies para melhorar a navegação e entender o uso do site.',
    en: 'We use cookies to improve browsing and understand how the website is used.',
    es: 'Utilizamos cookies para mejorar la navegación y entender el uso del sitio.',
  },
  'priv.formTitulo': { pt: 'Formulários', en: 'Forms', es: 'Formularios' },
  'priv.formTexto': {
    pt: 'As informações enviadas são armazenadas de forma segura e não compartilhadas com terceiros sem consentimento.',
    en: 'The information you submit is stored securely and is not shared with third parties without consent.',
    es: 'La información enviada se almacena de forma segura y no se comparte con terceros sin consentimiento.',
  },
  'priv.direitosTitulo': { pt: 'Direitos do usuário', en: 'User rights', es: 'Derechos del usuario' },
  'priv.direitosTexto': {
    pt: 'Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.',
    en: 'You may request access to, correction of or deletion of your data at any time.',
    es: 'Puedes solicitar el acceso, la corrección o la eliminación de tus datos en cualquier momento.',
  },
  'priv.contatoTitulo': { pt: 'Contato', en: 'Contact', es: 'Contacto' },
  'priv.contatoTexto': {
    pt: 'Dúvidas sobre privacidade: contato@alltak.com.br.',
    en: 'Privacy questions: contato@alltak.com.br.',
    es: 'Dudas sobre privacidad: contato@alltak.com.br.',
  },

  // ---- produtos / linha (restantes) ----
  'prod.corAnterior': { pt: 'Cor anterior', en: 'Previous color', es: 'Color anterior' },
  'prod.proximaCor': { pt: 'Próxima cor', en: 'Next color', es: 'Color siguiente' },

  // ---- RevestFácil (textos alternativos) ----
  'rf.altAmostras': {
    pt: 'Amostras de revestimento RevestFácil',
    en: 'RevestFácil covering samples',
    es: 'Muestras de revestimiento RevestFácil',
  },
  'rf.altPdv': { pt: 'RevestFácil no ponto de venda', en: 'RevestFácil at the point of sale', es: 'RevestFácil en el punto de venta' },
  'rf.altLogo': {
    pt: 'Alltak RevestFácil · Revestimento vinílico adesivo',
    en: 'Alltak RevestFácil · Self-adhesive vinyl covering',
    es: 'Alltak RevestFácil · Revestimiento vinílico adhesivo',
  },

  // ---- 404 ----
  'notfound.eyebrow': { pt: 'Erro 404', en: 'Error 404', es: 'Error 404' },
  'notfound.titulo': { pt: 'Página não encontrada', en: 'Page not found', es: 'Página no encontrada' },
  'notfound.voltar': { pt: 'Voltar para a home', en: 'Back to home', es: 'Volver al inicio' },
}

// Valores de dados traduzidos com tv() (mesma regra de VALUES em dict.ts).
export const VALUES_PAGINAS: Record<string, Record<Exclude<Lang, 'pt'>, string>> = {
  // downloads (rótulos do WordPress)
  'CLIQUE AQUI PARA BAIXAR': { en: 'CLICK HERE TO DOWNLOAD', es: 'HAZ CLIC AQUÍ PARA DESCARGAR' },
  'Clique aqui para baixar': { en: 'Click here to download', es: 'Haz clic aquí para descargar' },
  'Clique para Baixar': { en: 'Click to download', es: 'Haz clic para descargar' },
  'Check list para envelopamento Alltak': { en: 'Alltak wrapping checklist', es: 'Checklist de rotulación Alltak' },
  'Manual de limpeza e conservacao para envelopamento Alltak': { en: 'Alltak wrap cleaning and care manual', es: 'Manual de limpieza y conservación de rotulación Alltak' },
  // nomes genéricos de linhas (marcas como Jateado, Carbon, Krusher ficam iguais)
  'FPP – Filme de Proteção de Pintura': { en: 'FPP – Paint Protection Film', es: 'FPP – Película de Protección de Pintura' },
  'FPP – FILME DE PROTEÇÃO DE PINTURA': { en: 'FPP – PAINT PROTECTION FILM', es: 'FPP – PELÍCULA DE PROTECCIÓN DE PINTURA' },
  'Laminações': { en: 'Laminates', es: 'Laminados' },
  'LAMINAÇÕES': { en: 'LAMINATES', es: 'LAMINADOS' },
  'Máscara de Proteção': { en: 'Protection Mask', es: 'Máscara de Protección' },
  'MÁSCARA DE PROTEÇÃO': { en: 'PROTECTION MASK', es: 'MÁSCARA DE PROTECCIÓN' },
  'Máscara de Transferência': { en: 'Transfer Tape', es: 'Máscara de Transferencia' },
  'MÁSCARA DE TRANSFERÊNCIA': { en: 'TRANSFER TAPE', es: 'MÁSCARA DE TRANSFERENCIA' },
  'Dupla Face': { en: 'Double-Sided', es: 'Doble Faz' },
  'DUPLA FACE': { en: 'DOUBLE-SIDED', es: 'DOBLE FAZ' },
  'Pisos': { en: 'Floors', es: 'Pisos' },
  'PISOS': { en: 'FLOORS', es: 'PISOS' },
  'Básicas': { en: 'Basics', es: 'Básicas' },
  'Pedras': { en: 'Stones', es: 'Piedras' },
  'Tijolo': { en: 'Brick', es: 'Ladrillo' },
  'Azulejo': { en: 'Tile', es: 'Azulejo' },
  'Estampados': { en: 'Prints', es: 'Estampados' },
  'Cristais': { en: 'Crystals', es: 'Cristales' },
  'Eletrostático': { en: 'Electrostatic', es: 'Electrostático' },
  'ELETROSTÁTICO': { en: 'ELECTROSTATIC', es: 'ELECTROSTÁTICO' },
  // catálogos (CATALOGS em data/site.ts)
  'Automotivo — Alltak Wraps': { en: 'Automotive — Alltak Wraps', es: 'Automotriz — Alltak Wraps' },
  'Arquitetura — Alltak Decor': { en: 'Architecture — Alltak Decor', es: 'Arquitectura — Alltak Decor' },
  'Comunicação Visual — Alltak Signs': { en: 'Visual Communication — Alltak Signs', es: 'Comunicación Visual — Alltak Signs' },
  'Catálogo Geral': { en: 'General Catalog', es: 'Catálogo General' },
  'Envelopamento e proteção veicular. Catálogo 2026.': {
    en: 'Vehicle wrapping and protection. 2026 catalog.',
    es: 'Rotulación y protección vehicular. Catálogo 2026.',
  },
  'Revestimentos para interiores e ambientes. Catálogo 2026.': {
    en: 'Coverings for interiors and spaces. 2026 catalog.',
    es: 'Revestimientos para interiores y ambientes. Catálogo 2026.',
  },
  'Sinalização, recortes e design. Catálogo 2026.': {
    en: 'Signage, cut graphics and design. 2026 catalog.',
    es: 'Señalización, recortes y diseño. Catálogo 2026.',
  },
  'Visão completa do portfólio Alltak.': {
    en: 'A complete view of the Alltak portfolio.',
    es: 'Visión completa del portafolio Alltak.',
  },
  'Materiais para comunicação visual impressa.': {
    en: 'Materials for printed visual communication.',
    es: 'Materiales para comunicación visual impresa.',
  },
  'Manutenção e cuidados pós-aplicação.': {
    en: 'Maintenance and post-application care.',
    es: 'Mantenimiento y cuidados posteriores a la aplicación.',
  },
  'Máscaras, laminações e soluções técnicas.': {
    en: 'Masks, laminations and technical solutions.',
    es: 'Máscaras, laminaciones y soluciones técnicas.',
  },
}
