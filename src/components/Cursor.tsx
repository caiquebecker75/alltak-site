import { useEffect, useRef } from 'react'

// Custom cursor: a blue trapezoid dot + a trailing ring that eases behind the
// pointer and grows over interactive elements. Disabled on touch devices.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const dot = dotRef.current!
    const ring = ringRef.current!
    document.documentElement.classList.add('has-cursor')

    let x = innerWidth / 2, y = innerHeight / 2
    let rx = x, ry = y
    let hot = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      const t = e.target as HTMLElement
      hot = !!t.closest('a, button, [role="button"], input, select, textarea, .cursor-hot')
    }
    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%,-50%)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%) scale(${hot ? 2.2 : 1})`
      ring.style.borderColor = hot ? 'rgba(0,128,255,.9)' : 'rgba(255,255,255,.45)'
      raf = requestAnimationFrame(loop)
    }
    addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-2.5 w-3.5 bg-alltak-blue clip-escudo md:block"
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-10 w-10 rounded-full border transition-[border-color] duration-200 md:block"
        style={{ transitionProperty: 'border-color' }}
        aria-hidden
      />
    </>
  )
}
