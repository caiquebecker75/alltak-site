import { useEffect } from 'react'

// Cinematic inertia scrolling: wheel input is eased toward its target with a
// slow lerp, giving the page a heavy, filmic glide. Touch devices and users
// with prefers-reduced-motion keep native scrolling.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let target = window.scrollY
    let current = window.scrollY
    let raf = 0
    let active = false
    let lastTick = 0

    const max = () => document.documentElement.scrollHeight - innerHeight

    const loop = () => {
      lastTick = performance.now()
      current += (target - current) * 0.14 // responsive glide, still filmic
      if (Math.abs(target - current) < 0.5) {
        current = target
        active = false
        window.scrollTo(0, current)
        return
      }
      window.scrollTo(0, current)
      raf = requestAnimationFrame(loop)
    }

    // safety net: if rAF stalls (throttled tabs, battery saver), never leave
    // the page unscrollable — apply the pending target directly
    const watchdog = setInterval(() => {
      if (active && performance.now() - lastTick > 200) {
        current = target
        window.scrollTo(0, target)
        active = false
      }
    }, 250)

    const onWheel = (e: WheelEvent) => {
      // let pinch-zoom and horizontal gestures through
      if (e.ctrlKey) return
      e.preventDefault()
      // normalize delta units: 0=pixels, 1=lines, 2=pages
      let dy = e.deltaY
      if (e.deltaMode === 1) dy *= 33
      else if (e.deltaMode === 2) dy *= innerHeight
      dy *= 1.4 // travel per notch
      // resync if something else moved the page (anchors, route changes)
      if (!active) {
        target = window.scrollY
        current = window.scrollY
      }
      target = Math.max(0, Math.min(max(), target + dy))
      if (!active) {
        active = true
        lastTick = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }

    // keep native behavior for keyboard/anchor jumps: just resync on them
    const resync = () => {
      if (!active) {
        target = window.scrollY
        current = window.scrollY
      }
    }

    addEventListener('wheel', onWheel, { passive: false })
    addEventListener('keydown', resync)
    return () => {
      removeEventListener('wheel', onWheel)
      removeEventListener('keydown', resync)
      cancelAnimationFrame(raf)
      clearInterval(watchdog)
    }
  }, [])
  return null
}
