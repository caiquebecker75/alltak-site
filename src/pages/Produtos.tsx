import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import ColorExplorer from '../components/ColorExplorer'
import { PRODUCT_CATEGORIES, STORE_URL } from '../data/site'
import linhas from '../data/wp/linhas.json'
import { useI18n } from '../i18n'

type LinhaT = { categoria: string; slug: string; nome: string }

const CATEGORY_IMAGE: Record<string, string> = {
  automotivo: './assets/automotivo_03.avif',
  arquitetura: './assets/decor_02.avif',
  impressao: './assets/sign_03.avif',
  'sign-design': './assets/sign_02.avif',
  'aplicacoes-tecnicas': './assets/decor_03.avif',
  'wrap-care': './assets/automotivo_02.avif',
  acessorios: './assets/decor_01.avif',
}

export default function Produtos() {
  const { t, tv } = useI18n()
  return (
    <>
      <PageHeader eyebrow={t('prod.eyebrow')} title={t('nav.produtos')}>
        {t('prod.headerSub')}
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#cores" className="btn-trapezoid btn-blue !py-2.5 !text-sm">
            {t('prod.explorarCores')}
          </a>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-navy !py-2.5 !text-sm">
            {t('prod.comprarStore')}
          </a>
          <Link to="/onde-comprar" className="btn-trapezoid btn-outline !py-2.5 !text-sm">
            {t('cta.ondeComprar')}
          </Link>
        </div>
      </PageHeader>

      {/* Vitrine de categorias */}
      <section className="bg-alltak-black py-16 md:py-20">
        <div className="container-x space-y-16">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug}>
              <div id={`cat-${cat.slug}`} className="grid scroll-mt-28 items-start gap-8 md:grid-cols-5">
                <div className={`md:col-span-2 ${i % 2 ? 'md:order-2' : ''}`}>
                  <div className="frame-trap aspect-[4/3] cursor-hot">
                    <img src={CATEGORY_IMAGE[cat.slug]} alt={cat.name} loading="lazy" className="img-zoom" />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h2 className="text-4xl text-white md:text-5xl">{tv(cat.name)}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(linhas as LinhaT[]).filter((l) => l.categoria === cat.slug).map((l) => (
                      <Link
                        key={l.slug}
                        to={`/produtos/${l.categoria}/${l.slug}`}
                        className="border border-white/15 px-3 py-1.5 text-sm font-display font-semibold uppercase tracking-wide text-white/70 transition hover:border-alltak-blue hover:text-white"
                      >
                        {l.nome}
                      </Link>
                    ))}
                    {(linhas as LinhaT[]).filter((l) => l.categoria === cat.slug).length === 0 &&
                      cat.items.map((it) => (
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
          <p className="eyebrow text-alltak-blue">{t('cores.eyebrow')}</p>
          <h2 className="mt-3 text-4xl text-white md:text-6xl">{t('prod.todasCores')}</h2>
          <p className="mt-3 max-w-2xl text-white/60">{t('prod.todasCoresSub')}</p>
          <div className="mt-8">
            <ColorExplorer />
          </div>
        </div>
      </section>
    </>
  )
}
