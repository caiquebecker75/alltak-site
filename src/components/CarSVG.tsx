import type { FinishKey } from '../data/visualizer'

// Realistic premium-GT vector illustration (original artwork, no manufacturer
// badges). Three silhouettes — GT coupe, sport sedan, coupe-SUV — sharing a
// layered-lighting body system: sky gradient, horizon reflection, shoulder
// highlight, arch shadows, detailed wheels and LED lighting. The film color
// drives every gradient stop so all 7 finishes read believably.

// ---------- color helpers ----------
function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}
function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')
}
function shade(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex)
  const t = amt < 0 ? 0 : 255
  const p = Math.abs(amt)
  return rgbToHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p)
}

// ---------- model geometry (viewBox 0 0 1000 470, car faces right) ----------
type Model = {
  /** full body silhouette incl. wheel arches cut by overpainted arch shadows */
  body: string
  /** cabin glass pieces */
  glass: string[]
  /** panel seam lines */
  seams: string[]
  /** shoulder-line highlight */
  shoulder: string
  /** roof highlight */
  roofline: string
  wheels: [number, number] // rear cx, front cx
  headlight: string
  taillight: string
  intake: string
  mirror: string
  handle: [number, number] // x,y
}

const WHEEL_Y = 336
const R_TIRE = 74

// —— GT coupe: long hood, cab-rearward, fastback ——
const COUPE: Model = {
  body:
    'M 78 250' +
    ' C 70 262 66 286 72 306 L 84 324' +
    ' C 104 332 128 336 168 337' +
    ' L 180 337 A 90 90 0 0 1 356 337' +
    ' L 598 337 A 90 90 0 0 1 774 337' +
    ' L 872 336' +
    ' C 912 333 938 322 946 300' +
    ' C 952 284 950 268 936 256' +
    ' C 886 240 760 226 620 222' +
    ' C 588 220 566 214 540 196' +
    ' C 510 174 484 160 452 156' +
    ' C 400 150 340 158 296 180' +
    ' C 250 202 206 226 168 238' +
    ' C 128 244 96 246 78 250 Z',
  glass: [
    // windshield + side glass as one sweep (frameless GT look)
    'M 452 166 C 486 170 508 182 534 200 L 574 226 L 470 230 Z',
    // side window
    'M 300 186 C 344 164 402 156 446 162 L 452 168 L 456 228 L 316 232 C 296 232 288 224 300 186 Z',
  ],
  seams: [
    'M 574 228 C 580 258 582 290 578 330', // door front seam
    'M 316 232 C 310 262 308 296 312 332', // door rear seam
    'M 936 258 C 900 250 850 243 800 239', // hood cut
  ],
  shoulder: 'M 120 258 C 300 240 640 234 920 262',
  roofline: 'M 306 182 C 360 158 430 150 462 158',
  wheels: [268, 686],
  headlight: 'M 898 252 C 920 256 934 262 940 270 L 902 274 C 890 268 890 258 898 252 Z',
  taillight: 'M 78 254 L 118 250 C 122 258 122 266 118 272 L 80 274 C 74 268 74 260 78 254 Z',
  intake: 'M 900 288 C 922 290 936 294 942 300 L 936 312 C 918 308 902 304 894 298 Z',
  mirror: 'M 560 210 l 22 -8 8 10 -20 10 z',
  handle: [470, 262],
}

// —— sport sedan: notchback, upright rear glass ——
const SEDAN: Model = {
  body:
    'M 74 252' +
    ' C 66 264 64 288 70 308 L 82 326' +
    ' C 102 334 126 337 166 338' +
    ' L 178 338 A 90 90 0 0 1 354 338' +
    ' L 596 338 A 90 90 0 0 1 772 338' +
    ' L 870 337' +
    ' C 910 334 936 323 944 301' +
    ' C 950 285 948 269 934 257' +
    ' C 880 242 760 230 640 226' +
    ' C 606 224 584 218 558 200' +
    ' C 530 180 506 168 474 164' +
    ' C 420 158 352 162 304 180' +
    ' C 268 194 232 216 196 230' +
    ' C 150 240 94 246 74 252 Z',
  glass: [
    'M 474 174 C 504 178 524 188 548 204 L 584 230 L 486 234 Z',
    'M 306 190 C 350 172 420 164 468 170 L 474 176 L 478 232 L 320 236 C 300 236 294 228 306 190 Z',
    'M 196 232 C 224 220 258 204 292 192 L 298 234 L 216 240 Z', // rear quarter glass
  ],
  seams: [
    'M 584 232 C 590 262 592 294 588 332',
    'M 320 236 C 314 266 312 300 316 334',
    'M 478 234 C 480 266 480 300 478 332',
    'M 934 259 C 898 251 848 245 798 241',
  ],
  shoulder: 'M 110 260 C 300 244 640 238 918 264',
  roofline: 'M 312 186 C 372 164 448 158 480 166',
  wheels: [266, 684],
  headlight: 'M 896 253 C 918 257 932 263 938 271 L 900 275 C 888 269 888 259 896 253 Z',
  taillight: 'M 74 256 L 116 252 C 120 260 120 268 116 274 L 76 276 C 70 270 70 262 74 256 Z',
  intake: 'M 898 290 C 920 292 934 296 940 302 L 934 314 C 916 310 900 306 892 300 Z',
  mirror: 'M 574 214 l 22 -8 8 10 -20 10 z',
  handle: [492, 266],
}

// —— coupe-SUV: taller body, high beltline, raked rear ——
const SUV: Model = {
  body:
    'M 80 232' +
    ' C 70 246 66 278 72 302 L 86 322' +
    ' C 106 332 130 336 170 337' +
    ' L 182 337 A 92 92 0 0 1 362 337' +
    ' L 592 337 A 92 92 0 0 1 772 337' +
    ' L 868 336' +
    ' C 910 333 936 320 944 296' +
    ' C 950 278 948 262 932 250' +
    ' C 878 234 764 222 648 218' +
    ' C 614 216 592 210 568 192' +
    ' C 542 172 518 160 486 154' +
    ' C 430 144 350 148 300 166' +
    ' C 258 182 220 204 186 216' +
    ' C 140 224 96 226 80 232 Z',
  glass: [
    'M 486 164 C 516 168 536 180 560 196 L 596 222 L 498 228 Z',
    'M 302 176 C 350 158 428 152 480 160 L 486 166 L 490 226 L 318 230 C 298 230 292 220 302 176 Z',
    'M 186 218 C 216 206 252 190 288 178 L 296 228 L 206 234 Z',
  ],
  seams: [
    'M 596 224 C 602 256 604 292 600 330',
    'M 318 230 C 312 262 310 298 314 332',
    'M 490 228 C 492 262 492 298 490 330',
    'M 932 252 C 896 244 846 238 796 235',
  ],
  shoulder: 'M 112 244 C 300 228 640 226 916 258',
  roofline: 'M 308 172 C 372 150 456 146 492 156',
  wheels: [272, 682],
  headlight: 'M 894 246 C 916 250 930 256 936 264 L 898 268 C 886 262 886 252 894 246 Z',
  taillight: 'M 80 236 L 122 232 C 126 240 126 250 122 256 L 82 258 C 76 250 76 242 80 236 Z',
  intake: 'M 896 284 C 918 286 932 292 938 298 L 932 312 C 914 308 898 302 890 296 Z',
  mirror: 'M 584 206 l 24 -8 8 10 -22 10 z',
  handle: [500, 258],
}

const MODELS: Record<string, Model> = { coupe: COUPE, sedan: SEDAN, suv: SUV }

// ---------- detailed wheel ----------
function Wheel({ cx, uid }: { cx: number; uid: string }) {
  const cy = WHEEL_Y
  return (
    <g>
      {/* tire */}
      <circle cx={cx} cy={cy} r={R_TIRE} fill={`url(#tire-${uid})`} />
      <circle cx={cx} cy={cy} r={R_TIRE - 2} fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="3" />
      {/* brake disc + caliper */}
      <circle cx={cx} cy={cy} r={34} fill="#6b6f75" />
      <circle cx={cx} cy={cy} r={34} fill="url(#disc-shine)" opacity="0.5" />
      <path d={`M ${cx + 20} ${cy - 30} a 36 36 0 0 1 14 22 l -12 4 a 24 24 0 0 0 -10 -18 z`} fill="#0080ff" />
      {/* rim */}
      <circle cx={cx} cy={cy} r={46} fill="none" stroke={`url(#rim-${uid})`} strokeWidth="9" />
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        const x2 = cx + Math.cos(a) * 42
        const y2 = cy + Math.sin(a) * 42
        const off = 0.16
        const x3 = cx + Math.cos(a + off) * 42
        const y3 = cy + Math.sin(a + off) * 42
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#c9ccd1" strokeWidth="6" strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={x3} y2={y3} stroke="#7d8187" strokeWidth="4" strokeLinecap="round" />
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={9} fill="#1b1d20" stroke="#9aa0a6" strokeWidth="2" />
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
  const m = MODELS[model] ?? COUPE
  const uid = `${model}-${finish}`

  const isChrome = finish === 'cromado'
  const isCarbon = finish === 'carbono'
  const isFlow = finish === 'camaleao'
  const matte = finish === 'fosco'

  const bodyFill = isCarbon
    ? `url(#carbon-${uid})`
    : isChrome
      ? `url(#chrome-${uid})`
      : isFlow
        ? `url(#flow-${uid})`
        : `url(#paint-${uid})`

  return (
    <svg viewBox="0 0 1000 470" className="h-full w-full" role="img" aria-label="Prévia do veículo envelopado">
      <defs>
        <clipPath id={`clip-${uid}`}>
          <path d={m.body} />
        </clipPath>

        {/* layered paint: sky light → tone → rocker dark */}
        <linearGradient id={`paint-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(color, matte ? 0.16 : 0.5)} />
          <stop offset="30%" stopColor={shade(color, matte ? 0.05 : 0.18)} />
          <stop offset="55%" stopColor={color} />
          <stop offset="78%" stopColor={shade(color, matte ? -0.25 : -0.35)} />
          <stop offset="100%" stopColor={shade(color, -0.6)} />
        </linearGradient>

        {/* chrome mirror */}
        <linearGradient id={`chrome-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(color, 0.75)} />
          <stop offset="38%" stopColor={shade(color, 0.15)} />
          <stop offset="52%" stopColor={shade(color, -0.5)} />
          <stop offset="60%" stopColor={shade(color, 0.35)} />
          <stop offset="100%" stopColor={shade(color, -0.2)} />
        </linearGradient>

        {/* chameleon two-tone flow */}
        <linearGradient id={`flow-${uid}`} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stopColor={color} />
          <stop offset="55%" stopColor={shade(color, -0.1)} />
          <stop offset="100%" stopColor={shift ?? color} />
        </linearGradient>

        {/* carbon weave */}
        <pattern id={`carbon-${uid}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill={shade(color, -0.15)} />
          <rect width="7" height="7" fill={shade(color, 0.08)} />
          <rect x="7" y="7" width="7" height="7" fill={shade(color, 0.08)} />
          <rect x="7" width="7" height="7" fill={shade(color, -0.4)} />
          <rect y="7" width="7" height="7" fill={shade(color, -0.4)} />
        </pattern>

        {/* glass */}
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26303c" />
          <stop offset="60%" stopColor="#0b1119" />
          <stop offset="100%" stopColor="#05080c" />
        </linearGradient>

        <radialGradient id={`tire-${uid}`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#2a2d31" />
          <stop offset="70%" stopColor="#0d0e10" />
          <stop offset="100%" stopColor="#050506" />
        </radialGradient>
        <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8eaee" />
          <stop offset="50%" stopColor="#9aa0a6" />
          <stop offset="100%" stopColor="#5c6066" />
        </linearGradient>
        <linearGradient id="disc-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        {/* headlight LED */}
        <linearGradient id={`led-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dff3ff" />
          <stop offset="100%" stopColor="#7fc4ff" />
        </linearGradient>

        {/* floor reflection fade */}
        <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`refl-${uid}`}>
          <rect x="0" y="0" width="1000" height="470" fill={`url(#fade-${uid})`} />
        </mask>
      </defs>

      {/* ground shadow */}
      <ellipse cx="500" cy="428" rx="440" ry="18" fill="#000" opacity="0.55" />

      {/* floor reflection (mirrored body, faded) */}
      <g transform="translate(0, 848) scale(1,-1)" mask={`url(#refl-${uid})`} opacity="0.5">
        <path d={m.body} fill={bodyFill} />
      </g>

      {/* ---- body ---- */}
      <path d={m.body} fill={bodyFill} />

      {/* finish overlays clipped to body */}
      <g clipPath={`url(#clip-${uid})`}>
        {finish === 'brilho' && (
          <>
            <path d={m.shoulder} stroke="#fff" strokeOpacity="0.55" strokeWidth="3" fill="none" />
            <ellipse cx="560" cy="250" rx="380" ry="26" fill="#fff" opacity="0.14" />
          </>
        )}
        {finish === 'metalico' && (
          <>
            <path d={m.shoulder} stroke="#fff" strokeOpacity="0.5" strokeWidth="3" fill="none" />
            <rect x="0" y="252" width="1000" height="18" fill="#fff" opacity="0.12" />
            <ellipse cx="520" cy="246" rx="400" ry="20" fill="#fff" opacity="0.15" />
          </>
        )}
        {finish === 'acetinado' && (
          <path d={m.shoulder} stroke="#fff" strokeOpacity="0.3" strokeWidth="3" fill="none" />
        )}
        {isFlow && (
          <>
            <path d={m.shoulder} stroke="#fff" strokeOpacity="0.5" strokeWidth="3" fill="none" />
            <ellipse cx="560" cy="250" rx="380" ry="26" fill="#fff" opacity="0.12" />
          </>
        )}
        {isChrome && <rect x="0" y="256" width="1000" height="5" fill="#fff" opacity="0.65" />}
        {isCarbon && <path d={m.shoulder} stroke="#fff" strokeOpacity="0.25" strokeWidth="2.5" fill="none" />}

        {/* roof highlight */}
        {!matte && <path d={m.roofline} stroke="#fff" strokeOpacity={isChrome ? 0.7 : 0.4} strokeWidth="3.5" fill="none" />}

        {/* wheel-arch ambient occlusion */}
        <circle cx={m.wheels[0]} cy={WHEEL_Y} r={R_TIRE + 18} fill="#000" opacity="0.4" />
        <circle cx={m.wheels[1]} cy={WHEEL_Y} r={R_TIRE + 18} fill="#000" opacity="0.4" />

        {/* panel seams */}
        {m.seams.map((d, i) => (
          <path key={i} d={d} stroke="#000" strokeOpacity="0.32" strokeWidth="1.6" fill="none" />
        ))}

        {/* rocker shading */}
        <rect x="60" y="318" width="900" height="26" fill="#000" opacity="0.3" />
      </g>

      {/* body outline */}
      <path d={m.body} fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="2" />

      {/* ---- glass ---- */}
      {m.glass.map((d, i) => (
        <g key={i}>
          <path d={d} fill={`url(#glass-${uid})`} />
          <path d={d} fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="1.6" />
        </g>
      ))}
      {/* glass reflections */}
      <g opacity="0.5">
        <path d={m.glass[0]} fill="#fff" opacity="0.16" transform="translate(6,2) scale(0.98)" clipPath={`url(#clip-${uid})`} />
      </g>

      {/* mirror */}
      <path d={m.mirror} fill={isCarbon ? '#1a1c20' : shade(color, -0.1)} stroke="#000" strokeOpacity="0.4" />

      {/* door handle */}
      <rect x={m.handle[0]} y={m.handle[1]} width="34" height="6" rx="3" fill="#000" opacity="0.4" />

      {/* lights */}
      <path d={m.headlight} fill={`url(#led-${uid})`} />
      <path d={m.headlight} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
      <path d={m.taillight} fill="#e02430" opacity="0.92" />
      <path d={m.intake} fill="#0a0c0e" opacity="0.9" />

      {/* wheels */}
      <Wheel cx={m.wheels[0]} uid={uid} />
      <Wheel cx={m.wheels[1]} uid={uid} />
    </svg>
  )
}
