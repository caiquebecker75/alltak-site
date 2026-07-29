import { lazy, Suspense, useMemo, useState } from 'react'
import { COLORS, type Color } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'

// Real 3D furniture re-skin studio: pick an Alltak Decor pattern and watch it
// applied to a downloaded CC0 cabinet model (Poly Haven) in real time.
const Furniture3D = lazy(() => import('./Furniture3D'))

export default function FurnitureStudio() {
  const { open } = useLeadGate()
  const patterns = useMemo(() => COLORS.filter((c) => c.line === 'decor'), [])
  const families = useMemo(() => [...new Set(patterns.map((p) => p.family))].sort(), [patterns])
  const [fam, setFam] = useState('all')
  const [active, setActive] = useState<Color>(patterns[0])

  const list = fam === 'all' ? patterns : patterns.filter((p) => p.family === fam)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* 3D stage */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag">Armário · modelo 3D real</span>
          <span className="ml-auto hidden font-display text-xs font-bold uppercase tracking-[0.25em] text-white/40 md:inline">
            Arraste para girar
          </span>
        </div>
        <div className="relative overflow-hidden border border-white/10 bg-gradient-to-b from-alltak-ink to-black" style={{ aspectRatio: '4 / 3' }}>
          <div className="pointer-events-none absolute inset-x-10 bottom-6 h-16 rounded-[50%] bg-alltak-blue/20 blur-2xl" aria-hidden />
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-white/40 animate-pulse">
                  Carregando modelo 3D…
                </span>
              </div>
            }
          >
            <Furniture3D textureUrl={active.swatch} className="h-full w-full cursor-hot" />
          </Suspense>
        </div>
        <div className="flex items-end justify-between border-t border-white/10 pt-3">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-alltak-blue">
              {active.family} · Alltak Decor
            </p>
            <p className="font-display text-2xl uppercase text-white">{active.name}</p>
            <p className="text-xs uppercase tracking-wide text-white/40">Código {active.code}</p>
          </div>
          <img src={active.swatch} alt={active.name} className="h-14 w-20 border border-white/20 object-cover" />
        </div>
      </div>

      {/* Pattern picker */}
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-2xl text-white">Padrões</h2>
        <p className="mt-1 text-sm text-white/50">Clique num padrão para vestir o móvel.</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            onClick={() => setFam('all')}
            className={`px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide transition ${
              fam === 'all' ? 'bg-white text-alltak-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Todos
          </button>
          {families.map((f) => (
            <button
              key={f}
              onClick={() => setFam(f)}
              className={`px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide transition ${
                fam === f ? 'bg-white text-alltak-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-4 grid max-h-[360px] grid-cols-3 gap-2 overflow-auto pr-1 sm:grid-cols-4">
          {list.map((p, i) => (
            <button
              key={`${p.code}-${i}`}
              onClick={() => setActive(p)}
              title={`${p.name} · ${p.code}`}
              className={`aspect-square overflow-hidden border transition ${
                active.code === p.code ? 'border-alltak-blue ring-2 ring-alltak-blue' : 'border-white/15 hover:border-white/50'
              }`}
            >
              <img src={p.swatch} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-5 border-t border-white/10 pt-4">
          <button
            onClick={() => open({ title: `Boletim Técnico ${active.name} (${active.code})`, url: '#', kind: 'PDF' })}
            className="btn-trapezoid btn-blue w-full justify-center"
          >
            Baixar boletim técnico ↓
          </button>
        </div>
        <p className="mt-3 text-xs text-white/35">
          Modelo 3D “Drawer Cabinet” (Poly Haven, CC0). Prévia ilustrativa; solicite amostra física.
        </p>
      </div>
    </div>
  )
}
