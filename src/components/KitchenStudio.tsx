import { lazy, Suspense, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COLORS, type Color } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'
import ErrBoundary from './ErrBoundary'
import { KITCHEN_GROUPS, type KitchenGroup } from './Kitchen3D'

// Interactive 3D kitchen studio: orbit/zoom the kitchen, click a surface
// (or pick it from the chips) and apply an Alltak Decor pattern to it.
const Kitchen3D = lazy(() => import('./Kitchen3D'))

export default function KitchenStudio() {
  const { open } = useLeadGate()
  const patterns = useMemo(() => COLORS.filter((c) => c.line === 'decor'), [])
  const families = useMemo(() => [...new Set(patterns.map((p) => p.family))].sort(), [patterns])
  const [fam, setFam] = useState('all')
  const [sel, setSel] = useState<KitchenGroup>('cima')
  const [tex, setTex] = useState<Partial<Record<KitchenGroup, Color>>>({})

  const list = fam === 'all' ? patterns : patterns.filter((p) => p.family === fam)
  const active = tex[sel]

  const textures = useMemo(() => {
    const t: Partial<Record<KitchenGroup, string>> = {}
    ;(Object.keys(tex) as KitchenGroup[]).forEach((k) => {
      const c = tex[k]
      if (c) t[k] = c.texture ?? c.swatch
    })
    return t
  }, [tex])

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {/* Stage */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {KITCHEN_GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => setSel(g.key)}
              className={`font-display text-xs font-bold uppercase tracking-wide px-3 py-2 transition ${
                sel === g.key ? 'bg-alltak-blue text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="relative h-[420px] overflow-hidden border border-white/10 bg-gradient-to-b from-alltak-ink to-black md:h-[520px]">
          <div className="pointer-events-none absolute inset-x-16 bottom-8 h-16 rounded-[50%] bg-alltak-blue/15 blur-2xl" aria-hidden />
          <ErrBoundary>
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-white/40 animate-pulse">
                    Carregando cozinha 3D…
                  </span>
                </div>
              }
            >
              <Kitchen3D textures={textures} selected={sel} onSelect={setSel} className="h-full w-full cursor-hot" />
            </Suspense>
          </ErrBoundary>
          <span className="pointer-events-none absolute left-3 top-3 tag">
            {KITCHEN_GROUPS.find((g) => g.key === sel)?.label}
          </span>
          <span className="pointer-events-none absolute bottom-3 right-3 hidden font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white/45 md:block">
            Arraste para girar · role para zoom · clique numa superfície
          </span>
        </div>
      </div>

      {/* Pattern picker */}
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-2xl text-white">Padrões Alltak Decor</h2>
        <p className="mt-1 text-sm text-white/50">
          Superfície: <span className="text-alltak-blue">{KITCHEN_GROUPS.find((g) => g.key === sel)?.label}</span>.
          Clique num padrão para aplicar.
        </p>
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

        <div className="mt-4 grid max-h-[300px] grid-cols-3 gap-2 overflow-auto pr-1 sm:grid-cols-4">
          {list.map((p, i) => (
            <button
              key={`${p.code}-${i}`}
              onClick={() => setTex((t) => ({ ...t, [sel]: p }))}
              title={`${p.name} · ${p.code}`}
              className={`aspect-square overflow-hidden border transition ${
                active?.code === p.code ? 'border-alltak-blue ring-2 ring-alltak-blue' : 'border-white/15 hover:border-white/50'
              }`}
            >
              <img src={p.texture ?? p.swatch} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        {active && (
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <div>
              <p className="font-display text-lg font-bold uppercase text-white">{active.name}</p>
              <p className="text-xs uppercase tracking-wide text-white/40">Código {active.code}</p>
            </div>
            <button
              onClick={() => setTex((t) => { const n = { ...t }; delete n[sel]; return n })}
              className="font-display text-[11px] font-bold uppercase tracking-wide text-white/50 hover:text-alltak-blue"
            >
              Remover
            </button>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-4">
          <button
            onClick={() => open({ title: `Boletim Técnico ${active?.name ?? 'Alltak Decor'}`, url: '#', kind: 'PDF' })}
            className="btn-trapezoid btn-blue justify-center"
          >
            Baixar boletim técnico ↓
          </button>
          <Link to="/cores" className="btn-trapezoid btn-outline justify-center">
            Ver todas as cores
          </Link>
        </div>
        <p className="mt-3 text-xs text-white/35">
          Prévia ilustrativa em 3D. As cores podem variar conforme a tela. Solicite amostra física.
        </p>
      </div>
    </div>
  )
}
