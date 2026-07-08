import { useEffect, useRef, useState } from 'react'
import { onScrollChange } from '../lib/onScrollChange'

// "Roll-up" banner rail: the brand's own banner artworks (from the project
// Drive) stand side by side in keystone-trapezoid frames and glide sideways
// as the page scrolls — alternating rows drift in opposite directions.
const BANNERS = [
  { img: './assets/banner-wraps.jpg', label: 'Alltak Wraps — Linha IWC' },
  { img: './assets/banner-decor.jpg', label: 'Alltak Decor — Revestimentos' },
  { img: './assets/banner.avif', label: 'Alltak — Institucional' },
  { img: './assets/automotivo_02.avif', label: 'Aplicação Wraps' },
  { img: './assets/decor_02.avif', label: 'Aplicação Decor' },
  { img: './assets/sign_02.avif', label: 'Aplicação Signs' },
]

export default function BannerRoll() {
  const wrap = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    return onScrollChange(() => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      // progress of the section through the viewport (-1 → 1)
      const t = (r.top + r.height / 2 - innerHeight / 2) / (innerHeight + r.height)
      setP(t)
    })
  }, [])

  return (
    <section ref={wrap} className="overflow-hidden border-y border-white/10 bg-alltak-navyDeep py-14 md:py-20">
      <div className="container-x mb-8 flex items-end justify-between">
        <div>
          <span className="tag">Campanhas</span>
          <h2 className="mt-4 text-4xl text-white md:text-6xl">A marca em movimento</h2>
        </div>
        <span className="hidden font-display text-xs font-bold uppercase tracking-[0.3em] text-white/40 md:block">
          Role — os banners acompanham
        </span>
      </div>

      {/* rail slides sideways with scroll */}
      <div
        className="flex w-max gap-6 pl-6 will-change-transform"
        style={{ transform: `translate3d(${-140 - p * 420}px, 0, 0)` }}
      >
        {BANNERS.map((b) => (
          <figure key={b.img} className="w-[74vw] shrink-0 sm:w-[46vw] lg:w-[31vw]">
            <div className="frame-trap aspect-[16/10] bg-alltak-ink cursor-hot">
              <img src={b.img} alt={b.label} loading="lazy" />
            </div>
            <figcaption className="mt-3 pl-6 font-display text-xs font-bold uppercase tracking-[0.25em] text-white/45">
              {b.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
