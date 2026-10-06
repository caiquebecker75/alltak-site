import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COLORS, LINES, familiesFor, colorSlug } from '../data/catalog'

// Full color explorer: line + family filters, search and a complete grid.
// Each swatch links to that color's dedicated page (/cor/:line/:code).
// `initialLine` pre-selects a catalog line (e.g. 'wraps') when embedded.
export default function ColorExplorer({ initialLine = 'all' }: { initialLine?: string }) {
  const [line, setLine] = useState<string>(initialLine)
  const [family, setFamily] = useState<string>('all')
  const [q, setQ] = useState('')

  const families = useMemo(() => familiesFor(line), [line])
  const list = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return COLORS.filter(
      (c) =>
        (line === 'all' || c.line === line) &&
        (family === 'all' || c.family === family) &&
        (!qq || c.name.toLowerCase().includes(qq) || c.code.toLowerCase().includes(qq)),
    )
  }, [line, family, q])

  return (
    <>
      {/* filtros de linha: grandes e em destaque */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {LINES.map((l) => (
            <button
              key={l.key}
              onClick={() => {
                setLine(l.key)
                setFamily('all')
              }}
              className={`font-display text-base md:text-lg font-black uppercase tracking-wide px-6 py-3 transition clip-tz ${
                line === l.key
                  ? 'bg-alltak-blue text-white shadow-[0_6px_24px_rgba(0,128,255,0.35)]'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar cor ou código…"
          className="ml-auto w-full max-w-xs border border-white/20 bg-white/5 px-4 py-2.5 text-base text-white outline-none placeholder:text-white/45 focus:border-alltak-blue"
        />
      </div>

      {/* famílias */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFamily('all')}
          className={`px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-wide transition ${
            family === 'all' ? 'bg-white text-alltak-black' : 'bg-white/5 text-white/75 hover:bg-white/15'
          }`}
        >
          Todas as famílias
        </button>
        {families.map((f) => (
          <button
            key={f}
            onClick={() => setFamily(f)}
            className={`px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-wide transition ${
              family === f ? 'bg-white text-alltak-black' : 'bg-white/5 text-white/75 hover:bg-white/15'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mb-6 mt-4 text-sm text-white/40">{list.length} cores</div>

      {/* grade de cores */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {list.map((c) => (
          <Link
            key={`${c.line}-${c.code}-${c.name}`}
            to={colorSlug(c)}
            className="group text-left"
          >
            <div className="relative aspect-square overflow-hidden bg-alltak-coal">
              <img
                src={c.swatch}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className="absolute bottom-2 right-2 h-4 w-6 border border-white/40 clip-tz"
                style={{ background: c.hex }}
                aria-hidden
              />
            </div>
            <div className="mt-1.5">
              <div className="truncate font-display text-base font-bold uppercase leading-tight text-white group-hover:text-alltak-blue">
                {c.name}
              </div>
              <div className="text-xs uppercase tracking-wide text-white/55">{c.code}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
