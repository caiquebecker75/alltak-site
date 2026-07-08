// Central content model for the Alltak institutional site.
// Structure follows "Alltak _ Organização Site" (Drive) and the
// "AJUSTES SITE" refino briefing.

export const STORE_URL = 'https://loja.alltak.com.br'
export const YOUTUBE_URL = 'https://www.youtube.com/user/alltakAdesivos'
export const INSTAGRAM_URL = 'https://www.instagram.com/alltakadesivos'

export type NavItem = {
  label: string
  to: string
  external?: boolean
}

export const NAV: NavItem[] = [
  { label: 'Catálogos', to: '/catalogos' },
  { label: 'Produtos', to: '/produtos' },
  { label: 'Alltak Store', to: STORE_URL, external: true },
  { label: 'Onde Comprar', to: '/onde-comprar' },
  { label: 'Sobre Nós', to: '/#sobre' },
  { label: 'Contato', to: '/contato' },
]

export type Unit = {
  key: 'wraps' | 'decor' | 'signs'
  name: string
  tagline: string
  description: string
  image: string
  bg: string // tailwind bg class
  accent: string // tailwind text class
  skull?: boolean
}

// Business units — WRAPS (preto), DECOR (azul escuro), SIGNS (azul escuro)
export const UNITS: Unit[] = [
  {
    key: 'wraps',
    name: 'Wraps',
    tagline: 'Envelopamento & Customização Veicular',
    description:
      'Materiais para envelopamento e customização veicular, feitos para quem exige acabamento e constância no dia a dia. Um portfólio completo para diferentes estilos e necessidades, com foco em aplicação eficiente e resultado final impecável.',
    image: './assets/automotivo_01.avif',
    bg: 'bg-alltak-black',
    accent: 'text-alltak-red',
    skull: true,
  },
  {
    key: 'decor',
    name: 'Decor',
    tagline: 'Revestimentos & Ambientes',
    description:
      'Revestimentos vinílicos autoadesivos com diversas famílias, padrões e acabamentos para projetos de interiores. Ideal para renovar superfícies e compor ambientes com praticidade, mantendo um visual realista e um padrão de acabamento consistente do começo ao fim.',
    image: './assets/decor_01.avif',
    bg: 'bg-alltak-navy',
    accent: 'text-alltak-blue',
  },
  {
    key: 'signs',
    name: 'Signs',
    tagline: 'Sinalização & Comunicação Visual',
    description:
      'Película de PVC monomérico adesiva de altíssima qualidade, produzida com adesivo acrílico permanente, de corte preciso e fácil aplicação. Indicada para sinalização, propaganda, design, decoração e identificação de frotas — onde se exige precisão, durabilidade, estabilidade e resistência.',
    image: './assets/sign_01.avif',
    bg: 'bg-alltak-navy2',
    accent: 'text-alltak-blue',
  },
]

export type Catalog = { name: string; desc: string }

export const CATALOGS: Catalog[] = [
  { name: 'Catálogo Geral', desc: 'Visão completa do portfólio Alltak.' },
  { name: 'Automotivo', desc: 'Linhas de envelopamento e proteção veicular.' },
  { name: 'Arquitetura', desc: 'Revestimentos para interiores e ambientes.' },
  { name: 'Impressão', desc: 'Materiais para comunicação visual impressa.' },
  { name: 'Sign & Design', desc: 'Recortes, sinalização e design.' },
  { name: 'Wrap Care', desc: 'Manutenção e cuidados pós-aplicação.' },
  { name: 'Aplicações Técnicas', desc: 'Máscaras, laminações e soluções técnicas.' },
]

export type ProductCategory = { name: string; slug: string; items: string[] }

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    name: 'Automotivo',
    slug: 'automotivo',
    items: ['Collab Arlon', 'Filme de Proteção de Pintura', 'Ultra', 'Satin', 'Jateado', 'FX', 'Carbon', 'Krusher', 'Klear', 'Auto Wrap'],
  },
  {
    name: 'Arquitetura',
    slug: 'arquitetura',
    items: ['Laka', 'Piso Decor', 'Pedras', 'Wood', 'Azulejo', 'Tijolo', 'Kroma', 'Estampados', 'Básicas', 'Cristais'],
  },
  { name: 'Impressão', slug: 'impressao', items: ['Print Flex', 'Eletrostático', 'Auto Wrap'] },
  { name: 'Sign & Design', slug: 'sign-design', items: ['Premium', 'Color'] },
  { name: 'Aplicações Técnicas', slug: 'aplicacoes-tecnicas', items: ['Máscara de Transferência', 'Dupla Face', 'Pisos', 'Laminações'] },
  { name: 'Wrap Care', slug: 'wrap-care', items: ['Protetik', 'Kleaner', 'Adesive Killer'] },
  { name: 'Acessórios', slug: 'acessorios', items: ["MOLDN'HOLD"] },
]

export const HIGHLIGHTS = [
  { title: 'Catálogos', desc: 'Materiais de apoio organizados por linha.', to: '/catalogos' },
  { title: 'Alltak Store', desc: 'Loja online oficial para aplicadores.', to: STORE_URL, external: true },
  { title: 'Onde Comprar', desc: 'Encontre distribuidores perto de você.', to: '/onde-comprar' },
  { title: 'Instaladores', desc: 'Aplicadores parceiros por região.', to: '/instaladores' },
  { title: 'Cursos', desc: 'Academia de Envelopamento e treinamentos.', to: '/cursos' },
]
