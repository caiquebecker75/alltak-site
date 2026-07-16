import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV } from '../data/site'
import Logo from './Logo'
import Magnetic from './Magnetic'
import LangSwitcher from './LangSwitcher'
import { useT } from '../i18n'

// Header: logo + magnetic menu trigger. Navigation lives in a fullscreen
// overlay with giant staggered links and a trapezoid wipe entrance.
// The bar hides on scroll-down and returns on scroll-up.
export default function Header() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)
  const { pathname, hash } = useLocation()
  const t = useT()

  useEffect(() => setOpen(false), [pathname, hash])

  useEffect(() => {
    const onScroll = () => {
      const y = scrollY
      setScrolled(y > 30)
      setHidden(y > 140 && y > lastY.current)
      lastY.current = y
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          hidden && !open ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled && !open ? 'bg-black/85 backdrop-blur border-b border-white/10' : ''}`}
      >
        <div className="container-x flex h-20 items-center justify-between md:h-24">
          <Link to="/" aria-label="Alltak início" className="relative z-[92]">
            <Logo className="h-9 md:h-12" />
          </Link>

          <div className="flex items-center gap-3 md:gap-5">
            <LangSwitcher className="relative z-[92]" />
            <Magnetic strength={0.3}>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Menu"
                aria-expanded={open}
                className="relative z-[92] flex h-12 w-14 flex-col items-center justify-center gap-[7px] bg-alltak-blue clip-escudo"
              >
                <span className={`h-[3px] w-6 bg-white transition-all duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`h-[3px] w-6 bg-white transition-all duration-300 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Fullscreen overlay menu */}
      <div
        className="fixed inset-0 z-[90] bg-alltak-navyDeep"
        style={{
          clipPath: open ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 86% 0, 0 0)',
          transition: 'clip-path .7s cubic-bezier(.76,0,.24,1)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] bg-cover bg-center"
          style={{ backgroundImage: "url('./assets/caveiras.avif')" }}
          aria-hidden
        />
        {/* decorative trapezoids */}
        <div className="pointer-events-none absolute right-[-6%] top-[12%] h-40 w-72 rotate-12 bg-alltak-blue/15 clip-escudo" aria-hidden />
        <div className="pointer-events-none absolute bottom-[10%] left-[-4%] h-28 w-56 -rotate-6 bg-alltak-blue/10 clip-escudo" aria-hidden />

        <nav className="container-x flex h-full flex-col justify-center">
          {/* big escudo logo headlining the menu */}
          <div
            className="mb-8"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-24px)',
              transition: 'opacity .5s ease 80ms, transform .6s cubic-bezier(.2,.7,.1,1) 80ms',
            }}
          >
            <Logo variant="escudo" className="h-16 md:h-24" />
          </div>
          {NAV.map((item, i) => {
            const inner = (
              <span className="group flex items-baseline gap-5">
                <span className="font-display text-sm font-bold text-alltak-blue">0{i + 1}</span>
                <span className="font-display text-5xl font-black uppercase leading-[1.05] text-white transition-all duration-300 group-hover:translate-x-4 group-hover:text-alltak-blue sm:text-6xl md:text-7xl">
                  {t(item.tkey)}
                </span>
                {item.external && <span className="text-2xl text-white/40">↗</span>}
              </span>
            )
            return (
              <div
                key={item.label}
                className="overflow-hidden border-b border-white/10 py-2"
                style={{
                  transform: open ? 'translateY(0)' : 'translateY(110%)',
                  opacity: open ? 1 : 0,
                  transition: `transform .7s cubic-bezier(.2,.7,.1,1) ${120 + i * 70}ms, opacity .5s ease ${120 + i * 70}ms`,
                }}
              >
                {item.external ? (
                  <a href={item.to} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                ) : (
                  <Link to={item.to}>{inner}</Link>
                )}
              </div>
            )
          })}

          <div
            className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/50"
            style={{
              opacity: open ? 1 : 0,
              transition: `opacity .6s ease ${120 + NAV.length * 70}ms`,
            }}
          >
            <span className="font-display font-bold uppercase tracking-[0.3em]">Alltak®</span>
            <span>Envelopamento · Decoração · Comunicação Visual</span>
          </div>
        </nav>
      </div>
    </>
  )
}
