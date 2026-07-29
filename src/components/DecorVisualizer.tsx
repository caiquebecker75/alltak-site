import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COLORS, type Color } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'

// Decor visualizer: pick an Alltak Decor pattern, click a surface (cabinet,
// wall, floor…) inside a 3D room scene and see the texture applied there.
// The rooms are built with one-point-perspective CSS surfaces so each item is
// individually clickable and re-texturable — kitchen, living room, bedroom.

type Surface = {
  id: string
  label: string
  clip: string
  base: string // fallback material color (no texture)
  shade: string // lighting overlay
  fixed?: boolean // decorative, not clickable/texturable
  start?: boolean // starts with the active pattern
}

const poly = (pts: [number, number][]) =>
  `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(', ')})`

// shared box shading
const SH = {
  back: 'linear-gradient(180deg, rgba(255,255,255,.14), rgba(0,0,0,.20))',
  floor: 'linear-gradient(0deg, rgba(0,0,0,.34), rgba(255,255,255,.06))',
  left: 'linear-gradient(90deg, rgba(0,0,0,.34), rgba(0,0,0,0))',
  right: 'linear-gradient(270deg, rgba(0,0,0,.34), rgba(0,0,0,0))',
  ceil: 'linear-gradient(180deg, rgba(0,0,0,.16), rgba(0,0,0,.05))',
  furn: 'linear-gradient(180deg, rgba(255,255,255,.20), rgba(0,0,0,.34))',
}

// one-point-perspective box (vanishing point ~ center)
const BOX: Surface[] = [
  { id: 'ceiling', label: 'Teto', clip: poly([[0, 0], [100, 0], [66, 26], [34, 26]]), base: '#e9e7e1', shade: SH.ceil, fixed: true },
  { id: 'leftWall', label: 'Parede esquerda', clip: poly([[0, 0], [34, 26], [34, 70], [0, 100]]), base: '#d5d2ca', shade: SH.left },
  { id: 'rightWall', label: 'Parede direita', clip: poly([[100, 0], [66, 26], [66, 70], [100, 100]]), base: '#d5d2ca', shade: SH.right },
  { id: 'floor', label: 'Piso', clip: poly([[0, 100], [34, 70], [66, 70], [100, 100]]), base: '#b7a892', shade: SH.floor },
  { id: 'backWall', label: 'Parede de fundo', clip: poly([[34, 26], [66, 26], [66, 70], [34, 70]]), base: '#e3e0d8', shade: SH.back },
]

const SCENES: Record<string, { label: string; surfaces: Surface[] }> = {
  cozinha: {
    label: 'Cozinha',
    surfaces: [
      ...BOX,
      { id: 'upperCab', label: 'Armário superior', clip: poly([[35, 30], [65, 30], [65, 40], [35, 40]]), base: '#eceae4', shade: SH.furn, start: true },
      { id: 'counter', label: 'Bancada', clip: poly([[34, 55], [66, 55], [66, 58], [34, 58]]), base: '#cfd2d4', shade: SH.furn, fixed: true },
      { id: 'lowerCab', label: 'Armário inferior', clip: poly([[35, 58], [65, 58], [65, 69], [35, 69]]), base: '#2a2e33', shade: SH.furn, start: true },
    ],
  },
  sala: {
    label: 'Sala',
    surfaces: [
      ...BOX,
      { id: 'tvPanel', label: 'Painel de TV', clip: poly([[42, 33], [58, 33], [58, 49], [42, 49]]), base: '#101317', shade: SH.furn, fixed: true },
      { id: 'sideboard', label: 'Rack / aparador', clip: poly([[36, 58], [64, 58], [64, 66], [36, 66]]), base: '#3a3f45', shade: SH.furn, start: true },
    ],
  },
  quarto: {
    label: 'Quarto',
    surfaces: [
      ...BOX,
      { id: 'wardrobe', label: 'Guarda-roupa', clip: poly([[56, 31], [65, 30], [65, 69], [56, 70]]), base: '#3a3f45', shade: SH.furn, start: true },
      { id: 'headboard', label: 'Cabeceira', clip: poly([[36, 42], [55, 42], [55, 66], [36, 66]]), base: '#4a4f57', shade: SH.furn, start: true },
      { id: 'bed', label: 'Cama', clip: poly([[28, 72], [72, 72], [82, 92], [18, 92]]), base: '#e7e3d9', shade: SH.furn, fixed: true },
    ],
  },
}

const ROOM_KEYS = ['cozinha', 'sala', 'quarto'] as const

export default function DecorVisualizer() {
  const { open } = useLeadGate()
  const patterns = useMemo(() => COLORS.filter((c) => c.line === 'decor'), [])
  const families = useMemo(() => [...new Set(patterns.map((p) => p.family))].sort(), [patterns])

  const [fam, setFam] = useState<string>('all')
  const [active, setActive] = useState<Color>(patterns[0])
  const [room, setRoom] = useState<(typeof ROOM_KEYS)[number]>('cozinha')

  // textures applied per surface id, and which surface is selected
  const [tex, setTex] = useState<Record<string, Color>>({})
  const [sel, setSel] = useState<string>('backWall')

  const scene = SCENES[room]
  const list = fam === 'all' ? patterns : patterns.filter((p) => p.family === fam)

  // apply the active pattern to the selected surface
  const applyToSelected = (color: Color) => {
    setActive(color)
    setTex((t) => ({ ...t, [sel]: color }))
  }

  // surface texture: explicit override, else the "start" surfaces show active
  const texFor = (s: Surface): Color | undefined => {
    if (tex[s.id]) return tex[s.id]
    if (s.start && !s.fixed) return active
    return undefined
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Stage */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {ROOM_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => {
                setRoom(k)
                setSel('backWall')
              }}
              className={`font-display text-xs font-bold uppercase tracking-wide px-4 py-2 transition ${
                room === k ? 'bg-alltak-blue text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {SCENES[k].label} 3D
            </button>
          ))}
          <span className="ml-auto hidden font-display text-xs font-bold uppercase tracking-[0.25em] text-white/40 md:inline">
            Clique numa superfície
          </span>
        </div>

        {/* 3D room */}
        <div
          className="relative w-full overflow-hidden border border-white/10 bg-alltak-coal"
          style={{ aspectRatio: '4 / 3' }}
        >
          {scene.surfaces.map((s) => {
            const t = texFor(s)
            const selected = !s.fixed && sel === s.id
            const bg = t
              ? { backgroundImage: `${s.shade}, url(${t.swatch})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { backgroundImage: s.shade, backgroundColor: s.base }
            return (
              <button
                key={s.id}
                type="button"
                disabled={s.fixed}
                onClick={() => setSel(s.id)}
                aria-label={s.label}
                title={s.fixed ? s.label : `Selecionar: ${s.label}`}
                className={`absolute inset-0 transition-[filter] duration-200 ${s.fixed ? 'cursor-default' : 'cursor-pointer'}`}
                style={{
                  clipPath: s.clip,
                  ...bg,
                  filter: selected ? 'brightness(1.12) drop-shadow(0 0 10px rgba(0,128,255,.9))' : undefined,
                }}
              />
            )
          })}

          {/* selected-surface hint */}
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
            <span className="tag">{scene.surfaces.find((s) => s.id === sel)?.label ?? 'Superfície'}</span>
          </div>
        </div>

        {/* selected surface + active pattern */}
        <div className="flex items-end justify-between border-t border-white/10 pt-3">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-alltak-blue">
              {active.family} · Alltak Decor
            </p>
            <p className="font-display text-2xl uppercase text-white">{active.name}</p>
            <p className="text-xs uppercase tracking-wide text-white/40">
              Código {active.code} · aplicando em{' '}
              <span className="text-white/70">{scene.surfaces.find((s) => s.id === sel)?.label}</span>
            </p>
          </div>
          <img src={active.swatch} alt={active.name} className="h-14 w-20 border border-white/20 object-cover" />
        </div>
      </div>

      {/* Pattern picker */}
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-2xl text-white">Padrões</h2>
        <p className="mt-1 text-sm text-white/50">
          Selecione uma superfície na cena e clique num padrão para aplicar.
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

        <div className="mt-4 grid max-h-[360px] grid-cols-3 gap-2 overflow-auto pr-1 sm:grid-cols-4">
          {list.map((p, i) => (
            <button
              key={`${p.code}-${i}`}
              onClick={() => applyToSelected(p)}
              title={`${p.name} · ${p.code}`}
              className={`aspect-square overflow-hidden border transition ${
                active.code === p.code ? 'border-alltak-blue ring-2 ring-alltak-blue' : 'border-white/15 hover:border-white/50'
              }`}
            >
              <img src={p.swatch} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-4">
          <button
            onClick={() => open({ title: `Boletim Técnico ${active.name} (${active.code})`, url: '#', kind: 'PDF' })}
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
