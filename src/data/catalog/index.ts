import wrapsRaw from './wraps.json'
import decorRaw from './decor.json'
import signsRaw from './signs.json'

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
}

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
    applied: c.applied ? `./colors/wraps/${c.applied}` : undefined,
  })),
  ...(decorRaw as any[]).map((c) => ({
    line: 'decor' as const,
    lineName: 'Alltak Decor',
    code: c.code,
    name: c.name,
    family: famFrom(c.name),
    hex: c.hex,
    swatch: `./colors/decor/${c.swatch}`,
    applied: c.applied ? `./colors/decor/${c.applied}` : undefined,
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
