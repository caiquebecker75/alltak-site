import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { STORE_URL } from '../data/site'

// "Banner principal" — carrossel dos banners finalizados fornecidos pela marca
// (pasta Banners do Drive). As peças já trazem arte e texto próprios, então o
// overlay é mínimo: apenas um degradê para leitura dos CTAs.
const SLIDES = [
  { img: './assets/banner-wraps.jpg', alt: 'Alltak Wraps — Linha IWC' },
  { img: './assets/banner-decor.jpg', alt: 'Alltak Decor — Revestimentos' },
]

export default function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative h-[86vh] min-h-[560px] overflow-hidden bg-alltak-black">
      {/* Slides are scaled taller than the section (and clipped by overflow-hidden)
          to crop out the fake header baked into the top of each banner artwork. */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.img}
          className="absolute -top-[9%] left-0 h-[118%] w-full bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url('${s.img}')`, opacity: i === idx ? 1 : 0 }}
          role="img"
          aria-label={s.alt}
        />
      ))}

      {/* gentle bottom + left gradient for CTA legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" aria-hidden />
      {/* top fade under our nav */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/90 to-transparent" aria-hidden />

      <div className="container-x relative flex h-full flex-col justify-end pb-16 md:pb-20">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/produtos" className="btn-trapezoid btn-red">Ver portfólio completo</Link>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline">
            Alltak Store ↗
          </a>

          <div className="ml-auto flex gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Banner ${idx + 1}`}
                className={`h-1.5 transition-all ${i === idx ? 'w-8 bg-alltak-red' : 'w-4 bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-px left-0 h-10 w-full bg-alltak-black clip-slant md:h-14" aria-hidden />
    </section>
  )
}
