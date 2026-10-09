import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORIES } from '../data/site'
import { onScrollChange } from '../lib/onScrollChange'
import { useI18n } from '../i18n'

// As fotos já vêm recortadas em trapézio (transparência no próprio arquivo),
// alternando a orientação: base larga embaixo, depois base larga em cima.
// A ordem abaixo segue essa alternância na sequência de PRODUCT_CATEGORIES,
// para os cards formarem o zigue-zague do formato 01 sem hexágonos.
const CATEGORY_IMAGE: Record<string, string> = {
  automotivo: './assets/automotivo_03.avif',
  arquitetura: './assets/decor_02.avif',
  impressao: './assets/sign_03.avif',
  'sign-design': './assets/sign_02.avif',
  'aplicacoes-tecnicas': './assets/decor_03.avif',
  'wrap-care': './assets/automotivo_02.avif',
  acessorios: './assets/decor_01.avif',
}
// destino de cada card: segmentos com cartela vão direto para as cores da
// linha; os demais, para a página do segmento (mesmo formato de Cores)
const DESTINO: Record<string, string> = {
  automotivo: '/cores?linha=wraps',
  arquitetura: '/cores?linha=decor',
  impressao: '/cores?linha=signs',
  'sign-design': '/cores?linha=signs',
}
const destino = (slug: string) => DESTINO[slug] ?? `/linhas/${slug}`

const RECORTE = {
  // mesmo contorno do recorte das fotos; aqui só contém o brilho do hover
  baseLargaEmbaixo: 'polygon(28.5% 0, 71.5% 0, 100% 100%, 0 100%)',
  baseLargaEmCima: 'polygon(0 0, 100% 0, 71.5% 100%, 28.5% 100%)',
}

// fração do trecho fixado em que a faixa fica parada no início e no fim
const PAUSA = 0.12
// margem do container-x (max-w 1240px centralizado, px-5 / sm:px-8)
const MARGEM = 'max(1.25rem, calc((100vw - 1240px) / 2 + 2rem))'

// Horizontal scroll gallery: the page keeps scrolling vertically while the
// track slides sideways through the product categories.
export default function HScroll() {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [x, setX] = useState(0)
  const [pct, setPct] = useState(0)
  const { t, tv } = useI18n()

  useEffect(() => {
    return onScrollChange(() => {
      const el = wrap.current
      const tr = track.current
      if (!el || !tr) return
      const r = el.getBoundingClientRect()
      const total = r.height - innerHeight
      const bruto = Math.min(1, Math.max(0, -r.top / total))
      // "travinha": ao fixar, a faixa fica parada um pouco antes de começar a
      // andar para o lado (e de novo no fim), para o 1º card entrar inteiro
      const p = Math.min(1, Math.max(0, (bruto - PAUSA) / (1 - 2 * PAUSA)))
      setX(-p * Math.max(0, tr.scrollWidth - innerWidth))
      setPct(p)
    })
  }, [])

  return (
    <div ref={wrap} className="relative bg-alltak-cream" style={{ height: '340vh' }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x mb-8 flex items-end justify-between">
          <div>
            <span className="tag">{t('hscroll.tag')}</span>
            <h2 className="mt-4 text-5xl text-alltak-black md:text-7xl">{t('hscroll.titulo')}</h2>
          </div>
          <div className="hidden font-display text-sm font-bold uppercase tracking-widest text-alltak-black/50 md:block">
            {String(Math.round(pct * 100)).padStart(3, '0')} / 100 — {t('hscroll.role')}
          </div>
        </div>

        <div
          ref={track}
          className="flex w-max gap-3 will-change-transform"
          // começa alinhada ao título (mesma margem do container) e termina
          // com a mesma folga à direita
          style={{ paddingLeft: MARGEM, paddingRight: MARGEM, transform: `translate3d(${x}px,0,0)` }}
        >
          {PRODUCT_CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              to={destino(c.slug)}
              className="group block w-[72vw] shrink-0 sm:w-[44vw] lg:w-[30vw]"
            >
              {/* alternating trapezoids (format 01), same proportion as the photos */}
              <div
                className="frame-trap aspect-[682/537]"
                style={{ clipPath: i % 2 === 0 ? RECORTE.baseLargaEmbaixo : RECORTE.baseLargaEmCima }}
              >
                <img src={CATEGORY_IMAGE[c.slug]} alt={tv(c.name)} loading="lazy" className="opacity-95 group-hover:opacity-100" />
              </div>
              <div className="mt-3 flex items-end justify-between px-2">
                <div>
                  <div className="font-display text-sm font-bold uppercase tracking-[0.22em] text-alltak-black/60">
                    0{i + 1} · {c.items.length} {t(c.items.length === 1 ? 'hscroll.produto' : 'hscroll.produtos')}
                  </div>
                  <h3 className="mt-0.5 text-2xl text-alltak-black md:text-3xl">{tv(c.name)}</h3>
                </div>
                <span className="font-display text-sm font-bold uppercase text-alltak-blueDark opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {t('hscroll.ver')}
                </span>
              </div>
            </Link>
          ))}

          {/* end card */}
          <Link to="/cores" className="group flex w-[60vw] shrink-0 items-center justify-center sm:w-[34vw]">
            <div className="text-center">
              <div className="font-display text-6xl font-black text-alltak-black md:text-8xl">
                +120
              </div>
              <div className="font-display text-sm font-bold uppercase tracking-[0.3em] text-alltak-black/60">
                {t('home.stat.cores')}
              </div>
              <span className="btn-trapezoid btn-navy mt-6">{t('hscroll.verTudo')}</span>
            </div>
          </Link>
        </div>

        {/* progress bar */}
        <div className="container-x mt-10">
          <div className="h-1 w-full bg-alltak-black/10">
            <div className="h-full bg-alltak-blue transition-[width] duration-100" style={{ width: `${pct * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
