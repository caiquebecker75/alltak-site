import type { Lang } from './index'

// Textos da área "home" (PT, EN, ES). Ligado ao dicionário principal em dict.ts.
// Também cobre os componentes globais (cabeçalho, rodapé, WhatsApp, formulário
// de download) e as unidades de negócio de data/site.ts.
export const DICT_HOME: Record<string, Record<Lang, string>> = {
  // ---- home: faixa de frentes (marquee) ----
  'home.marquee.envelopamento': { pt: 'Envelopamento', en: 'Wrapping', es: 'Rotulación' },
  'home.marquee.decoracao': { pt: 'Decoração', en: 'Decor', es: 'Decoración' },
  'home.marquee.comunicacao': { pt: 'Comunicação Visual', en: 'Visual Communication', es: 'Comunicación Visual' },

  // ---- home: sobre (diferenciais e foto) ----
  'home.sobre.d1': { pt: 'Produção nacional', en: 'Made in Brazil', es: 'Producción nacional' },
  'home.sobre.d2': { pt: 'Linhas completas', en: 'Complete lines', es: 'Líneas completas' },
  'home.sobre.d3': { pt: 'Acabamento constante', en: 'Consistent finish', es: 'Acabado constante' },
  'home.sobre.d4': { pt: 'Suporte técnico', en: 'Technical support', es: 'Soporte técnico' },
  'home.sobre.imgAlt': { pt: 'Produção nacional Alltak', en: 'Alltak, made in Brazil', es: 'Producción nacional Alltak' },

  // ---- unidades de negócio (StickyUnits / BusinessUnit) ----
  'units.tag': { pt: 'Unidade de negócio', en: 'Business unit', es: 'Unidad de negocio' },
  'units.tagCap': { pt: 'Unidade de Negócio', en: 'Business Unit', es: 'Unidad de Negocio' },
  'units.verProdutos': { pt: 'Ver os produtos', en: 'View products', es: 'Ver los productos' },
  'units.anterior': { pt: 'Unidade anterior', en: 'Previous unit', es: 'Unidad anterior' },
  'units.proxima': { pt: 'Próxima unidade', en: 'Next unit', es: 'Siguiente unidad' },
  // {name} = Wraps / Decor / Signs
  'units.imgAlt': { pt: 'Aplicação Alltak {name}', en: 'Alltak {name} application', es: 'Aplicación Alltak {name}' },
  'units.wraps.tagline': {
    pt: 'Envelopamento & Customização Veicular',
    en: 'Vehicle Wrapping & Customization',
    es: 'Rotulación & Personalización Vehicular',
  },
  'units.wraps.desc': {
    pt: 'Materiais para envelopamento e customização veicular, feitos para quem exige acabamento e constância no dia a dia. Um portfólio completo para diferentes estilos e necessidades, com foco em aplicação eficiente e resultado final impecável.',
    en: 'Materials for vehicle wrapping and customization, made for those who demand a great finish and consistency every day. A complete portfolio for different styles and needs, focused on efficient application and a flawless final result.',
    es: 'Materiales para rotulación y personalización vehicular, hechos para quienes exigen acabado y constancia en el día a día. Un portafolio completo para diferentes estilos y necesidades, con foco en una aplicación eficiente y un resultado final impecable.',
  },
  'units.decor.tagline': { pt: 'Revestimentos & Ambientes', en: 'Surfaces & Interiors', es: 'Revestimientos & Ambientes' },
  'units.decor.desc': {
    pt: 'Revestimentos vinílicos autoadesivos com diversas famílias, padrões e acabamentos para projetos de interiores. Ideal para renovar superfícies e compor ambientes com praticidade, mantendo um visual realista e um padrão de acabamento consistente do começo ao fim.',
    en: 'Self-adhesive vinyl coverings in a wide range of families, patterns and finishes for interior design projects. Ideal for renewing surfaces and styling spaces with ease, keeping a realistic look and a consistent standard of finish from beginning to end.',
    es: 'Revestimientos vinílicos autoadhesivos con diversas familias, patrones y acabados para proyectos de interiores. Ideales para renovar superficies y componer ambientes con practicidad, manteniendo un aspecto realista y un estándar de acabado consistente de principio a fin.',
  },
  'units.signs.tagline': {
    pt: 'Sinalização & Comunicação Visual',
    en: 'Signage & Visual Communication',
    es: 'Señalización & Comunicación Visual',
  },
  'units.signs.desc': {
    pt: 'Película de PVC monomérico adesiva de altíssima qualidade, produzida com adesivo acrílico permanente, de corte preciso e fácil aplicação. Indicada para sinalização, propaganda, design, decoração e identificação de frotas, onde se exige precisão, durabilidade, estabilidade e resistência.',
    en: 'Top-quality self-adhesive monomeric PVC film, made with a permanent acrylic adhesive, for precise cutting and easy application. Recommended for signage, advertising, design, decoration and fleet graphics, where precision, durability, stability and resistance are required.',
    es: 'Película de PVC monomérico adhesiva de altísima calidad, producida con adhesivo acrílico permanente, de corte preciso y fácil aplicación. Indicada para señalización, publicidad, diseño, decoración e identificación de flotas, donde se exige precisión, durabilidad, estabilidad y resistencia.',
  },

  // ---- linhas de produto (HScroll) ----
  'hscroll.tag': { pt: 'Portfólio', en: 'Portfolio', es: 'Portafolio' },
  'hscroll.titulo': { pt: 'Linhas de produto', en: 'Product lines', es: 'Líneas de producto' },
  'hscroll.role': { pt: 'role para navegar', en: 'scroll to browse', es: 'desliza para navegar' },
  'hscroll.produtos': { pt: 'produtos', en: 'products', es: 'productos' },
  // singular: categoria com 1 produto (antes saía "1 produtos")
  'hscroll.produto': { pt: 'produto', en: 'product', es: 'producto' },
  'hscroll.ver': { pt: 'Ver →', en: 'View →', es: 'Ver →' },
  'hscroll.verTudo': { pt: 'Ver tudo', en: 'See all', es: 'Ver todo' },

  // ---- família de submarcas (BrandFamily) ----
  'brand.tag': { pt: 'Um só padrão', en: 'One standard', es: 'Un solo estándar' },
  'brand.titulo': { pt: 'A família Alltak', en: 'The Alltak family', es: 'La familia Alltak' },

  // ---- banner principal antigo (Hero) ----
  'hero.tagIdentidade': { pt: 'Nova identidade · Alltak', en: 'New identity · Alltak', es: 'Nueva identidad · Alltak' },
  'hero.slide.wraps': { pt: 'Alltak Wraps · Linha IWC', en: 'Alltak Wraps · IWC Line', es: 'Alltak Wraps · Línea IWC' },
  'hero.slide.decor': { pt: 'Alltak Decor · Revestimentos', en: 'Alltak Decor · Surfaces', es: 'Alltak Decor · Revestimientos' },

  // ---- carrossel de campanhas (BannerRoll): acessibilidade ----
  'banner.anterior': { pt: 'Banner anterior', en: 'Previous banner', es: 'Banner anterior' },
  'banner.proximo': { pt: 'Próximo banner', en: 'Next banner', es: 'Siguiente banner' },
  'banner.revestfacil.alt': {
    pt: 'Alltak RevestFácil · Revestimento vinílico adesivo',
    en: 'Alltak RevestFácil · Self-adhesive vinyl covering',
    es: 'Alltak RevestFácil · Revestimiento vinílico adhesivo',
  },

  // ---- carro em SVG ----
  'car.aria': { pt: 'Prévia do veículo envelopado', en: 'Wrapped vehicle preview', es: 'Vista previa del vehículo rotulado' },

  // ---- cabeçalho ----
  'header.inicio': { pt: 'Alltak início', en: 'Alltak home', es: 'Alltak inicio' },
  'header.menu': { pt: 'Menu', en: 'Menu', es: 'Menú' },
  'header.frentes': {
    pt: 'Envelopamento · Decoração · Comunicação Visual',
    en: 'Vehicle Wrapping · Decor · Visual Communication',
    es: 'Rotulación · Decoración · Comunicación Visual',
  },

  // ---- rodapé ----
  'footer.instaladores': { pt: 'Instaladores', en: 'Installers', es: 'Instaladores' },
  'footer.cursos': { pt: 'Cursos', en: 'Courses', es: 'Cursos' },
  'footer.privacidade': { pt: 'Política de Privacidade', en: 'Privacy Policy', es: 'Política de Privacidad' },
  'footer.transparencia': { pt: 'Transparência Salarial', en: 'Pay Transparency', es: 'Transparencia Salarial' },
  'footer.credito': {
    pt: 'Site institucional · reconstrução 75 LAB',
    en: 'Corporate website · rebuilt by 75 LAB',
    es: 'Sitio institucional · reconstrucción 75 LAB',
  },

  // ---- WhatsApp ----
  'wa.aria': { pt: 'Falar no WhatsApp', en: 'Chat on WhatsApp', es: 'Hablar por WhatsApp' },
  'wa.mensagem': {
    pt: 'Olá! Vim pelo site da Alltak e gostaria de mais informações.',
    en: 'Hi! I found you through the Alltak website and would like more information.',
    es: '¡Hola! Llegué por el sitio web de Alltak y me gustaría recibir más información.',
  },

  // ---- formulário de download (LeadGate) ----
  'lead.tag': { pt: 'Download', en: 'Download', es: 'Descarga' },
  'lead.pronto': { pt: 'Tudo pronto!', en: 'All set!', es: '¡Todo listo!' },
  'lead.liberado': {
    pt: 'Seu material está liberado. Obrigado pelo cadastro.',
    en: 'Your material is ready. Thank you for signing up.',
    es: 'Tu material está disponible. Gracias por registrarte.',
  },
  'lead.baixar': { pt: 'Baixar agora', en: 'Download now', es: 'Descargar ahora' },
  'lead.intro': {
    pt: 'Preencha para liberar o download. Entraremos em contato com novidades e suporte.',
    en: 'Fill in the form to unlock the download. We will get in touch with news and support.',
    es: 'Completa el formulario para liberar la descarga. Te contactaremos con novedades y soporte.',
  },
  'lead.nome': { pt: 'Nome', en: 'Name', es: 'Nombre' },
  'lead.empresa': { pt: 'Empresa', en: 'Company', es: 'Empresa' },
  'lead.email': { pt: 'E-mail', en: 'Email', es: 'Correo electrónico' },
  'lead.whatsapp': { pt: 'WhatsApp', en: 'WhatsApp', es: 'WhatsApp' },
  'lead.cidade': { pt: 'Cidade', en: 'City', es: 'Ciudad' },
  'lead.liberar': { pt: 'Liberar download', en: 'Unlock download', es: 'Liberar descarga' },
  'lead.cancelar': { pt: 'Cancelar', en: 'Cancel', es: 'Cancelar' },
}

// Valores de dados traduzidos com tv() (mesma regra de VALUES em dict.ts).
// As categorias de PRODUCT_CATEGORIES já estão em VALUES (dict.ts).
export const VALUES_HOME: Record<string, Record<Exclude<Lang, 'pt'>, string>> = {}
