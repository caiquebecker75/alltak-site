import type { Lang } from './index'

// Translation dictionary. Keys are dot-namespaced. Missing lang falls back to pt.
export const DICT: Record<string, Record<Lang, string>> = {
  // ---- nav ----
  'nav.visualizador': { pt: 'Visualizador', en: 'Visualizer', es: 'Visualizador' },
  'nav.decoracao': { pt: 'Decoração', en: 'Decor', es: 'Decoración' },
  'nav.cores': { pt: 'Cores', en: 'Colors', es: 'Colores' },
  'nav.catalogos': { pt: 'Catálogos', en: 'Catalogs', es: 'Catálogos' },
  'nav.produtos': { pt: 'Produtos', en: 'Products', es: 'Productos' },
  'nav.blog': { pt: 'Blog', en: 'Blog', es: 'Blog' },
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

  // ---- páginas de produto (listagem + linha) ----
  'prod.eyebrow': { pt: 'Portfólio completo', en: 'Full portfolio', es: 'Portafolio completo' },
  'prod.headerSub': {
    pt: 'Um portfólio completo para diferentes estilos e necessidades. Explore as linhas e clique em uma cor para ver a foto do produto aplicado, o vídeo de aplicação e baixar o boletim técnico.',
    en: 'A complete portfolio for different styles and needs. Explore the lines and click a color to see the applied product photo, the application video and download the technical bulletin.',
    es: 'Un portafolio completo para diferentes estilos y necesidades. Explora las líneas y haz clic en un color para ver la foto del producto aplicado, el video de aplicación y descargar el boletín técnico.',
  },
  'prod.explorarCores': { pt: 'Explorar cores →', en: 'Explore colors →', es: 'Explorar colores →' },
  'prod.comprarStore': { pt: 'Comprar na Alltak Store ↗', en: 'Buy at the Alltak Store ↗', es: 'Comprar en Alltak Store ↗' },
  'prod.todasCores': { pt: 'Todas as cores', en: 'All colors', es: 'Todos los colores' },
  'prod.todasCoresSub': {
    pt: 'Filtre por linha e família, busque por nome ou código e clique em qualquer cor para ver o produto aplicado, o vídeo e o boletim técnico.',
    en: 'Filter by line and family, search by name or code and click any color to see the applied product, the video and the technical bulletin.',
    es: 'Filtra por línea y familia, busca por nombre o código y haz clic en cualquier color para ver el producto aplicado, el video y el boletín técnico.',
  },
  'prod.coresDisponiveis': { pt: 'Cores disponíveis', en: 'Available colors', es: 'Colores disponibles' },
  'prod.opcoes': { pt: 'opções', en: 'options', es: 'opciones' },
  'prod.fichaLinha': { pt: 'Ficha da linha', en: 'Line datasheet', es: 'Ficha de la línea' },
  'prod.especificacoes': { pt: 'Especificações técnicas', en: 'Technical specifications', es: 'Especificaciones técnicas' },
  'prod.refBoletim': {
    pt: 'Dados de referência. Confirme sempre no boletim técnico oficial da linha.',
    en: "Reference data. Always confirm in the line's official technical bulletin.",
    es: 'Datos de referencia. Confirme siempre en el boletín técnico oficial de la línea.',
  },
  'prod.boletim': { pt: 'Boletim técnico', en: 'Technical bulletin', es: 'Boletín técnico' },
  'prod.checklist': { pt: 'Check-list de envelopamento', en: 'Wrapping checklist', es: 'Checklist de rotulación' },
  'prod.manualLimpeza': { pt: 'Manual de limpeza', en: 'Cleaning manual', es: 'Manual de limpieza' },
  'prod.materialApoio': { pt: 'Material de apoio', en: 'Support material', es: 'Material de apoyo' },
  'prod.outrasLinhas': { pt: 'Outras linhas', en: 'Other lines', es: 'Otras líneas' },
  'prod.naoEncontrada': { pt: 'Linha não encontrada', en: 'Line not found', es: 'Línea no encontrada' },
  'prod.naoExiste': { pt: 'Essa linha não existe', en: 'This line does not exist', es: 'Esta línea no existe' },

  // ---- página da cor ----
  'cor.ampliar': { pt: 'Ampliar ⤢', en: 'Zoom ⤢', es: 'Ampliar ⤢' },
  'cor.voltar': { pt: '← Voltar', en: '← Back', es: '← Volver' },
  'cor.bobina': { pt: 'Bobina / textura', en: 'Roll / texture', es: 'Bobina / textura' },
  'cor.corSolida': { pt: 'Cor sólida', en: 'Solid color', es: 'Color sólido' },
  'cor.aplicado': { pt: 'Aplicado', en: 'Applied', es: 'Aplicado' },
  'cor.informacoes': { pt: 'Informações da cor', en: 'Color information', es: 'Información del color' },
  'cor.nome': { pt: 'Nome', en: 'Name', es: 'Nombre' },
  'cor.codigo': { pt: 'Código', en: 'Code', es: 'Código' },
  'cor.linha': { pt: 'Linha', en: 'Line', es: 'Línea' },
  'cor.familia': { pt: 'Família', en: 'Family', es: 'Familia' },
  'cor.acabamento': { pt: 'Acabamento', en: 'Finish', es: 'Acabado' },
  'cor.baixarBoletim': { pt: 'Baixar boletim técnico ↓', en: 'Download technical bulletin ↓', es: 'Descargar boletín técnico ↓' },
  'cor.baixarImagemProduto': { pt: 'Baixar imagem do produto ↓', en: 'Download product image ↓', es: 'Descargar imagen del producto ↓' },
  'cor.verVisualizador': { pt: 'Ver no visualizador 3D', en: 'See it in the 3D visualizer', es: 'Ver en el visualizador 3D' },
  'cor.disclaimer': {
    pt: 'Imagem meramente ilustrativa. A cor pode variar conforme a tela, iluminação e superfície. Solicite uma amostra física e consulte um aplicador Alltak.',
    en: 'Image for illustration only. The color may vary depending on the screen, lighting and surface. Request a physical sample and consult an Alltak installer.',
    es: 'Imagen meramente ilustrativa. El color puede variar según la pantalla, la iluminación y la superficie. Solicite una muestra física y consulte a un instalador Alltak.',
  },
  'cor.mesmaFamilia': { pt: 'Da mesma família', en: 'Same family', es: 'De la misma familia' },
  'cor.relacionadas': { pt: 'Cores relacionadas', en: 'Related colors', es: 'Colores relacionados' },
  'cor.verTodas': { pt: 'Ver todas as cores', en: 'See all colors', es: 'Ver todos los colores' },
  'cor.artes': { pt: 'Arte p/ marketplace:', en: 'Marketplace artwork:', es: 'Arte para marketplace:' },
  'cor.naoEncontrada': { pt: 'Cor não encontrada', en: 'Color not found', es: 'Color no encontrado' },
  'cor.naoCatalogo': { pt: 'Essa cor não está no catálogo', en: 'This color is not in the catalog', es: 'Este color no está en el catálogo' },

  // ---- explorador de cores ----
  'exp.todasFamilias': { pt: 'Todas as famílias', en: 'All families', es: 'Todas las familias' },
  'exp.buscar': { pt: 'Buscar cor ou código…', en: 'Search color or code…', es: 'Buscar color o código…' },
  'exp.cores': { pt: 'cores', en: 'colors', es: 'colores' },
  'cores.eyebrow': { pt: 'Gama completa', en: 'Full range', es: 'Gama completa' },
  'cores.headerSub': {
    pt: 'cores das linhas Alltak Wraps, Decor e Signs, com foto do produto aplicado, acabamento e código. Clique em uma cor para ver os detalhes, o vídeo de aplicação e baixar o boletim técnico.',
    en: 'colors across the Alltak Wraps, Decor and Signs lines, with applied product photo, finish and code. Click a color to see the details, the application video and download the technical bulletin.',
    es: 'colores de las líneas Alltak Wraps, Decor y Signs, con foto del producto aplicado, acabado y código. Haz clic en un color para ver los detalles, el video de aplicación y descargar el boletín técnico.',
  },

  // ---- comum ----
  'comum.baixarImagem': { pt: 'Baixar imagem ↓', en: 'Download image ↓', es: 'Descargar imagen ↓' },
  'comum.fechar': { pt: 'Fechar ✕', en: 'Close ✕', es: 'Cerrar ✕' },
}

// Valores de dados (acabamentos, famílias, categorias, rótulos) traduzidos.
// Chave é o valor PT como está nos dados; ausência = mantém o original.
export const VALUES: Record<string, Record<Exclude<Lang, 'pt'>, string>> = {
  Todas: { en: 'All', es: 'Todas' },
  // categorias de produto
  Automotivo: { en: 'Automotive', es: 'Automotriz' },
  Arquitetura: { en: 'Architecture', es: 'Arquitectura' },
  Impressão: { en: 'Printing', es: 'Impresión' },
  'Sign & Design': { en: 'Sign & Design', es: 'Sign & Design' },
  'Wrap Care': { en: 'Wrap Care', es: 'Wrap Care' },
  Acessórios: { en: 'Accessories', es: 'Accesorios' },
  'Aplicações Técnicas': { en: 'Technical Applications', es: 'Aplicaciones Técnicas' },
  // acabamentos (linha Wraps)
  'Acetinado Fosco': { en: 'Satin Matte', es: 'Satinado Mate' },
  'Acetinado Metálico': { en: 'Satin Metallic', es: 'Satinado Metálico' },
  Brilhante: { en: 'Gloss', es: 'Brillante' },
  'Brilhante Flake': { en: 'Gloss Flake', es: 'Brillante Flake' },
  'Flake Brilhante': { en: 'Gloss Flake', es: 'Brillante Flake' },
  'Camaleão Brilhante': { en: 'Gloss Chameleon', es: 'Camaleón Brillante' },
  'Texturizado Fosco': { en: 'Textured Matte', es: 'Texturizado Mate' },
  // famílias Decor (derivadas do nome)
  Concreto: { en: 'Concrete', es: 'Concreto' },
  Mármore: { en: 'Marble', es: 'Mármol' },
  Tijolo: { en: 'Brick', es: 'Ladrillo' },
  Metrô: { en: 'Subway', es: 'Metro' },
  Jardim: { en: 'Garden', es: 'Jardín' },
  Detalhe: { en: 'Detail', es: 'Detalle' },
  Madeira: { en: 'Wood', es: 'Madera' },
}
