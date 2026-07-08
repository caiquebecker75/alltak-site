import type { ReactNode } from 'react'
import Reveal from './Reveal'

// Standard interior-page hero band.
export default function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-alltak-black pb-14 pt-32 md:pb-20 md:pt-40">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: "url('./assets/caveiras.avif')" }}
        aria-hidden
      />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow text-alltak-blue">{eyebrow}</p>
          <h1 className="mt-3 text-5xl text-white md:text-7xl">{title}</h1>
          {children && <div className="mt-5 max-w-2xl text-white/65">{children}</div>}
        </Reveal>
      </div>
      <div className="absolute -bottom-px left-0 h-8 w-full bg-alltak-black clip-slant" aria-hidden />
    </section>
  )
}
