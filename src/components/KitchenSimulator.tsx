import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COLORS, type Color } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'

// Photo-based kitchen simulator (à la placasdobrasil): a real kitchen photo
// with clickable surfaces. Selecting a surface + an Alltak Decor pattern paints
// that region with the material, using `mix-blend-mode: multiply` so it keeps
// the photo's own lighting and shadows — reads as a real re-covered surface.

const BASE = './simulador/cozinha.jpg'

type Surface = { key: string; label: string; clips: string[]; tile: string }

// Polygons traced over the photo (percent coords), refined visually so edges
// follow the real furniture: cabinet seams, tile boundary (with notches that
// spare the faucet and the tray), counter line and the oven tower.
const SURFACES: Surface[] = [
  {
    key: 'cima',
    label: 'Armários de cima',
    clips: ['polygon(5.8% 0%, 70% 0%, 70.3% 41.8%, 35% 40.4%, 5.8% 39.7%)'],
    tile: '26%',
  },
  {
    key: 'backsplash',
    label: 'Revestimento',
    clips: [
      'polygon(5.8% 39.7%, 35% 40.4%, 66% 42%, 65.5% 68.8%, 50% 67.6%, 30% 66.4%, 29.5% 64.2%, 16.8% 64%, 16.8% 57.5%, 5.8% 57.2%)',
    ],
    tile: '14%',
  },
  {
    key: 'baixo',
    label: 'Armários de baixo',
    clips: [
      'polygon(40% 77.8%, 66.5% 71.6%, 66.5% 100%, 55.2% 100%)',
      'polygon(66.5% 71.6%, 73.5% 70.6%, 73.8% 74.4%, 98.5% 70.2%, 98.5% 100%, 66.5% 100%)',
    ],
    tile: '26%',
  },
]

export default function KitchenSimulator() {
  const { open } = useLeadGate()
  const patterns = useMemo(() => COLORS.filter((c) => c.line === 'decor'), [])
  const families = useMemo(() => [...new Set(patterns.map((p) => p.family))].sort(), [patterns])
  const [fam, setFam] = useState('all')
  const [sel, setSel] = useState<string>('cima')
  const [tex, setTex] = useState<Record<string, Color>>({})

  const list = fam === 'all' ? patterns : patterns.filter((p) => p.family === fam)
  const active = tex[sel]

  const apply = (c: Color) => setTex((t) => ({ ...t, [sel]: c }))
  const texUrl = (c: Color) => c.texture ?? c.swatch

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {/* Stage */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {SURFACES.map((s) => (
            <button
              key={s.key}
              onClick={() => setSel(s.key)}
              className={`font-display text-xs font-bold uppercase tracking-wide px-3.5 py-2 transition ${
                sel === s.key ? 'bg-alltak-blue text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {s.label}
            </button>
          ))}
          <span className="ml-auto hidden font-display text-xs font-bold uppercase tracking-[0.25em] text-white/40 md:inline">
            Clique numa superfície
          </span>
        </div>

        <div className="relative overflow-hidden border border-white/10">
          <img src={BASE} alt="Cozinha" className="block w-full select-none" draggable={false} />

          {/* applied textures (multiply keeps the photo's lighting) */}
          {SURFACES.map((s) => {
            const c = tex[s.key]
            if (!c) return null
            return s.clips.map((clip, i) => (
              <div
                key={`${s.key}-${i}`}
                className="pointer-events-none absolute inset-0"
                style={{
                  clipPath: clip,
                  backgroundImage: `url(${texUrl(c)})`,
                  backgroundSize: s.tile,
                  backgroundRepeat: 'repeat',
                  mixBlendMode: 'multiply',
                }}
              />
            ))
          })}

          {/* clickable hit areas + selection/hover highlight */}
          {SURFACES.map((s) =>
            s.clips.map((clip, i) => (
              <button
                key={`hit-${s.key}-${i}`}
                onClick={() => setSel(s.key)}
                aria-label={s.label}
                className="absolute inset-0 cursor-pointer"
                style={{
                  clipPath: clip,
                  background: sel === s.key ? 'rgba(0,128,255,0.14)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (sel !== s.key) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    sel === s.key ? 'rgba(0,128,255,0.14)' : 'transparent'
                }}
              />
            )),
          )}

          {/* selected surface chip */}
          <span className="pointer-events-none absolute left-3 top-3 tag">
            {SURFACES.find((s) => s.key === sel)?.label}
          </span>
        </div>

        <p className="text-xs text-white/40">
          Prévia ilustrativa. Foto de referência; as cores podem variar conforme a tela. Solicite amostra física.
        </p>
      </div>

      {/* Pattern picker */}
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-2xl text-white">Padrões Alltak Decor</h2>
        <p className="mt-1 text-sm text-white/50">
          Superfície: <span className="text-alltak-blue">{SURFACES.find((s) => s.key === sel)?.label}</span>.
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
              onClick={() => apply(p)}
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
      </div>
    </div>
  )
}
