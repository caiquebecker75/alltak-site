// Technical detail per product line, shown when a line is clicked on /produtos.
// ⚠️ DADOS DE EXEMPLO — códigos, medidas e especificações ilustrativos, a
// substituir pela tabela oficial da Alltak.

export type LineColor = { name: string; hex: string; code: string; shift?: string }
export type LineDetail = {
  desc: string
  specs: { label: string; value: string }[]
  colors: LineColor[]
}

const SPECS_PADRAO = [
  { label: 'Largura', value: '1,38 m' },
  { label: 'Espessura', value: '110 μm' },
  { label: 'Adesivo', value: 'Acrílico reposicionável' },
  { label: 'Durabilidade', value: 'até 5 anos*' },
]
const SPECS_PPF = [
  { label: 'Largura', value: '1,52 m' },
  { label: 'Espessura', value: '200 μm (TPU)' },
  { label: 'Adesivo', value: 'Acrílico auto-regenerativo' },
  { label: 'Durabilidade', value: 'até 10 anos*' },
]
const SPECS_DECOR = [
  { label: 'Largura', value: '1,22 m' },
  { label: 'Espessura', value: '160 μm' },
  { label: 'Adesivo', value: 'Acrílico super permanente' },
  { label: 'Aplicação', value: 'Superfícies planas e curvas' },
]

export const LINE_DETAILS: Record<string, LineDetail> = {
  Ultra: {
    desc: 'Gloss de alto brilho com profundidade de cor e camada protetora.',
    specs: SPECS_PADRAO,
    colors: [
      { name: 'Preto Ultra', hex: '#0c0d10', code: 'ULT-001' },
      { name: 'Branco Ártico', hex: '#eef1f4', code: 'ULT-002' },
      { name: 'Vermelho Racing', hex: '#e30613', code: 'ULT-010' },
      { name: 'Azul Cobalto', hex: '#0a49c8', code: 'ULT-021' },
      { name: 'Azul Alltak', hex: '#0080ff', code: 'ULT-022' },
      { name: 'Laranja Solar', hex: '#f6541f', code: 'ULT-031' },
      { name: 'Amarelo Racing', hex: '#f7c400', code: 'ULT-040' },
      { name: 'Verde British', hex: '#0f5d3a', code: 'ULT-051' },
      { name: 'Roxo Imperial', hex: '#5b2a86', code: 'ULT-061' },
      { name: 'Cinza Grafite', hex: '#3a3f45', code: 'ULT-070' },
    ],
  },
  Satin: {
    desc: 'Acetinado sedoso, entre o fosco e o brilho.',
    specs: SPECS_PADRAO,
    colors: [
      { name: 'Preto Satin', hex: '#141519', code: 'SAT-001' },
      { name: 'Prata Satin', hex: '#b9bdc2', code: 'SAT-002' },
      { name: 'Champagne', hex: '#c8b58f', code: 'SAT-014' },
      { name: 'Azul Aço', hex: '#33475c', code: 'SAT-022' },
      { name: 'Vinho Satin', hex: '#5a1d29', code: 'SAT-031' },
      { name: 'Verde Petróleo', hex: '#1c4a4a', code: 'SAT-052' },
      { name: 'Grafite Satin', hex: '#43474d', code: 'SAT-070' },
    ],
  },
  Jateado: {
    desc: 'Matte texturizado, visual agressivo sem reflexo.',
    specs: SPECS_PADRAO,
    colors: [
      { name: 'Preto Fosco', hex: '#17181b', code: 'JAT-001' },
      { name: 'Cinza Chumbo', hex: '#4c4f54', code: 'JAT-005' },
      { name: 'Cinza Nardo', hex: '#6f7378', code: 'JAT-006' },
      { name: 'Branco Fosco', hex: '#dfe1e2', code: 'JAT-002' },
      { name: 'Verde Militar', hex: '#3d4632', code: 'JAT-053' },
      { name: 'Azul Meia-Noite', hex: '#1e2a3d', code: 'JAT-024' },
      { name: 'Vermelho Fosco', hex: '#8f1f21', code: 'JAT-011' },
      { name: 'Areia', hex: '#b3a184', code: 'JAT-015' },
    ],
  },
  FX: {
    desc: 'Camaleão color-flow: a cor muda conforme o ângulo.',
    specs: SPECS_PADRAO,
    colors: [
      { name: 'Roxo → Verde', hex: '#6a2d8f', shift: '#1f8f6a', code: 'FX-101' },
      { name: 'Azul → Roxo', hex: '#1f4fb0', shift: '#7a2a8f', code: 'FX-102' },
      { name: 'Verde → Dourado', hex: '#1f8f5a', shift: '#c9a23a', code: 'FX-103' },
      { name: 'Vermelho → Azul', hex: '#b0203a', shift: '#20408f', code: 'FX-104' },
      { name: 'Ciano → Rosa', hex: '#1fa3b0', shift: '#c93a86', code: 'FX-105' },
    ],
  },
  Carbon: {
    desc: 'Textura fibra de carbono 3D/4D com relevo real.',
    specs: SPECS_PADRAO,
    colors: [
      { name: 'Carbon Preto', hex: '#15171a', code: 'CAR-001' },
      { name: 'Carbon Grafite', hex: '#2b2f34', code: 'CAR-002' },
      { name: 'Carbon Antracite', hex: '#20242a', code: 'CAR-003' },
      { name: 'Carbon Azul', hex: '#182636', code: 'CAR-021' },
    ],
  },
  Klear: {
    desc: 'Efeito cromado espelhado de altíssimo impacto.',
    specs: SPECS_PADRAO,
    colors: [
      { name: 'Cromo Prata', hex: '#c6ccd2', code: 'KLR-001' },
      { name: 'Cromo Dourado', hex: '#caa64a', code: 'KLR-012' },
      { name: 'Cromo Rosé', hex: '#c98b86', code: 'KLR-014' },
      { name: 'Cromo Azul', hex: '#5f86b8', code: 'KLR-022' },
      { name: 'Cromo Grafite', hex: '#5a5f66', code: 'KLR-005' },
    ],
  },
  Krusher: {
    desc: 'Texturizado de impacto com acabamento fosco profundo.',
    specs: SPECS_PADRAO,
    colors: [
      { name: 'Krusher Preto', hex: '#101114', code: 'KRU-001' },
      { name: 'Krusher Grafite', hex: '#33373c', code: 'KRU-005' },
      { name: 'Krusher Verde', hex: '#2c3a2e', code: 'KRU-053' },
    ],
  },
  'Filme de Proteção de Pintura': {
    desc: 'PPF em TPU transparente com autorregeneração.',
    specs: SPECS_PPF,
    colors: [
      { name: 'Transparente Gloss', hex: '#e8ecef', code: 'PPF-001' },
      { name: 'Transparente Matte', hex: '#d7dbde', code: 'PPF-002' },
    ],
  },
  'Auto Wrap': {
    desc: 'Filme para impressão digital e envelopamento de frotas.',
    specs: SPECS_PADRAO,
    colors: [{ name: 'Branco Imprimível', hex: '#f4f6f8', code: 'AWR-001' }],
  },
  Laka: {
    desc: 'Acabamento laqueado para móveis e superfícies internas.',
    specs: SPECS_DECOR,
    colors: [
      { name: 'Branco Laka', hex: '#f2f3f1', code: 'LAK-001' },
      { name: 'Off White', hex: '#e9e6dd', code: 'LAK-002' },
      { name: 'Cinza Urbano', hex: '#8d9093', code: 'LAK-005' },
      { name: 'Preto Laka', hex: '#17181a', code: 'LAK-010' },
      { name: 'Azul Petróleo', hex: '#274a55', code: 'LAK-022' },
    ],
  },
  Wood: {
    desc: 'Padrões amadeirados realistas para ambientes.',
    specs: SPECS_DECOR,
    colors: [
      { name: 'Freijó Galicia', hex: '#a9784f', code: 'WOD-101' },
      { name: 'Freijó Asturias', hex: '#8a5f3c', code: 'WOD-102' },
      { name: 'Tenerife', hex: '#c49a6c', code: 'WOD-103' },
      { name: 'Nogueira', hex: '#5f4630', code: 'WOD-110' },
    ],
  },
  Kroma: {
    desc: 'Cores sólidas para composição de ambientes.',
    specs: SPECS_DECOR,
    colors: [
      { name: 'Olaria', hex: '#b06a4a', code: 'KRO-201' },
      { name: 'Verde Oliva', hex: '#6e7248', code: 'KRO-202' },
      { name: 'Petróleo', hex: '#2c4a52', code: 'KRO-203' },
      { name: 'Areia', hex: '#cfc3ad', code: 'KRO-204' },
    ],
  },
}
