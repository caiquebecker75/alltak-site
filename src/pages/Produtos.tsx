import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import ColorDetail from '../components/ColorDetail'
import { PRODUCT_CATEGORIES, STORE_URL } from '../data/site'
import { COLORS, type Color } from '../data/catalog'

const CATEGORY_IMAGE: Record<string, string> = {
  automotivo: './assets/automotivo_03.avif',
  arquitetura: './assets/decor_02.avif',
  impressao: './assets/sign_02.avif',
  'sign-design': './assets/sign_03.avif',
  'aplicacoes-tecnicas': './assets/automotivo_02.avif',
  'wrap-care': './assets/decor_03.avif',
  acessorios: './assets/decor_01.avif',
}

// Which catalog line feeds each product category's color grid.
const CATEGORY_LINE: Record<string, Color['line'] | undefined> = {
  automotivo: 'wraps',
  arquitetura: 'decor',
  impressao: 'signs',
  'sign-design': 'signs',
}

const PREVIEW = 15 // colors shown before "ver todas"

export default function Produtos() {
  const [active, setActive] = useState<Color | null>(null)

  // colors grouped by line, memoized once
  const byLine = useMemo(() => {
    const m: Record<string, Color[]> = { wraps: [], decor: [], signs: [] }
    COLORS.forEach((c) => m[c.line]?.push(c))
    return m
  }, [])

  return (
    <>
      <PageHeader eyebrow="Portfólio completo" title="Produtos">
        Um portfólio completo para diferentes estilos e necessidades. Clique em uma cor
        para ver a foto do produto aplicado, o vídeo de aplicação e baixar o boletim técnico.
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/cores" className="btn-trapezoid btn-blue !py-2 !text-xs">
            Explorar todas as cores →
          </Link>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-navy !py-2 !text-xs">
            Comprar na Alltak Store ↗
          </a>
          <Link to="/onde-comprar" className="btn-trapezoid btn-outline !py-2 !text-xs">
            Onde comprar
          </Link>
        </div>
      </PageHeader>

      <section className="bg-alltak-black py-16 md:py-24">
        <div className="container-x space-y-16">
          {PRODUCT_CATEGORIES.map((cat, i) => {
            const line = CATEGORY_LINE[cat.slug]
            const colors = line ? byLine[line] : []
            const shown = colors.slice(0, PREVIEW)
            return (
              <Reveal key={cat.slug}>
                <div className="grid items-start gap-8 md:grid-cols-5">
                  <div className={`md:col-span-2 ${i % 2 ? 'md:order-2' : ''}`}>
                    <div className="frame-trap aspect-[4/3] cursor-hot">
                      <img src={CATEGORY_IMAGE[cat.slug]} alt={cat.name} loading="lazy" className="img-zoom" />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <h2 className="text-4xl text-white md:text-5xl">{cat.name}</h2>

                    {/* linhas da categoria */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cat.items.map((it) => (
                        <span
                          key={it}
                          className="border border-white/15 px-3 py-1.5 text-sm font-display font-semibold uppercase tracking-wide text-white/70"
                        >
                          {it}
                        </span>
                      ))}
                    </div>

                    {colors.length > 0 ? (
                      <>
                        <p className="mt-6 text-sm text-white/50">
                          {colors.length} cores nesta linha · clique para ver o produto aplicado
                        </p>
                        <div className="mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-6 lg:grid-cols-8">
                          {shown.map((c) => (
                            <button
                              key={`${c.line}-${c.code}-${c.name}`}
                              onClick={() => setActive(c)}
                              title={`${c.name} · ${c.code}`}
                              aria-label={c.name}
                              className="group relative aspect-square overflow-hidden border border-white/15 transition hover:border-alltak-blue"
                            >
                              <img
                                src={c.swatch}
                                alt={c.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </button>
                          ))}
                          {colors.length > PREVIEW && (
                            <Link
                              to="/cores"
                              className="flex aspect-square items-center justify-center border border-alltak-blue/50 bg-alltak-blue/10 text-center font-display text-[11px] font-bold uppercase leading-tight tracking-wide text-alltak-blue hover:bg-alltak-blue/20"
                            >
                              +{colors.length - PREVIEW}<br />ver todas
                            </Link>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="mt-6 text-sm text-white/55">
                        Linha técnica. Especificações completas no catálogo oficial.
                        <Link to="/catalogos" className="ml-2 font-display font-bold uppercase text-alltak-blue link-underline">
                          Baixar catálogo →
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {active && <ColorDetail color={active} onClose={() => setActive(null)} />}
    </>
  )
}
