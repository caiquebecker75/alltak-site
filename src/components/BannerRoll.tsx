import { useEffect, useState } from 'react'

// Full-bleed auto-rotating banner carousel: the brand's campaign artworks fill
// the entire width, crossfading with a slow Ken Burns drift. Dots + progress
// let the user jump; hovering pauses the rotation.
const SLIDES = [
  { img: './assets/banner-wraps.jpg', label: 'Alltak Wraps · Linha IWC' },
  { img: './assets/banner-decor.jpg', label: 'Alltak Decor · Revestimentos' },
  { img: './assets/banner.avif', label: 'Alltak · Institucional' },
]

const DURATION = 5000

export default function BannerRoll() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setI((v) => (v + 1) % SLIDES.length), DURATION)
    return () => clearInterval(id)
  }, [paused])

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
              className="h-full w-full bg-cover bg-center"
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

      {/* legibility gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" aria-hidden />

      {/* header overlay */}
      <div className="container-x absolute inset-x-0 top-8">
        <span className="tag">Campanhas</span>
      </div>

      {/* caption + controls */}
      <div className="container-x absolute inset-x-0 bottom-8 flex items-end justify-between gap-6">
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-alltak-blueLight">
            {String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </div>
          <h3 className="mt-1 font-display text-2xl font-extrabold uppercase text-white md:text-4xl">
            {SLIDES[i].label}
          </h3>
        </div>
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
