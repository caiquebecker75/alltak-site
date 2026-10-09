import fichas from './fichas.json'
import type { Lang } from '../../i18n'

// Descrição e ficha técnica transcritas dos catálogos digitais oficiais da
// Alltak (migracao/integrar_catalogos.py). Têm prioridade sobre o texto antigo
// do WordPress nas páginas de linha e aparecem na página de cada cor.

type Ficha = { descricao: string; specs: string[] }
type Entrada = Record<Lang, Ficha> & { fonte: string }
type Dados = { linhas: Record<string, Entrada>; cores: Record<string, Entrada>; avisos: Record<string, Record<Lang, string[]>> }

const D = fichas as unknown as Dados

const escolher = (e: Entrada | undefined, lang: Lang) =>
  e ? { ...(e[lang]?.specs.length || e[lang]?.descricao ? e[lang] : e.pt), fonte: e.fonte } : undefined

export const fichaDaLinha = (slug: string, lang: Lang) => escolher(D.linhas[slug], lang)
export const fichaDaCor = (linha: string, codigo: string, lang: Lang) => escolher(D.cores[`${linha}:${codigo}`], lang)
export const avisosDaLinha = (linha: string, lang: Lang): string[] => D.avisos[linha]?.[lang] ?? []
