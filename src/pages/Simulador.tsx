import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { useT } from '../i18n'

// "Simule agora": porta de entrada dos dois simuladores — o carro 3D
// (Visualizador, linha automotiva) e os ambientes e móveis (Decoração).

const OPCOES = [
  // fotos de aplicação do catálogo; a de decor tem um recorte branco no canto
  // de cima, que o zoom ancorado embaixo à esquerda deixa de fora
  { to: '/visualizador', img: './colors/wraps/18S41M_ap.jpg', chave: 'auto', zoom: '' },
  { to: '/decoracao', img: './colors/decor/977D85_ap.jpg', chave: 'decor', zoom: 'origin-bottom-left scale-[1.35]' },
] as const

export default function Simulador() {
  const t = useT()
  return (
    <>
      <PageHeader eyebrow={t('sim.eyebrow')} title={t('nav.simule')}>
        {t('sim.headerSub')}
      </PageHeader>
      <section className="bg-alltak-black pb-20 pt-6 md:pb-28">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {OPCOES.map((o, i) => (
            <Reveal key={o.to} delay={i * 120}>
              <Link to={o.to} className="group relative block overflow-hidden border border-white/10 bg-alltak-coal">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={o.img} alt={t(`sim.${o.chave}.titulo`)}
                    className={`h-full w-full object-cover opacity-85 transition duration-700 group-hover:opacity-100 ${o.zoom}`} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="eyebrow !text-white/80">{t(`sim.${o.chave}.eyebrow`)}</p>
                  <h2 className="mt-1 text-5xl text-white md:text-6xl">{t(`sim.${o.chave}.titulo`)}</h2>
                  <p className="mt-2 max-w-md text-base text-white/75">{t(`sim.${o.chave}.texto`)}</p>
                  <span className="btn-trapezoid btn-blue mt-5">{t('sim.comecar')} →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
