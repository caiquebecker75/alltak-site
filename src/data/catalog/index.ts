import wrapsRaw from './wraps.json'
import decorRaw from './decor.json'

// Real color data extracted from the official Alltak 2026 online catalogs
// (name, code, finish, sampled hex, swatch + applied photo).

export type Color = {
  line: 'wraps' | 'decor'
  lineName: string
  code: string
  name: string
  family: string
  finish?: string
  hex: string
  swatch: string
  applied?: string
}

const famFrom = (name: string) => name.split(' ')[0]

// drop entries whose name captured disclaimer/spec noise from the PDF
const JUNK = /(ILUSTRATIV|REPRESENTAD|VARIAR|DISPOSITIVO|PROTE[ÇC][ÃA]O|CAT[ÁA]LOGO|DIMENS|PROPRIEDAD|VERS[ÃA]O)/i
const isClean = (name: string) => !!name && name.length <= 46 && !JUNK.test(name)

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
]

export const COLORS: Color[] = raw.filter((c) => isClean(c.name))

export const LINES = [
  { key: 'all', label: 'Todas' },
  { key: 'wraps', label: 'Wraps' },
  { key: 'decor', label: 'Decor' },
] as const

export function familiesFor(line: string): string[] {
  const set = new Set<string>()
  COLORS.filter((c) => line === 'all' || c.line === line).forEach((c) => set.add(c.family))
  return [...set].sort()
}
