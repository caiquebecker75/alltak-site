import { useEffect, useRef } from 'react'
import caveira from '../brand/caveira-simbolo.png'

// Infinite scrolling brand strip. The whole track skews with scroll velocity,
// so fast scrolling gives the type a sense of drag/speed. Items are separated
// by the official Alltak skull symbol.
export default function Marquee({
  items,
  reverse = false,
  className = '',
  big = false,
  invertSkull = false,
}: {
  items: string[]
  reverse?: boolean
  className?: string
  big?: boolean
  /** render the skull separator white (for dark rows) */
  invertSkull?: boolean
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let lastY = scrollY
    let skew = 0
    let raf = 0
    const loop = () => {
      const dy = scrollY - lastY
      lastY = scrollY
      const target = Math.max(-12, Math.min(12, dy * 0.35))
      skew += (target - skew) * 0.12
      el.style.transform = `skewX(${skew}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const row = [...items, ...items]
  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div ref={trackRef} className="will-change-transform">
        <div className={`flex w-max whitespace-nowrap ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}>
          {row.map((t, i) => (
            <span key={i} className="flex items-center">
              <span
                className={`px-6 font-display font-black uppercase tracking-tight ${
                  big ? 'text-5xl md:text-7xl' : 'text-2xl md:text-3xl'
                }`}
              >
                {t}
              </span>
              <img
                src={caveira}
                alt=""
                aria-hidden
                draggable={false}
                className={`w-auto select-none align-middle ${big ? 'h-8' : 'h-5'}`}
                style={{
                  opacity: 0.55,
                  filter: invertSkull ? 'brightness(0) invert(1)' : 'brightness(0)',
                }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
