import { useEffect, useRef, useState, type ReactNode } from 'react'

// Translates its children vertically as the element scrolls through the
// viewport, for a subtle depth effect. `speed` > 0 moves slower than scroll.
export default function Parallax({
  children,
  speed = 0.15,
  className = '',
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      setY(-center * speed)
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ transform: `translate3d(0, ${y}px, 0)`, willChange: 'transform' }}>
      {children}
    </div>
  )
}
