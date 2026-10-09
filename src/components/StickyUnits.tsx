import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { UNITS } from '../data/site'
import { onScrollChange } from '../lib/onScrollChange'

// Pinned showcase: the section is one viewport tall per business unit and a
// sticky stage stays fixed while the user scrolls through it. The panel shown
// is always a whole unit (never half of two): crossing the midpoint of a
// viewport switches unit, and the slanted trapezoid wipe then plays on its own
// clock. Inside the stage one mouse-wheel notch jumps straight to the
// next/previous unit; past the first/last unit the page scrolls normally.
const WIPE_MS = 750
const TRAVA_MS = 900 // ignores the rest of a wheel/trackpad burst after a jump

export default function StickyUnits() {
  const wrap = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const n = UNITS.length

  // which unit is on stage, from the scroll position
  useEffect(() => {
    return onScrollChange(() => {
      const el = wrap.current
      if (!el) return
      const i = Math.min(n - 1, Math.max(0, Math.round(-el.getBoundingClientRect().top / innerHeight)))
      activeRef.current = i
      setActive(i)
    })
  }, [n])

  // one wheel notch = one unit while the stage is pinned
  useEffect(() => {
    let travadoAte = 0
    const onWheel = (e: WheelEvent) => {
      const el = wrap.current
      if (!el || e.ctrlKey || Math.abs(e.deltaY) < 2) return
      const r = el.getBoundingClientRect()
      const fixado = r.top <= 1 && r.bottom >= innerHeight - 1
      if (!fixado) return
      const alvo = activeRef.current + (e.deltaY > 0 ? 1 : -1)
      if (alvo < 0 || alvo > n - 1) return // saindo do bloco: rolagem normal
      e.preventDefault()
      const agora = performance.now()
      if (agora < travadoAte) return
      travadoAte = agora + TRAVA_MS
      activeRef.current = alvo
      setActive(alvo)
      // salto instantâneo: o palco é sticky, então a página não se move na tela;
      // quem anima a troca é a cortina em trapézio
      window.scrollTo({ top: scrollY + r.top + alvo * innerHeight, behavior: 'instant' })
    }
    addEventListener('wheel', onWheel, { passive: false })
    return () => removeEventListener('wheel', onWheel)
  }, [n])

  return (
    <div ref={wrap} style={{ height: `${n * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        {UNITS.map((u, i) => {
          const on = i <= active
          // slanted trapezoid wipe sweeping left→right (panel 0 is the base)
          const x1 = i === 0 || on ? 130 : 0
          const x2 = x1 - 30
          return (
            <section
              key={u.key}
              className={`absolute inset-0 ${u.bg}`}
              style={{
                clipPath: `polygon(0 0, ${x1}% 0, ${x2}% 100%, 0 100%)`,
                transition: `clip-path ${WIPE_MS}ms cubic-bezier(.7,0,.25,1)`,
              }}
              aria-hidden={i !== active}
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
                {/* bloco de texto com altura fixa e alinhado pelo topo: etiqueta,
                    logo, chamada, descrição e botão ficam na mesma posição nas
                    três unidades, mesmo com descrições de tamanhos diferentes */}
                <div className="md:h-[27rem]">
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
                  <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 md:min-h-[6.5em]">{u.description}</p>
                  <Link to={`/cores?linha=${u.key}`} className="btn-trapezoid btn-blue mt-8" tabIndex={i === active ? 0 : -1}>
                    Ver os produtos
                  </Link>
                </div>
                <div className="relative hidden md:block">
                  <div
                    className="frame-trap aspect-[4/3] w-full cursor-hot"
                    style={{
                      transform: on ? 'none' : 'translateY(60px) scale(0.92)',
                      transition: `transform ${WIPE_MS}ms cubic-bezier(.2,.7,.1,1)`,
                    }}
                  >
                    <img src={u.image} alt={`Alltak ${u.name}`} className="img-zoom" loading="lazy" />
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
