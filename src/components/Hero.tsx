import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { STORE_URL } from '../data/site'

// "Banner principal" — carrossel dos banners finalizados fornecidos pela marca.
const SLIDES = [
  { img: './assets/banner-wraps.jpg', alt: 'Alltak Wraps — Linha IWC' },
  { img: './assets/banner-decor.jpg', alt: 'Alltak Decor — Revestimentos' },
]

export default function Hero() {
  const [i, setI] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  // cursor-follow spotlight
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section
      ref={ref}
      className="relative h-[90vh] min-h-[580px] overflow-hidden bg-alltak-black"
      style={{ ['--mx' as string]: '70%', ['--my' as string]: '30%' }}
    >
      {SLIDES.map((s, idx) => (
        <div
          key={s.img}
          className="absolute -top-[9%] left-0 h-[118%] w-full bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url('${s.img}')`, opacity: i === idx ? 1 : 0 }}
          role="img"
          aria-label={s.alt}
        />
      ))}

      {/* gradients + cursor spotlight */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/35" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/90 to-transparent" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          background:
            'radial-gradient(340px circle at var(--mx) var(--my), rgba(0,128,255,0.22), transparent 60%)',
        }}
        aria-hidden
      />

      <div className="container-x relative flex h-full flex-col justify-between pb-14 pt-24 md:pb-16">
        <div className="pt-4">
          <span className="tag">Nova identidade · Alltak</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/visualizador" className="btn-trapezoid btn-blue">Visualizar envelopamento</Link>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline">
            Alltak Store ↗
          </a>

          <div className="ml-auto flex gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Banner ${idx + 1}`}
                className={`h-1.5 transition-all ${i === idx ? 'w-8 bg-alltak-blue' : 'w-4 bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
