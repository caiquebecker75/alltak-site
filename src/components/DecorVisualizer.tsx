import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COLORS, type Color } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'

// Decor visualizer: pick an Alltak Decor pattern and see it applied to a
// surface in 3 room scenes (kitchen / living / bedroom). The pattern image is
// masked onto the wall via SVG clipPaths + shading for a 3D-ish sense of depth.

type RoomProps = { pattern: Color; id: string }

function Kitchen({ pattern, id }: RoomProps) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <defs>
        <clipPath id={`k-wall-${id}`}>
          <path d="M0 0 H400 V150 H0 Z" />
        </clipPath>
        <linearGradient id={`k-sh-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      {/* backsplash wall = the pattern */}
      <g clipPath={`url(#k-wall-${id})`}>
        <image href={pattern.swatch} x="0" y="0" width="400" height="150" preserveAspectRatio="xMidYMid slice" />
        <rect x="0" y="0" width="400" height="150" fill={`url(#k-sh-${id})`} />
      </g>
      {/* upper cabinets */}
      <rect x="0" y="0" width="400" height="34" fill="#e9e7e1" />
      <rect x="18" y="6" width="150" height="24" fill="#f4f2ec" stroke="#d7d4cb" />
      <rect x="232" y="6" width="150" height="24" fill="#f4f2ec" stroke="#d7d4cb" />
      {/* counter + lower cabinets */}
      <rect x="0" y="150" width="400" height="16" fill="#cfd2d4" />
      <rect x="0" y="166" width="400" height="134" fill="#1b1e22" />
      <rect x="20" y="184" width="110" height="100" fill="#24282d" stroke="#0e1012" />
      <rect x="150" y="184" width="100" height="100" fill="#24282d" stroke="#0e1012" />
      <rect x="270" y="184" width="110" height="100" fill="#24282d" stroke="#0e1012" />
      {/* faucet + sink */}
      <rect x="180" y="150" width="52" height="10" fill="#0e1012" />
      <path d="M206 150 v-26 q0-10 12-10 h6" stroke="#101316" strokeWidth="4" fill="none" />
      {/* kettle */}
      <ellipse cx="330" cy="145" rx="16" ry="12" fill="#3a3f45" />
    </svg>
  )
}

function Living({ pattern, id }: RoomProps) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <defs>
        <clipPath id={`l-wall-${id}`}><path d="M60 0 H400 V210 H60 Z" /></clipPath>
        <linearGradient id={`l-sh-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      {/* side wall */}
      <rect x="0" y="0" width="60" height="300" fill="#d9d6cf" />
      {/* feature wall = pattern */}
      <g clipPath={`url(#l-wall-${id})`}>
        <image href={pattern.swatch} x="60" y="0" width="340" height="210" preserveAspectRatio="xMidYMid slice" />
        <rect x="60" y="0" width="340" height="210" fill={`url(#l-sh-${id})`} />
      </g>
      {/* floor */}
      <rect x="0" y="210" width="400" height="90" fill="#b7a892" />
      {/* TV panel */}
      <rect x="150" y="40" width="160" height="92" rx="3" fill="#0c0d10" stroke="#000" />
      <rect x="150" y="40" width="160" height="92" rx="3" fill="#12161c" />
      {/* console */}
      <rect x="120" y="150" width="220" height="26" fill="#2a2e33" />
      {/* sofa */}
      <rect x="30" y="214" width="150" height="52" rx="8" fill="#3b4048" />
      <rect x="30" y="200" width="150" height="26" rx="8" fill="#454b54" />
      {/* plant */}
      <rect x="352" y="176" width="20" height="40" fill="#2b2f34" />
      <path d="M362 176 q-22-30 4-52 q26 22 -4 52 z" fill="#3c6b3a" />
    </svg>
  )
}

function Bedroom({ pattern, id }: RoomProps) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <defs>
        <clipPath id={`b-wall-${id}`}><path d="M0 0 H400 V180 H0 Z" /></clipPath>
        <linearGradient id={`b-sh-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.24" />
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* headboard wall = pattern */}
      <g clipPath={`url(#b-wall-${id})`}>
        <image href={pattern.swatch} x="0" y="0" width="400" height="180" preserveAspectRatio="xMidYMid slice" />
        <rect x="0" y="0" width="400" height="180" fill={`url(#b-sh-${id})`} />
      </g>
      {/* floor */}
      <rect x="0" y="180" width="400" height="120" fill="#cabfa8" />
      {/* bed */}
      <rect x="70" y="150" width="260" height="30" rx="4" fill="#5b6169" />
      <rect x="60" y="176" width="280" height="88" rx="6" fill="#e7e3d9" />
      <rect x="60" y="222" width="280" height="42" rx="6" fill="#cfcabd" />
      {/* pillows */}
      <rect x="86" y="164" width="70" height="34" rx="8" fill="#f4f1e9" />
      <rect x="166" y="164" width="70" height="34" rx="8" fill="#f4f1e9" />
      {/* pendant lamps */}
      <line x1="60" y1="0" x2="60" y2="70" stroke="#101316" strokeWidth="2" />
      <circle cx="60" cy="76" r="9" fill="#2a2e33" />
      <line x1="340" y1="0" x2="340" y2="70" stroke="#101316" strokeWidth="2" />
      <circle cx="340" cy="76" r="9" fill="#2a2e33" />
      {/* nightstands */}
      <rect x="20" y="196" width="34" height="60" fill="#2a2e33" />
      <rect x="346" y="196" width="34" height="60" fill="#2a2e33" />
    </svg>
  )
}

const ROOMS = [
  { key: 'cozinha', label: 'Cozinha', Comp: Kitchen },
  { key: 'sala', label: 'Sala', Comp: Living },
  { key: 'quarto', label: 'Quarto', Comp: Bedroom },
] as const

export default function DecorVisualizer() {
  const { open } = useLeadGate()
  const patterns = useMemo(() => COLORS.filter((c) => c.line === 'decor'), [])
  const families = useMemo(() => [...new Set(patterns.map((p) => p.family))].sort(), [patterns])
  const [fam, setFam] = useState<string>('all')
  const [active, setActive] = useState<Color>(patterns[0])
  const [room, setRoom] = useState<(typeof ROOMS)[number]['key']>('cozinha')

  const list = fam === 'all' ? patterns : patterns.filter((p) => p.family === fam)
  const Room = ROOMS.find((r) => r.key === room)!.Comp

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Stage */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {ROOMS.map((r) => (
            <button
              key={r.key}
              onClick={() => setRoom(r.key)}
              className={`font-display text-xs font-bold uppercase tracking-wide px-4 py-2 transition ${
                room === r.key ? 'bg-alltak-blue text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {r.label} 3D
            </button>
          ))}
          <span className="ml-auto hidden font-display text-xs font-bold uppercase tracking-[0.25em] text-white/40 md:inline">
            Aplicação simulada
          </span>
        </div>
        <div className="overflow-hidden border border-white/10 bg-alltak-coal">
          <Room pattern={active} id={active.code} />
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

        <div className="mt-4 grid max-h-[420px] grid-cols-3 gap-2 overflow-auto pr-1 sm:grid-cols-4">
          {list.map((p) => (
            <button
              key={p.code}
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
          Prévia ilustrativa. As cores podem variar conforme a tela. Solicite amostra física.
        </p>
      </div>
    </div>
  )
}
