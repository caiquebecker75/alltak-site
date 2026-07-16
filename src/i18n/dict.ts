import type { Lang } from './index'

// Translation dictionary. Keys are dot-namespaced. Missing lang falls back to pt.
export const DICT: Record<string, Record<Lang, string>> = {
  // ---- nav ----
  'nav.visualizador': { pt: 'Visualizador', en: 'Visualizer', es: 'Visualizador' },
  'nav.decoracao': { pt: 'Decoração', en: 'Decor', es: 'Decoración' },
  'nav.cores': { pt: 'Cores', en: 'Colors', es: 'Colores' },
  'nav.catalogos': { pt: 'Catálogos', en: 'Catalogs', es: 'Catálogos' },
  'nav.produtos': { pt: 'Produtos', en: 'Products', es: 'Productos' },
  'nav.store': { pt: 'Alltak Store', en: 'Alltak Store', es: 'Alltak Store' },
  'nav.onde': { pt: 'Onde Comprar', en: 'Where to Buy', es: 'Dónde Comprar' },
  'nav.sobre': { pt: 'Sobre Nós', en: 'About', es: 'Sobre Nosotros' },
  'nav.contato': { pt: 'Contato', en: 'Contact', es: 'Contacto' },

  // ---- hero ----
  'hero.sub': {
    pt: 'Para qualquer superfície. Envelopamento, decoração e comunicação visual.',
    en: 'For every surface. Vehicle wrapping, decor and visual communication.',
    es: 'Para cualquier superficie. Rotulación, decoración y comunicación visual.',
  },
  'hero.cta': { pt: 'Visualizar envelopamento', en: 'Open the visualizer', es: 'Ver rotulación' },
  'hero.scroll': { pt: 'role', en: 'scroll', es: 'desliza' },

  // ---- common CTAs / words ----
  'cta.verProdutos': { pt: 'Ver produtos', en: 'View products', es: 'Ver productos' },
  'cta.verMais': { pt: 'Ver mais produtos', en: 'See more products', es: 'Ver más productos' },
  'cta.ondeComprar': { pt: 'Onde comprar', en: 'Where to buy', es: 'Dónde comprar' },
  'cta.baixarCatalogo': { pt: 'Baixar catálogo', en: 'Download catalog', es: 'Descargar catálogo' },
  'cta.explorarCores': { pt: 'Explorar todas as cores', en: 'Explore all colors', es: 'Explorar todos los colores' },
  'cta.abrirVisualizador': { pt: 'Abrir o visualizador', en: 'Open the visualizer', es: 'Abrir el visualizador' },
  'cta.assistirYoutube': { pt: 'Assistir no YouTube', en: 'Watch on YouTube', es: 'Ver en YouTube' },
  'cta.falarConosco': { pt: 'Fale conosco', en: 'Talk to us', es: 'Habla con nosotros' },

  // ---- home sections ----
  'home.tagUnidades': { pt: 'Três frentes, um só padrão', en: 'Three fronts, one standard', es: 'Tres frentes, un solo estándar' },
  'home.unidades': { pt: 'Unidades de negócio', en: 'Business units', es: 'Unidades de negocio' },
  'home.unidadesSub': {
    pt: 'Wraps, Decor e Signs: linhas dedicadas para envelopamento veicular, revestimento de ambientes e comunicação visual.',
    en: 'Wraps, Decor and Signs: dedicated lines for vehicle wrapping, interior surfaces and visual communication.',
    es: 'Wraps, Decor y Signs: líneas dedicadas para rotulación vehicular, revestimiento de ambientes y comunicación visual.',
  },
  'home.manifesto': {
    pt: 'Não é só adesivo. É atitude aplicada em cada superfície.',
    en: 'Not just vinyl. Attitude applied to every surface.',
    es: 'No es solo vinilo. Es actitud aplicada en cada superficie.',
  },
  'home.stat.anos': { pt: 'anos de estrada', en: 'years on the road', es: 'años de trayectoria' },
  'home.stat.cores': { pt: 'cores e padrões', en: 'colors and patterns', es: 'colores y patrones' },
  'home.stat.unidades': { pt: 'unidades de negócio', en: 'business units', es: 'unidades de negocio' },
  'home.stat.nacional': { pt: 'produção nacional', en: 'made in Brazil', es: 'producción nacional' },
  'home.veja': { pt: 'Veja na prática', en: 'See it in action', es: 'Míralo en acción' },
  'home.aplicacoes': { pt: 'Aplicações reais, resultado impecável', en: 'Real applications, flawless results', es: 'Aplicaciones reales, resultado impecable' },
  'home.aplicacoesSub': {
    pt: 'Inspiração e prova visual do que é possível com os materiais Alltak.',
    en: 'Inspiration and visual proof of what is possible with Alltak materials.',
    es: 'Inspiración y prueba visual de lo que es posible con los materiales Alltak.',
  },
  'home.pinteTag': { pt: 'Ferramenta exclusiva', en: 'Exclusive tool', es: 'Herramienta exclusiva' },
  'home.pinte1': { pt: 'Pinte o carro', en: 'Paint your car', es: 'Pinta el coche' },
  'home.pinte2': { pt: 'sem tinta', en: 'without paint', es: 'sin pintura' },
  'home.pinteSub': {
    pt: '7 acabamentos, dezenas de cores, 3 silhuetas. Escolha, combine e veja o resultado na hora, antes de aplicar o primeiro metro de vinil.',
    en: '7 finishes, dozens of colors, 3 silhouettes. Choose, combine and see the result instantly, before applying the first meter of vinyl.',
    es: '7 acabados, decenas de colores, 3 siluetas. Elige, combina y ve el resultado al instante, antes de aplicar el primer metro de vinilo.',
  },
  'home.sobreTag': { pt: 'Sobre nós', en: 'About us', es: 'Sobre nosotros' },
  'home.sobreTitulo1': { pt: 'Produção nacional,', en: 'Made in Brazil,', es: 'Producción nacional,' },
  'home.sobreTitulo2': { pt: 'padrão de verdade', en: 'true standard', es: 'estándar de verdad' },
  'home.sobreTexto': {
    pt: 'A Alltak desenvolve e produz materiais adesivos para envelopamento, decoração e comunicação visual. Estrutura própria, produção nacional e linhas completas, pensadas para quem vive de aplicação e precisa manter o padrão do começo ao fim.',
    en: 'Alltak develops and manufactures adhesive materials for vehicle wrapping, decor and visual communication. In-house structure, local production and complete lines, made for those who live on application and need to keep the standard from start to finish.',
    es: 'Alltak desarrolla y produce materiales adhesivos para rotulación, decoración y comunicación visual. Estructura propia, producción nacional y líneas completas, pensadas para quien vive de la aplicación y necesita mantener el estándar de principio a fin.',
  },
  'home.pronto': { pt: 'Pronto para transformar?', en: 'Ready to transform?', es: '¿Listo para transformar?' },

  // ---- footer ----
  'footer.tagline': {
    pt: 'Materiais para envelopamento, decoração e comunicação visual. Padrão e constância do começo ao fim, para quem vive de aplicação.',
    en: 'Materials for vehicle wrapping, decor and visual communication. Standard and consistency from start to finish, for those who live on application.',
    es: 'Materiales para rotulación, decoración y comunicación visual. Estándar y constancia de principio a fin, para quien vive de la aplicación.',
  },
  'footer.navegacao': { pt: 'Navegação', en: 'Navigation', es: 'Navegación' },
  'footer.mais': { pt: 'Mais', en: 'More', es: 'Más' },
  'footer.rights': { pt: 'Todos os direitos reservados.', en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
}
