import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { STORE_URL } from '../data/site'
import { useT } from '../i18n'

// Página da linha RevestFácil (lançamento). Só o que é fato do produto:
// revestimento vinílico adesivo para renovar superfícies sem obra. Os padrões
// e a ficha técnica entram aqui quando a Alltak publicar a linha completa.

const FOTOS = [
  { src: './assets/campanhas/revestfacil-amostras.jpg', alt: 'rf.altAmostras' },
  { src: './assets/campanhas/revestfacil-foto.jpg', alt: 'rf.altPdv' },
]

const ONDE = ['rf.onde.paredes', 'rf.onde.armarios', 'rf.onde.bancadas', 'rf.onde.moveis']

export default function RevestFacil() {
  const t = useT()
  return (
    <>
      <section className="relative overflow-hidden bg-alltak-navyDeep pb-16 pt-32 md:pb-24 md:pt-40">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(60% 80% at 80% 30%, rgba(0,85,170,0.45), transparent 70%)' }}
          aria-hidden
        />
        <div className="container-x relative grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t('banner.lancamento')}</p>
            <h1 className="sr-only">Alltak RevestFácil</h1>
            <img
              src="./assets/campanhas/revestfacil-logo.png"
              alt={t('rf.altLogo')}
              className="mt-5 h-auto w-full max-w-md"
            />
            <p className="mt-8 max-w-xl text-lg text-white/75">{t('rf.intro')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/onde-comprar" className="btn-trapezoid btn-blue">{t('cta.ondeComprar')}</Link>
              <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline">
                Alltak Store ↗
              </a>
            </div>
          </Reveal>
          {/* as duas fotos em paralelogramo, mesma inclinação do banner da home */}
          <Reveal delay={120}>
            <div className="relative mx-auto aspect-[39/40] w-full max-w-lg">
              {FOTOS.map((f, i) => (
                <div
                  key={f.src}
                  className="absolute overflow-hidden"
                  style={{
                    left: i ? '38.5%' : 0, top: i ? '24%' : '4%', width: i ? '61.5%' : '71.8%', height: i ? '72%' : '84%',
                    clipPath: 'polygon(45.7% 0, 100% 0, calc(100% - 45.7%) 100%, 0 100%)',
                  }}
                >
                  <img src={f.src} alt={t(f.alt)} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-alltak-black py-16 md:py-20">
        <div className="container-x grid gap-10 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t('rf.ondeTag')}</p>
            <h2 className="mt-3 text-4xl text-white md:text-5xl">{t('rf.ondeTitulo')}</h2>
            <p className="mt-4 max-w-lg text-white/65">{t('rf.ondeTexto')}</p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {ONDE.map((k) => (
                <li key={k} className="flex items-center gap-4 py-4 font-display text-xl font-bold uppercase text-white">
                  <span className="h-3 w-5 bg-alltak-blue clip-tz" aria-hidden />
                  {t(k)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 bg-alltak-black py-14">
        <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl text-white md:text-4xl">{t('rf.duvidas')}</h2>
            <p className="mt-2 text-white/60">{t('rf.duvidasTexto')}</p>
          </div>
          <Link to="/contato" className="btn-trapezoid btn-blue">{t('cta.falarConosco')}</Link>
        </div>
      </section>
    </>
  )
}
