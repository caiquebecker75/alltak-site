import type { FinishKey } from '../data/visualizer'

// ---------- color helpers ----------
function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}
function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')
}
function shade(hex: string, amt: number) {
  // amt > 0 lightens, < 0 darkens
  const { r, g, b } = hexToRgb(hex)
  const t = amt < 0 ? 0 : 255
  const p = Math.abs(amt)
  return rgbToHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p)
}

// ---------- silhouettes (viewBox 0 0 1000 440), car faces right ----------
type Shape = { body: string; glass: string; pillars: string[]; roofLabel: string }

const COUPE: Shape = {
  body:
    'M70 330 L70 296 C71 279 78 273 96 270 L132 266 L300 248 ' +
    'L400 152 L600 152 L700 182 L862 226 ' +
    'C905 233 930 250 930 286 L930 330 ' +
    'L852 330 A92 92 0 0 1 668 330 L342 330 A92 92 0 0 1 158 330 Z',
  glass: 'M318 244 L405 162 L596 162 L682 184 L600 206 L332 206 Z',
  pillars: ['M470 162 L470 206 L486 206 L500 162 Z'],
  roofLabel: 'Esportivo',
}

const SEDAN: Shape = {
  body:
    'M70 332 L70 300 C71 282 79 276 98 273 L140 268 L300 256 ' +
    'L392 168 L616 168 L706 196 L864 232 ' +
    'C906 238 930 252 930 288 L930 332 ' +
    'L852 332 A92 92 0 0 1 668 332 L342 332 A92 92 0 0 1 158 332 Z',
  glass: 'M320 250 L398 176 L612 176 L688 198 L610 214 L336 214 Z',
  pillars: ['M486 176 L486 214 L502 214 L518 176 Z'],
  roofLabel: 'Sedan',
}

const SUV: Shape = {
  body:
    'M66 330 L66 292 C67 274 76 268 96 265 L140 262 L286 250 ' +
    'L372 150 L648 150 L724 176 L872 214 ' +
    'C910 220 934 238 934 280 L934 330 ' +
    'L854 330 A94 94 0 0 1 666 330 L340 330 A94 94 0 0 1 152 330 Z',
  glass: 'M300 244 L380 160 L642 160 L712 182 L648 200 L316 200 Z',
  pillars: ['M452 160 L452 200 L468 200 L484 160 Z', 'M566 160 L566 200 L582 200 L598 160 Z'],
  roofLabel: 'SUV',
}

const SHAPES: Record<string, Shape> = { coupe: COUPE, sedan: SEDAN, suv: SUV }

// ---------- wheels ----------
function Wheel({ cx }: { cx: number }) {
  const cy = 330
  return (
    <g>
      <circle cx={cx} cy={cy} r={82} fill="#0b0c0e" />
      <circle cx={cx} cy={cy} r={80} fill="none" stroke="#000" strokeWidth={4} />
      <circle cx={cx} cy={cy} r={46} fill="#15171b" />
      <circle cx={cx} cy={cy} r={46} fill="none" stroke="#2c2f34" strokeWidth={3} />
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * 42}
            y2={cy + Math.sin(a) * 42}
            stroke="#3a3e44"
            strokeWidth={7}
            strokeLinecap="round"
          />
        )
      })}
      <circle cx={cx} cy={cy} r={10} fill="#4a4f56" />
    </g>
  )
}

export default function CarSVG({
  model,
  color,
  shift,
  finish,
}: {
  model: string
  color: string
  shift?: string
  finish: FinishKey
}) {
  const s = SHAPES[model] ?? COUPE
  const uid = `${model}-${finish}`

  // Body fill differs for chrome (mirror bands) and chameleon (two-tone).
  let bodyFill = color
  if (finish === 'cromado') bodyFill = `url(#chrome-${uid})`
  if (finish === 'camaleao') bodyFill = `url(#flow-${uid})`

  return (
    <svg viewBox="0 0 1000 440" className="h-full w-full" role="img" aria-label="Prévia do veículo envelopado">
      <defs>
        <clipPath id={`body-${uid}`}>
          <path d={s.body} />
        </clipPath>

        {/* gloss sheen */}
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.30" />
          <stop offset="34%" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="70%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id={`soft-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.26" />
        </linearGradient>

        {/* chrome mirror gradient */}
        <linearGradient id={`chrome-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(color, 0.55)} />
          <stop offset="34%" stopColor={shade(color, 0.1)} />
          <stop offset="50%" stopColor={shade(color, -0.35)} />
          <stop offset="58%" stopColor={shade(color, 0.25)} />
          <stop offset="100%" stopColor={shade(color, -0.1)} />
        </linearGradient>

        {/* chameleon two-tone */}
        <linearGradient id={`flow-${uid}`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={shift ?? color} />
        </linearGradient>

        {/* carbon weave pattern */}
        <pattern id={`carbon-${uid}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={color} />
          <rect width="8" height="8" fill={shade(color, 0.12)} />
          <rect x="8" y="8" width="8" height="8" fill={shade(color, 0.12)} />
          <rect x="8" width="8" height="8" fill={shade(color, -0.25)} />
          <rect y="8" width="8" height="8" fill={shade(color, -0.25)} />
        </pattern>
      </defs>

      {/* ground shadow */}
      <ellipse cx="500" cy="418" rx="430" ry="20" fill="#000" opacity="0.5" />

      {/* body base */}
      <path d={s.body} fill={finish === 'carbono' ? `url(#carbon-${uid})` : bodyFill} />

      {/* finish overlays, clipped to body */}
      <g clipPath={`url(#body-${uid})`}>
        {finish === 'brilho' && (
          <>
            <rect x="0" y="0" width="1000" height="440" fill={`url(#sheen-${uid})`} />
            <ellipse cx="560" cy="250" rx="360" ry="34" fill="#fff" opacity="0.16" />
          </>
        )}
        {finish === 'metalico' && (
          <>
            <rect x="0" y="0" width="1000" height="440" fill={`url(#sheen-${uid})`} />
            <rect x="0" y="238" width="1000" height="26" fill="#fff" opacity="0.12" />
            <ellipse cx="560" cy="250" rx="380" ry="26" fill="#fff" opacity="0.14" />
          </>
        )}
        {finish === 'acetinado' && <rect x="0" y="0" width="1000" height="440" fill={`url(#soft-${uid})`} />}
        {finish === 'fosco' && (
          <>
            <rect x="0" y="0" width="1000" height="440" fill="#fff" opacity="0.05" />
            <rect x="0" y="300" width="1000" height="140" fill="#000" opacity="0.18" />
          </>
        )}
        {finish === 'carbono' && <rect x="0" y="0" width="1000" height="440" fill={`url(#soft-${uid})`} />}
        {finish === 'cromado' && (
          <>
            <rect x="0" y="248" width="1000" height="6" fill="#fff" opacity="0.55" />
            <ellipse cx="600" cy="235" rx="340" ry="20" fill="#fff" opacity="0.22" />
          </>
        )}
        {finish === 'camaleao' && <rect x="0" y="0" width="1000" height="440" fill={`url(#sheen-${uid})`} />}
      </g>

      {/* body outline */}
      <path d={s.body} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="2" />

      {/* glass */}
      <path d={s.glass} fill="#0c1420" opacity="0.92" />
      <path d={s.glass} fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="2" />
      {/* glass reflection */}
      <path d={s.glass} clipPath={`url(#body-${uid})`} fill="none" />
      {s.pillars.map((p, i) => (
        <path key={i} d={p} fill={finish === 'carbono' ? '#1a1c20' : color} opacity="0.9" />
      ))}

      {/* door + handle */}
      <path d="M520 210 L520 322" stroke="#000" strokeOpacity="0.28" strokeWidth="2" fill="none" clipPath={`url(#body-${uid})`} />
      <rect x="470" y="232" width="34" height="7" rx="3.5" fill="#000" opacity="0.35" />

      {/* lights */}
      <path d="M905 258 q18 4 20 20 l-22 0 z" fill="#f4f6f9" opacity="0.85" />
      <rect x="74" y="276" width="16" height="16" rx="3" fill="#c9302c" opacity="0.85" />

      <Wheel cx={250} />
      <Wheel cx={760} />
    </svg>
  )
}
