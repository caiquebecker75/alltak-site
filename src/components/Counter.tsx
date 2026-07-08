import { useEffect, useRef, useState } from 'react'

// Animated number counter — counts up when scrolled into view.
export default function Counter({
  to,
  prefix = '',
  suffix = '',
  duration = 1400,
  className = '',
}: {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const start = () => {
      if (started.current) return
      started.current = true
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration)
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && start(), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {v}
      {suffix}
    </span>
  )
}
