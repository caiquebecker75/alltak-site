import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORIES } from '../data/site'
import { onScrollChange } from '../lib/onScrollChange'

const CATEGORY_IMAGE: Record<string, string> = {
  automotivo: './assets/automotivo_03.avif',
  arquitetura: './assets/decor_02.avif',
  impressao: './assets/sign_02.avif',
  'sign-design': './assets/sign_03.avif',
  'aplicacoes-tecnicas': './assets/automotivo_02.avif',
  'wrap-care': './assets/decor_03.avif',
  acessorios: './assets/decor_01.avif',
}

// Horizontal scroll gallery: the page keeps scrolling vertically while the
// track slides sideways through the product categories.
export default function HScroll() {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [x, setX] = useState(0)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    return onScrollChange(() => {
      const el = wrap.current
      const tr = track.current
      if (!el || !tr) return
      const r = el.getBoundingClientRect()
      const total = r.height - innerHeight
      const p = Math.min(1, Math.max(0, -r.top / total))
      setX(-p * Math.max(0, tr.scrollWidth - innerWidth))
      setPct(p)
    })
  }, [])

  return (
    <div ref={wrap} className="relative bg-alltak-cream" style={{ height: '340vh' }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x mb-8 flex items-end justify-between">
          <div>
            <span className="tag">Portfólio</span>
            <h2 className="mt-4 text-5xl text-alltak-black md:text-7xl">Linhas de produto</h2>
          </div>
          <div className="hidden font-display text-sm font-bold uppercase tracking-widest text-alltak-black/50 md:block">
            {String(Math.round(pct * 100)).padStart(3, '0')} / 100 — role para navegar
          </div>
        </div>

        <div
          ref={track}
          className="flex w-max gap-3 pl-5 will-change-transform sm:pl-8"
          style={{ transform: `translate3d(${x}px,0,0)` }}
        >
          {PRODUCT_CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              to="/produtos"
              className="group block w-[72vw] shrink-0 sm:w-[44vw] lg:w-[30vw]"
            >
              {/* alternating trapezoids — flatter and close together (format 01) */}
              <div className={`frame-trap aspect-[4/3] bg-alltak-navy ${i % 2 === 0 ? 'clip-tz' : 'clip-tz-alt'}`}>
                <img src={CATEGORY_IMAGE[c.slug]} alt={c.name} loading="lazy" className="opacity-95 group-hover:opacity-100" />
              </div>
              <div className="mt-3 flex items-end justify-between px-2">
                <div>
                  <div className="font-display text-xs font-bold uppercase tracking-[0.25em] text-alltak-black/50">
                    0{i + 1} · {c.items.length} produtos
                  </div>
                  <h3 className="mt-0.5 text-2xl text-alltak-black md:text-3xl">{c.name}</h3>
                </div>
                <span className="font-display text-sm font-bold uppercase text-alltak-blueDark opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Ver →
                </span>
              </div>
            </Link>
          ))}

          {/* end card */}
          <Link to="/produtos" className="group flex w-[60vw] shrink-0 items-center justify-center sm:w-[34vw]">
            <div className="text-center">
              <div className="font-display text-6xl font-black text-alltak-black md:text-8xl">
                +120
              </div>
              <div className="font-display text-sm font-bold uppercase tracking-[0.3em] text-alltak-black/60">
                cores e padrões
              </div>
              <span className="btn-trapezoid btn-navy mt-6">Ver tudo</span>
            </div>
          </Link>
        </div>

        {/* progress bar */}
        <div className="container-x mt-10">
          <div className="h-1 w-full bg-alltak-black/10">
            <div className="h-full bg-alltak-blue transition-[width] duration-100" style={{ width: `${pct * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
