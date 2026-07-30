import { lazy, Suspense, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COLORS, type Color } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'
import ErrBoundary from './ErrBoundary'
import { ROOMS, type RoomKey } from './Room3D'

// Interactive 3D ambience studio: kitchen / living room / bedroom tabs.
// Orbit/zoom the scene, click a surface (or pick it from the chips) and
// apply an Alltak Decor pattern to it — each surface independent.
const Room3D = lazy(() => import('./Room3D'))

const ROOM_KEYS = Object.keys(ROOMS) as RoomKey[]

export default function AmbienteStudio() {
  const { open } = useLeadGate()
  const patterns = useMemo(() => COLORS.filter((c) => c.line === 'decor'), [])
  const families = useMemo(() => [...new Set(patterns.map((p) => p.family))].sort(), [patterns])
  const [fam, setFam] = useState('all')
  const [room, setRoom] = useState<RoomKey>('cozinha')
  const [sel, setSel] = useState<Record<RoomKey, string>>({
    cozinha: 'cima',
    sala: 'painel',
    quarto: 'cabeceira',
  })
  const [tex, setTex] = useState<Record<RoomKey, Record<string, Color>>>({
    cozinha: {},
    sala: {},
    quarto: {},
  })

  const groups = ROOMS[room].groups
  const selKey = sel[room]
  const active: Color | undefined = tex[room][selKey]
  const list = fam === 'all' ? patterns : patterns.filter((p) => p.family === fam)

  const textures = useMemo(() => {
    const t: Partial<Record<string, string>> = {}
    Object.entries(tex[room]).forEach(([k, c]) => {
      t[k] = c.texture ?? c.swatch
    })
    return t
  }, [tex, room])

  const applyPattern = (p: Color) =>
    setTex((t) => ({ ...t, [room]: { ...t[room], [selKey]: p } }))

  const removePattern = () =>
    setTex((t) => {
      const n = { ...t[room] }
      delete n[selKey]
      return { ...t, [room]: n }
    })

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {/* Stage */}
      <div className="flex flex-col gap-3">
        {/* room tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {ROOM_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setRoom(k)}
              className={`font-display text-xs font-bold uppercase tracking-wide px-4 py-2 transition ${
                room === k ? 'bg-alltak-blue text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {ROOMS[k].label} 3D
            </button>
          ))}
          <span className="ml-auto hidden font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 md:inline">
            Arraste para girar · role para zoom
          </span>
        </div>

        {/* surface chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {groups.map((g) => (
            <button
              key={g.key}
              onClick={() => setSel((s) => ({ ...s, [room]: g.key }))}
              className={`px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wide transition ${
                selKey === g.key ? 'bg-white text-alltak-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
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
                    Carregando ambiente 3D…
                  </span>
                </div>
              }
            >
              <Room3D
                key={room}
                room={room}
                textures={textures}
                selected={selKey}
                onSelect={(g) => setSel((s) => ({ ...s, [room]: g }))}
                className="h-full w-full cursor-hot"
              />
            </Suspense>
          </ErrBoundary>
          <span className="pointer-events-none absolute left-3 top-3 tag">
            {groups.find((g) => g.key === selKey)?.label}
          </span>
          <span className="pointer-events-none absolute bottom-3 right-3 hidden font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white/45 md:block">
            Clique numa superfície da cena
          </span>
        </div>
      </div>

      {/* Pattern picker */}
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-2xl text-white">Padrões Alltak Decor</h2>
        <p className="mt-1 text-sm text-white/50">
          {ROOMS[room].label} · superfície:{' '}
          <span className="text-alltak-blue">{groups.find((g) => g.key === selKey)?.label}</span>.
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
              onClick={() => applyPattern(p)}
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
              onClick={removePattern}
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
