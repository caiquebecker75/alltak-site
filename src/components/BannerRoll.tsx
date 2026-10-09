import { useEffect, useState } from 'react'

// Full-bleed auto-rotating banner carousel: the brand's campaign artworks fill
// the entire width, crossfading with a slow Ken Burns drift. Discreet arrows on
// each side and the progress dots let the user move; hovering pauses.
const SLIDES = [
  // versão panorâmica (migracao/banner_iwc_panoramico.py): sem o menu do site
  // antigo embutido e com texto, fotos e leque inteiros no formato do carrossel
  // no celular o corte foca o texto (à esquerda das fotos) em vez do centro
  { img: './assets/banner-iwc-panoramico.jpg', label: 'Alltak Wraps · Linha IWC', pos: 'bg-[position:24%_center] md:bg-center' },
  { img: './assets/banner-decor.jpg', label: 'Alltak Decor · Revestimentos' },
  { img: './assets/banner.avif', label: 'Alltak · Institucional' },
]

const DURATION = 5000

export default function BannerRoll() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  // um timer por slide: trocar pela seta reinicia a contagem do próximo
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => setI((v) => (v + 1) % SLIDES.length), DURATION)
    return () => clearTimeout(id)
  }, [i, paused])

  const ir = (passo: number) => setI((v) => (v + passo + SLIDES.length) % SLIDES.length)

  return (
    <section
      className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-alltak-navyDeep"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((s, idx) => {
        const active = idx === i
        return (
          <div
            key={s.img}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: active ? 1 : 0 }}
            aria-hidden={!active}
          >
            {/* Ken Burns: slow zoom while the slide is on stage */}
            <div
              className={`h-full w-full bg-cover ${'pos' in s ? s.pos : 'bg-center'}`}
              style={{
                backgroundImage: `url('${s.img}')`,
                transform: active ? 'scale(1.06)' : 'scale(1)',
                transition: `transform ${DURATION + 1200}ms linear`,
              }}
              role="img"
              aria-label={s.label}
            />
          </div>
        )
      })}

      {/* legibility gradient for the progress dots */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" aria-hidden />

      {/* setas discretas, uma de cada lado */}
      {[
        { passo: -1, lado: 'left-1.5 md:left-5', rotulo: 'Banner anterior', d: 'M15 5l-7 7 7 7' },
        { passo: 1, lado: 'right-1.5 md:right-5', rotulo: 'Próximo banner', d: 'M9 5l7 7-7 7' },
      ].map((s) => (
        <button
          key={s.passo}
          onClick={() => ir(s.passo)}
          aria-label={s.rotulo}
          className={`absolute top-1/2 ${s.lado} z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white/60 backdrop-blur-[2px] transition hover:border-white/50 hover:bg-black/35 hover:text-white md:h-12 md:w-12`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={s.d} />
          </svg>
        </button>
      ))}

      {/* controles (sem legenda: a arte do banner fala por si) */}
      <div className="container-x absolute inset-x-0 bottom-8 flex items-end justify-end gap-6">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Banner ${idx + 1}`}
              className="group relative h-1.5 w-12 overflow-hidden bg-white/25"
            >
              <span
                className="absolute inset-y-0 left-0 bg-alltak-blue"
                style={{
                  width: idx === i ? '100%' : '0%',
                  transition: idx === i && !paused ? `width ${DURATION}ms linear` : 'width .3s ease',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
