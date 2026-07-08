import { useEffect, useRef, useState, type ReactNode } from 'react'

// Lightweight scroll-reveal wrapper (fade + rise on first view).
// Hardened so content is NEVER left invisible: reveals as soon as the element
// is at/above the viewport bottom, which also covers instant jumps (anchor
// navigation, fast scroll) that a bare IntersectionObserver can miss.
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveal = () => {
      setShown(true)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
    const check = () => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.9) {
        reveal()
        return true
      }
      return false
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reveal()
    }, { threshold: 0.12 })
    io.observe(el)

    const onScroll = () => check()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Immediate check for content already in/above view on mount.
    const raf = requestAnimationFrame(check)

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
