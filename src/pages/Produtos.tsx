import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import ColorExplorer from '../components/ColorExplorer'
import { PRODUCT_CATEGORIES, STORE_URL } from '../data/site'

const CATEGORY_IMAGE: Record<string, string> = {
  automotivo: './assets/automotivo_03.avif',
  arquitetura: './assets/decor_02.avif',
  impressao: './assets/sign_02.avif',
  'sign-design': './assets/sign_03.avif',
  'aplicacoes-tecnicas': './assets/automotivo_02.avif',
  'wrap-care': './assets/decor_03.avif',
  acessorios: './assets/decor_01.avif',
}

export default function Produtos() {
  return (
    <>
      <PageHeader eyebrow="Portfólio completo" title="Produtos">
        Um portfólio completo para diferentes estilos e necessidades. Explore as linhas e
        clique em uma cor para ver a foto do produto aplicado, o vídeo de aplicação e baixar
        o boletim técnico.
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#cores" className="btn-trapezoid btn-blue !py-2 !text-xs">
            Explorar cores →
          </a>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-navy !py-2 !text-xs">
            Comprar na Alltak Store ↗
          </a>
          <Link to="/onde-comprar" className="btn-trapezoid btn-outline !py-2 !text-xs">
            Onde comprar
          </Link>
        </div>
      </PageHeader>

      {/* Vitrine de categorias */}
      <section className="bg-alltak-black py-16 md:py-20">
        <div className="container-x space-y-16">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug}>
              <div className="grid items-start gap-8 md:grid-cols-5">
                <div className={`md:col-span-2 ${i % 2 ? 'md:order-2' : ''}`}>
                  <div className="frame-trap aspect-[4/3] cursor-hot">
                    <img src={CATEGORY_IMAGE[cat.slug]} alt={cat.name} loading="lazy" className="img-zoom" />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h2 className="text-4xl text-white md:text-5xl">{cat.name}</h2>
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
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Explorador de cores completo (mesma experiência da aba Cores) */}
      <section id="cores" className="border-t border-white/10 bg-alltak-black pb-24 pt-14 md:pt-16">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">Gama completa</p>
          <h2 className="mt-3 text-4xl text-white md:text-6xl">Todas as cores</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Filtre por linha e família, busque por nome ou código e clique em qualquer cor
            para ver o produto aplicado, o vídeo e o boletim técnico.
          </p>
          <div className="mt-8">
            <ColorExplorer />
          </div>
        </div>
      </section>
    </>
  )
}
