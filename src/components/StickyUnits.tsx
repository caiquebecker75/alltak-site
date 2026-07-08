import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { UNITS } from '../data/site'
import { onScrollChange } from '../lib/onScrollChange'

// Pinned showcase: the section is 3 viewports tall; a sticky stage stays fixed
// while scroll drives slanted trapezoid wipes revealing each business unit.
export default function StickyUnits() {
  const wrap = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    return onScrollChange(() => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - innerHeight
      setP(Math.min(1, Math.max(0, -r.top / total)))
    })
  }, [])

  const n = UNITS.length
  // progress per panel: panel i is fully visible on [i/n, (i+1)/n]
  const wipe = (i: number) => {
    if (i === 0) return 1
    const t = Math.min(1, Math.max(0, (p - (i - 0.35) / n) * (n / 0.7)))
    return t
  }
  const active = Math.min(n - 1, Math.floor(p * n + 0.0001))

  return (
    <div ref={wrap} style={{ height: `${(n + 0.6) * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        {UNITS.map((u, i) => {
          const t = wipe(i)
          // slanted trapezoid wipe sweeping left→right
          const x1 = t * 130
          const x2 = x1 - 30
          return (
            <section
              key={u.key}
              className={`absolute inset-0 ${u.bg}`}
              style={{
                clipPath: `polygon(0 0, ${x1}% 0, ${x2}% 100%, 0 100%)`,
                visibility: t <= 0 ? 'hidden' : 'visible',
              }}
            >
              {u.skull && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.12] bg-cover bg-center mix-blend-luminosity"
                  style={{ backgroundImage: "url('./assets/caveiras.avif')" }}
                  aria-hidden
                />
              )}
              {/* giant index watermark */}
              <div className="pointer-events-none absolute -right-6 bottom-0 font-display text-[38vh] font-black leading-none text-white/5">
                0{i + 1}
              </div>

              <div className="container-x relative grid h-full items-center gap-10 md:grid-cols-2">
                <div>
                  <span className="tag">Unidade de negócio · 0{i + 1}/0{n}</span>
                  {/* official submarca lockup */}
                  <img
                    src={u.logo}
                    alt={`Alltak ${u.name}`}
                    className="mt-8 h-14 w-auto select-none md:h-20"
                    style={u.logoInvert ? { filter: 'brightness(0) invert(1)' } : undefined}
                    draggable={false}
                  />
                  <p className="mt-5 font-display text-lg font-bold uppercase tracking-wide" style={{ color: u.color }}>
                    {u.tagline}
                  </p>
                  <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">{u.description}</p>
                  <Link to="/produtos" className="btn-trapezoid btn-blue mt-8">
                    Ver mais produtos
                  </Link>
                </div>
                <div className="relative hidden md:block">
                  <div
                    className="aspect-[4/3] w-full overflow-hidden clip-trapezoid"
                    style={{
                      transform: `translateY(${(1 - t) * 60}px) scale(${0.92 + t * 0.08})`,
                      transition: 'transform .1s linear',
                    }}
                  >
                    <img src={u.image} alt={`Alltak ${u.name}`} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="absolute -bottom-3 left-8 h-6 w-28 clip-escudo" style={{ background: u.color }} aria-hidden />
                </div>
              </div>
            </section>
          )
        })}

        {/* progress rail */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {UNITS.map((_, i) => (
            <div key={i} className={`h-1.5 transition-all duration-300 ${i === active ? 'w-10 bg-alltak-blue' : 'w-4 bg-white/30'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
