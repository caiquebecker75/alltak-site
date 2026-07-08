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

    const max = () => document.documentElement.scrollHeight - innerHeight

    const loop = () => {
      current += (target - current) * 0.075 // low factor = slow, cinematic
      if (Math.abs(target - current) < 0.5) {
        current = target
        active = false
        window.scrollTo(0, current)
        return
      }
      window.scrollTo(0, current)
      raf = requestAnimationFrame(loop)
    }

    const onWheel = (e: WheelEvent) => {
      // let pinch-zoom and horizontal gestures through
      if (e.ctrlKey) return
      e.preventDefault()
      // resync if something else moved the page (anchors, route changes)
      if (!active) {
        target = window.scrollY
        current = window.scrollY
      }
      target = Math.max(0, Math.min(max(), target + e.deltaY))
      if (!active) {
        active = true
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
    }
  }, [])
  return null
}
