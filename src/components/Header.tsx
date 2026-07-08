import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV } from '../data/site'
import Logo from './Logo'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-alltak-black/95 backdrop-blur border-b border-white/10' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link to="/" aria-label="Alltak — início">
          <Logo className="h-6 md:h-7" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noreferrer"
                className="link-underline font-display text-sm font-semibold uppercase tracking-wide text-white/85 transition-colors hover:text-alltak-blue"
              >
                {item.label} <span aria-hidden>↗</span>
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="link-underline font-display text-sm font-semibold uppercase tracking-wide text-white/85 transition-colors hover:text-alltak-blue"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className={`h-0.5 w-6 bg-white transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-white transition ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-white transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-alltak-black px-5 pb-6 pt-2 md:hidden">
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noreferrer"
                className="block border-b border-white/5 py-3 font-display text-lg font-semibold uppercase tracking-wide text-white/90"
              >
                {item.label} ↗
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="block border-b border-white/5 py-3 font-display text-lg font-semibold uppercase tracking-wide text-white/90"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  )
}
