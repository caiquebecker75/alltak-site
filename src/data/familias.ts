// Linhas de produto que têm cartela de cores: o botão da linha (página de
// Produtos) abre a página de Cores já filtrada na linha e na família.
// As demais (sem cartela) continuam abrindo a página da linha.
const FAMILIA_DA_LINHA: Record<string, [linha: string, familia: string]> = {
  // Decor
  kroma: ['decor', 'Kroma'],
  wood: ['decor', 'Wood'],
  tijolo: ['decor', 'Tijolo'],
  azulejo: ['decor', 'Decor'], // azulejos Porto e Lisboa
  pedras: ['decor', 'Mármore'],
  // Wraps
  carbon: ['wraps', 'Carbon'],
  fx: ['wraps', 'Fx'],
  jateado: ['wraps', 'Jateado'],
  krusher: ['wraps', 'Krusher'],
  satin: ['wraps', 'Satin'],
  ultra: ['wraps', 'Ultra'],
  // Signs
  premium: ['signs', 'Premium'],
  color: ['signs', 'Color'],
}

export function destinoDaLinha(l: { categoria: string; slug: string }): string {
  const f = FAMILIA_DA_LINHA[l.slug]
  return f ? `/cores?linha=${f[0]}&familia=${encodeURIComponent(f[1])}` : `/produtos/${l.categoria}/${l.slug}`
}

// caminho inverso: família selecionada em Cores → slug da linha (para mostrar
// a descrição, a ficha técnica e o boletim da linha junto da cartela)
export function linhaDaFamilia(linha: string, familia: string): string | undefined {
  return Object.entries(FAMILIA_DA_LINHA).find(([, [l, f]]) => l === linha && f === familia)?.[0]
}
