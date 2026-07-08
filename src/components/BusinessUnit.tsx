import { Link } from 'react-router-dom'
import type { Unit } from '../data/site'
import Reveal from './Reveal'

// One business-unit band (WRAPS / DECOR / SIGNS).
// Brand color as background, unit wordmark, description, trapezoid-masked
// photo and the signature trapezoid "Ver mais produtos" button.
export default function BusinessUnit({ unit, index }: { unit: Unit; index: number }) {
  const flip = index % 2 === 1
  return (
    <section className={`relative overflow-hidden ${unit.bg}`}>
      {/* Skull & roses texture for the WRAPS (black) band */}
      {unit.skull && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13] bg-cover bg-center mix-blend-luminosity"
          style={{ backgroundImage: "url('./assets/caveiras.avif')" }}
          aria-hidden
        />
      )}
      <div className="container-x relative grid items-center gap-8 py-16 md:grid-cols-2 md:gap-14 md:py-24">
        {/* Text */}
        <Reveal dir={flip ? 'right' : 'left'} className={flip ? 'md:order-2' : ''}>
          <span className="tag">Unidade de Negócio</span>
          <h2 className="mt-4 text-6xl md:text-7xl">
            <span className="block text-white/40 text-2xl md:text-3xl font-semibold">Alltak</span>
            <span className="text-white">{unit.name}</span>
          </h2>
          <p className={`mt-2 font-display text-lg font-semibold uppercase tracking-wide ${unit.accent}`}>
            {unit.tagline}
          </p>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
            {unit.description}
          </p>
          <Link to="/produtos" className="btn-trapezoid btn-blue mt-8">
            Ver mais produtos
          </Link>
        </Reveal>

        {/* Trapezoid photo */}
        <Reveal delay={120} dir={flip ? 'left' : 'right'} className={flip ? 'md:order-1' : ''}>
          <div className="group relative">
            <div className={`aspect-[4/3] w-full overflow-hidden ${index % 2 === 0 ? 'clip-trapezoid' : 'clip-trapezoid-alt'}`}>
              <img
                src={unit.image}
                alt={`Aplicação Alltak ${unit.name}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            {/* corner accent trapezoid */}
            <div className="absolute -bottom-3 left-6 h-6 w-24 bg-alltak-blue clip-escudo" aria-hidden />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
