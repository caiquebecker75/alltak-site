import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

// Mounts its children once they scroll near the viewport. Uses an
// IntersectionObserver plus a scroll/interval fallback (some environments report
// innerHeight 0 or don't fire IO), so the heavy child always mounts when reached.
export default function LazyInView({
  children,
  margin = 300,
  fallback = null,
  className = '',
}: {
  children: ReactNode
  margin?: number
  fallback?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let done = false
    const reveal = () => {
      if (done) return
      done = true
      setShow(true)
      cleanup()
    }
    const vh = () => window.innerHeight || document.documentElement.clientHeight || 800
    const check = () => {
      const r = el.getBoundingClientRect()
      if (r.top < vh() + margin && r.bottom > -margin) reveal()
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && reveal(), {
      rootMargin: `${margin}px`,
    })
    io.observe(el)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    const id = setInterval(check, 250)
    const raf = requestAnimationFrame(check)
    function cleanup() {
      io.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      clearInterval(id)
      cancelAnimationFrame(raf)
    }
    return cleanup
  }, [margin])

  return (
    <div ref={ref} className={className}>
      {show ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  )
}
