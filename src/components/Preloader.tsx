import { useEffect, useState } from 'react'
import Logo from './Logo'

// First-visit preloader: black screen, escudo logo, 0→100 counter, then the
// whole screen exits with a trapezoid wipe. Runs once per page load.
export default function Preloader() {
  const [n, setN] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // ease the counter: fast at first, settling at 100
    let v = 0
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      clearInterval(id)
      setN(100)
      setTimeout(() => setLeaving(true), 200)
      setTimeout(() => setGone(true), 900)
    }
    const id = setInterval(() => {
      v += Math.max(1, Math.round((100 - v) / 9))
      if (v >= 100) finish()
      else setN(v)
    }, 45)
    // hard cap — the preloader can NEVER get stuck, even if the main thread is
    // busy (e.g. compiling a lazy chunk) and starves the interval.
    const cap = setTimeout(finish, 2200)
    return () => {
      clearInterval(id)
      clearTimeout(cap)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = gone ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [gone])

  if (gone) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
      style={{
        clipPath: leaving ? 'polygon(0 0, 100% 0, 100% 0, 0 0)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        transition: 'clip-path .8s cubic-bezier(.76,0,.24,1)',
      }}
      aria-hidden
    >
      <div className="animate-floaty">
        <Logo variant="escudo" className="h-14 md:h-16" />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 font-display text-8xl font-black text-white/90 md:text-9xl">
        {n}
        <span className="text-alltak-blue">%</span>
      </div>
      <div className="absolute bottom-10 left-8 hidden font-display text-xs font-bold uppercase tracking-[0.3em] text-white/40 md:block">
        Transformando superfícies
      </div>
      {/* progress underline */}
      <div className="absolute bottom-0 left-0 h-1 bg-alltak-blue transition-[width] duration-150" style={{ width: `${n}%` }} />
    </div>
  )
}
