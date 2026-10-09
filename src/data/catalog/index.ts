import wrapsRaw from './wraps.json'
import decorRaw from './decor.json'
import signsRaw from './signs.json'
import imagens from './imagens.json'

// Real color data extracted from the official Alltak 2026 online catalogs
// (name, code, finish/pantone, sampled hex, swatch + applied photo).

export type Color = {
  line: 'wraps' | 'decor' | 'signs'
  lineName: string
  code: string
  name: string
  family: string
  finish?: string
  pantone?: string
  hex: string
  swatch: string
  applied?: string
  texture?: string // flat material crop (seamless-ish) for 3D re-skinning
  texture3d?: string // versão que repete sem emenda (migracao/texturas_sem_emenda.py)
}

// Dimensões reais de cada foto (geradas por migracao/limpar_imagens_cores.py).
// Recortes quebrados do catálogo (tiras finas, texto) vêm marcados ok=false.
type InfoImg = { w: number; h: number; ok: boolean }
const INFO = imagens as Record<string, InfoImg>
const chaveImg = (src: string) => src.replace(/^\.\/colors\//, '')
export const infoImagem = (src?: string): InfoImg | undefined => (src ? INFO[chaveImg(src)] : undefined)
const boa = (src?: string) => (src && infoImagem(src)?.ok !== false ? src : undefined)

const famFrom = (name: string) => name.split(' ')[0]
const JUNK = /(ILUSTRATIV|REPRESENTAD|VARIAR|DISPOSITIVO|MERAMENTE|ACORDO|PROTE[ÇC][ÃA]O|CAT[ÁA]LOGO|DIMENS|PROPRIEDAD|VERS[ÃA]O)/i
const isClean = (name: string) => !!name && name.length <= 40 && !JUNK.test(name)

const raw: Color[] = [
  ...(wrapsRaw as any[]).map((c) => ({
    line: 'wraps' as const,
    lineName: 'Alltak Wraps',
    code: c.code,
    name: c.name,
    family: c.family || famFrom(c.name),
    finish: c.acabamento || undefined,
    hex: c.hex,
    swatch: `./colors/wraps/${c.swatch}`,
    applied: c.applied ? boa(`./colors/wraps/${c.applied}`) : undefined,
  })),
  ...(decorRaw as any[]).map((c) => ({
    line: 'decor' as const,
    lineName: 'Alltak Decor',
    code: c.code,
    name: c.name,
    family: famFrom(c.name),
    hex: c.hex,
    swatch: boa(`./colors/decor/${c.swatch}`) ?? `./textures/decor/${c.code}.jpg`,
    applied: c.applied ? boa(`./colors/decor/${c.applied}`) : undefined,
    texture: `./textures/decor/${c.code}.jpg`,
    texture3d: `./textures/decor-3d/${c.code}.jpg`,
  })),
  ...(signsRaw as any[]).map((c) => ({
    line: 'signs' as const,
    lineName: 'Alltak Signs',
    code: c.code,
    name: c.name,
    family: c.serie || 'Signs',
    finish: c.serie || undefined,
    pantone: c.pantone || undefined,
    hex: c.hex,
    swatch: `./colors/signs/${c.applied}`, // signs: the product roll shows the color
    applied: c.applied ? `./colors/signs/${c.applied}` : undefined,
  })),
]

export const COLORS: Color[] = raw.filter((c) => isClean(c.name))

export const LINES = [
  { key: 'all', label: 'Todas' },
  { key: 'wraps', label: 'Wraps' },
  { key: 'decor', label: 'Decor' },
  { key: 'signs', label: 'Signs' },
] as const

export function familiesFor(line: string): string[] {
  const set = new Set<string>()
  COLORS.filter((c) => line === 'all' || c.line === line).forEach((c) => set.add(c.family))
  return [...set].sort()
}

// Stable URL slug + lookup for a color's dedicated page (/cor/:line/:code).
// O catálogo repete alguns códigos para padrões diferentes (977D37 Verona e
// Salamanca, 18S36 Satin Orange e Red...). Nesses casos o endereço leva também
// o nome (/cor/decor/977D37~wood-rustica-salamanca); nos demais, só o código.
const slugNome = (n: string) =>
  n.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const repetido = (c: Color) => COLORS.filter((o) => o.line === c.line && o.code === c.code).length > 1

export const colorSlug = (c: Color) =>
  `/cor/${c.line}/${encodeURIComponent(c.code)}${repetido(c) ? `~${slugNome(c.name)}` : ''}`

export function findColor(line?: string, code?: string): Color | undefined {
  if (!line || !code) return undefined
  const [cod, nome] = decodeURIComponent(code).split('~')
  const doCodigo = COLORS.filter((c) => c.line === line && c.code === cod)
  return (nome && doCodigo.find((c) => slugNome(c.name) === nome)) || doCodigo[0]
}

export function relatedColors(c: Color, n = 6): Color[] {
  return COLORS.filter((o) => o.line === c.line && o.family === c.family && o.code !== c.code).slice(0, n)
}
