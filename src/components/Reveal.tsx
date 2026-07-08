import { useEffect, useRef, useState, type ReactNode } from 'react'

type Dir = 'up' | 'left' | 'right' | 'scale'

const HIDDEN: Record<Dir, string> = {
  up: 'translateY(30px)',
  left: 'translateX(-40px)',
  right: 'translateX(40px)',
  scale: 'scale(0.94)',
}

// Scroll-reveal wrapper. Hardened so content is NEVER left invisible: reveals as
// soon as the element is at/above the viewport bottom (covers instant jumps such
// as anchor navigation and fast scroll that a bare IntersectionObserver can miss).
export default function Reveal({
  children,
  delay = 0,
  dir = 'up',
  className = '',
}: {
  children: ReactNode
  delay?: number
  dir?: Dir
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
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        reveal()
        return true
      }
      return false
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && reveal(), { threshold: 0.12 })
    io.observe(el)
    const onScroll = () => check()
    window.addEventListener('scroll', onScroll, { passive: true })
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
        transform: shown ? 'none' : HIDDEN[dir],
        transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
