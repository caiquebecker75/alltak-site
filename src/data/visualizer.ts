// Data model for the Alltak Wrap Visualizer.
// Finishes map to Alltak automotive lines; each carries a palette of films.

export type FinishKey =
  | 'brilho'
  | 'fosco'
  | 'acetinado'
  | 'metalico'
  | 'carbono'
  | 'cromado'
  | 'camaleao'

export type Film = {
  name: string
  color: string
  // second color used by chameleon (color-flow) films
  shift?: string
}

export type Finish = {
  key: FinishKey
  label: string
  line: string // Alltak line name
  hint: string
  films: Film[]
}

export const FINISHES: Finish[] = [
  {
    key: 'brilho',
    label: 'Brilho',
    line: 'Linha Ultra',
    hint: 'Acabamento gloss, cor viva e reflexo intenso.',
    films: [
      { name: 'Preto Ultra', color: '#0c0d10' },
      { name: 'Branco Ártico', color: '#eef1f4' },
      { name: 'Vermelho Alltak', color: '#e30613' },
      { name: 'Azul Cobalto', color: '#0a49c8' },
      { name: 'Azul Alltak', color: '#0080ff' },
      { name: 'Laranja Solar', color: '#f6541f' },
      { name: 'Amarelo Racing', color: '#f7c400' },
      { name: 'Verde British', color: '#0f5d3a' },
      { name: 'Roxo Imperial', color: '#5b2a86' },
      { name: 'Cinza Grafite', color: '#3a3f45' },
    ],
  },
  {
    key: 'fosco',
    label: 'Fosco',
    line: 'Linha Jateado',
    hint: 'Superfície matte, sem reflexo, visual agressivo.',
    films: [
      { name: 'Preto Fosco', color: '#17181b' },
      { name: 'Cinza Chumbo', color: '#4c4f54' },
      { name: 'Cinza Nardo', color: '#6f7378' },
      { name: 'Branco Fosco', color: '#dfe1e2' },
      { name: 'Verde Militar', color: '#3d4632' },
      { name: 'Azul Meia-Noite', color: '#1e2a3d' },
      { name: 'Vermelho Fosco', color: '#8f1f21' },
      { name: 'Areia', color: '#b3a184' },
    ],
  },
  {
    key: 'acetinado',
    label: 'Acetinado',
    line: 'Linha Satin',
    hint: 'Brilho suave e sedoso, entre o fosco e o gloss.',
    films: [
      { name: 'Preto Satin', color: '#141519' },
      { name: 'Prata Satin', color: '#b9bdc2' },
      { name: 'Champagne', color: '#c8b58f' },
      { name: 'Azul Aço', color: '#33475c' },
      { name: 'Vinho Satin', color: '#5a1d29' },
      { name: 'Verde Petróleo', color: '#1c4a4a' },
      { name: 'Grafite Satin', color: '#43474d' },
    ],
  },
  {
    key: 'metalico',
    label: 'Metálico',
    line: 'Linha Kroma',
    hint: 'Pigmento metálico com flake e profundidade.',
    films: [
      { name: 'Prata Metálico', color: '#9aa0a6' },
      { name: 'Cinza Titânio', color: '#5b6066' },
      { name: 'Azul Metálico', color: '#1c56b0' },
      { name: 'Vermelho Metálico', color: '#a51322' },
      { name: 'Verde Esmeralda', color: '#0e6b4f' },
      { name: 'Bronze', color: '#7a5a2e' },
      { name: 'Roxo Metálico', color: '#4a2a7a' },
    ],
  },
  {
    key: 'carbono',
    label: 'Carbono',
    line: 'Linha Carbon',
    hint: 'Textura fibra de carbono 3D/4D.',
    films: [
      { name: 'Carbon Preto', color: '#15171a' },
      { name: 'Carbon Grafite', color: '#2b2f34' },
      { name: 'Carbon Antracite', color: '#20242a' },
      { name: 'Carbon Azul', color: '#182636' },
    ],
  },
  {
    key: 'cromado',
    label: 'Cromado',
    line: 'Linha Klear',
    hint: 'Efeito espelhado, reflexo cromado.',
    films: [
      { name: 'Cromo Prata', color: '#c6ccd2' },
      { name: 'Cromo Dourado', color: '#caa64a' },
      { name: 'Cromo Rosé', color: '#c98b86' },
      { name: 'Cromo Azul', color: '#5f86b8' },
      { name: 'Cromo Grafite', color: '#5a5f66' },
    ],
  },
  {
    key: 'camaleao',
    label: 'Camaleão',
    line: 'Linha FX',
    hint: 'Cor que muda conforme o ângulo (color flow).',
    films: [
      { name: 'Roxo → Verde', color: '#6a2d8f', shift: '#1f8f6a' },
      { name: 'Azul → Roxo', color: '#1f4fb0', shift: '#7a2a8f' },
      { name: 'Verde → Dourado', color: '#1f8f5a', shift: '#c9a23a' },
      { name: 'Vermelho → Azul', color: '#b0203a', shift: '#20408f' },
      { name: 'Ciano → Rosa', color: '#1fa3b0', shift: '#c93a86' },
    ],
  },
]

export type CarModel = { key: string; label: string }
export const CAR_MODELS: CarModel[] = [
  { key: 'coupe', label: 'Esportivo' },
  { key: 'sedan', label: 'Sedan' },
  { key: 'suv', label: 'SUV' },
]
