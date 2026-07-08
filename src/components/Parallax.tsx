import { useEffect, useRef, useState, type ReactNode } from 'react'
import { onScrollChange } from '../lib/onScrollChange'

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
    return onScrollChange(() => {
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      setY(-center * speed)
    })
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ transform: `translate3d(0, ${y}px, 0)`, willChange: 'transform' }}>
      {children}
    </div>
  )
}
