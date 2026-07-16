// Central content model for the Alltak institutional site.
// Structure follows "Alltak _ Organização Site" (Drive) and the
// "AJUSTES SITE" refino briefing.
import subWraps from '../brand/sub-wraps.png'
import subDecor from '../brand/sub-decor.png'
import subSigns from '../brand/sub-signs.png'

export const STORE_URL = 'https://loja.alltak.com.br'
export const YOUTUBE_URL = 'https://www.youtube.com/user/alltakAdesivos'
export const INSTAGRAM_URL = 'https://www.instagram.com/alltakadesivos'

export type NavItem = {
  label: string
  to: string
  external?: boolean
}

export const NAV: NavItem[] = [
  { label: 'Visualizador', to: '/visualizador' },
  { label: 'Cores', to: '/cores' },
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
  /** official submarca lockup (from AF-ALLTAK-SUBMARCAS) */
  logo: string
  /** render the lockup white (for dark-on-dark cases like Wraps on black) */
  logoInvert?: boolean
  /** submarca identity color (from the brand final files) */
  color: string
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
    accent: 'text-alltak-blue',
    skull: true,
    logo: subWraps,
    logoInvert: true, // black lockup on black section → white
    color: '#0080ff',
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
    logo: subDecor,
    color: '#b49a5e', // dourado da submarca Decor
  },
  {
    key: 'signs',
    name: 'Signs',
    tagline: 'Sinalização & Comunicação Visual',
    description:
      'Película de PVC monomérico adesiva de altíssima qualidade, produzida com adesivo acrílico permanente, de corte preciso e fácil aplicação. Indicada para sinalização, propaganda, design, decoração e identificação de frotas, onde se exige precisão, durabilidade, estabilidade e resistência.',
    image: './assets/sign_01.avif',
    bg: 'bg-alltak-navy2',
    accent: 'text-alltak-blue',
    logo: subSigns,
    color: '#f4711f', // laranja da submarca Signs
  },
]

export type Catalog = { name: string; desc: string; file?: string }

export const CATALOGS: Catalog[] = [
  { name: 'Automotivo — Alltak Wraps', desc: 'Envelopamento e proteção veicular. Catálogo 2026.', file: './catalogos/catalogo-wraps-2026.pdf' },
  { name: 'Arquitetura — Alltak Decor', desc: 'Revestimentos para interiores e ambientes. Catálogo 2026.', file: './catalogos/catalogo-decor-2026.pdf' },
  { name: 'Comunicação Visual — Alltak Signs', desc: 'Sinalização, recortes e design. Catálogo 2026.', file: './catalogos/catalogo-signs-2026.pdf' },
  { name: 'Catálogo Geral', desc: 'Visão completa do portfólio Alltak.' },
  { name: 'Impressão', desc: 'Materiais para comunicação visual impressa.' },
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
