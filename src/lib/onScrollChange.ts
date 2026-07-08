// Registers a callback for scroll-position changes, robustly:
// - native scroll/resize events (the fast path)
// - a light interval that re-syncs if scrollY changed without an event
//   (covers scroll restoration and environments that move scroll silently)
export function onScrollChange(cb: () => void): () => void {
  let lastY = -1
  let lastH = -1
  const tick = () => {
    if (scrollY !== lastY || document.body.scrollHeight !== lastH) {
      lastY = scrollY
      lastH = document.body.scrollHeight
      cb()
    }
  }
  cb()
  addEventListener('scroll', cb, { passive: true })
  addEventListener('resize', cb)
  const id = setInterval(tick, 150)
  return () => {
    removeEventListener('scroll', cb)
    removeEventListener('resize', cb)
    clearInterval(id)
  }
}
