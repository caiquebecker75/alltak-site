import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
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
        Um portfólio completo para diferentes estilos e necessidades, com foco em
        aplicação eficiente e resultado final impecável.
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-red !py-2 !text-xs">
            Comprar na Alltak Store ↗
          </a>
          <Link to="/onde-comprar" className="btn-trapezoid btn-outline !py-2 !text-xs">
            Onde comprar
          </Link>
        </div>
      </PageHeader>

      <section className="bg-alltak-black py-16 md:py-24">
        <div className="container-x space-y-14">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug}>
              <div className="grid items-center gap-8 md:grid-cols-5">
                <div className={`md:col-span-2 ${i % 2 ? 'md:order-2' : ''}`}>
                  <div className="aspect-[4/3] w-full overflow-hidden clip-trapezoid">
                    <img src={CATEGORY_IMAGE[cat.slug]} alt={cat.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h2 className="text-4xl text-white md:text-5xl">{cat.name}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cat.items.map((it) => (
                      <span key={it} className="border border-white/15 px-3 py-1.5 text-sm text-white/75">
                        {it}
                      </span>
                    ))}
                  </div>
                  <Link to="/catalogos" className="btn-trapezoid btn-red mt-6 !py-2 !text-xs">
                    Catálogo da linha
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
