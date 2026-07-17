import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ColorDetail from '../components/ColorDetail'
import { COLORS, LINES, familiesFor, type Color } from '../data/catalog'

export default function Cores() {
  const [line, setLine] = useState<string>('all')
  const [family, setFamily] = useState<string>('all')
  const [q, setQ] = useState('')
  const [active, setActive] = useState<Color | null>(null)

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
      <PageHeader eyebrow="Gama completa" title="Cores">
        {COLORS.length}+ cores das linhas Alltak Wraps e Decor, com foto do produto aplicado,
        acabamento e código. Clique em uma cor para ver os detalhes e baixar o boletim técnico.
      </PageHeader>

      <section className="bg-alltak-black py-12 md:py-16">
        <div className="container-x">
          {/* filtros */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1.5">
              {LINES.map((l) => (
                <button
                  key={l.key}
                  onClick={() => {
                    setLine(l.key)
                    setFamily('all')
                  }}
                  className={`font-display text-xs font-bold uppercase tracking-wide px-4 py-2 transition ${
                    line === l.key ? 'bg-alltak-blue text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
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
              className="ml-auto w-full max-w-xs border border-white/15 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-alltak-blue"
            />
          </div>

          {/* famílias */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <button
              onClick={() => setFamily('all')}
              className={`px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide transition ${
                family === 'all' ? 'bg-white text-alltak-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Todas as famílias
            </button>
            {families.map((f) => (
              <button
                key={f}
                onClick={() => setFamily(f)}
                className={`px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide transition ${
                  family === f ? 'bg-white text-alltak-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
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
              <button
                key={`${c.line}-${c.code}-${c.name}`}
                onClick={() => setActive(c)}
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
                  <div className="truncate font-display text-sm font-bold uppercase leading-tight text-white group-hover:text-alltak-blue">
                    {c.name}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-white/40">{c.code}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {active && <ColorDetail color={active} onClose={() => setActive(null)} />}
    </>
  )
}
