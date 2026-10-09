import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { Link } from 'react-router-dom'
import caveira from '../brand/caveira-simbolo.png'
import { useT } from '../i18n'

// número + chave do texto (dict-paginas.ts)
const STATS = [
  ['2017', 'sobre.stat.fundacao'],
  ['7.500 m²', 'sobre.stat.producao'],
  ['100%', 'sobre.stat.nacional'],
  ['3', 'sobre.stat.continentes'],
]

const LINHAS = [
  'sobre.linha.envelopamento',
  'sobre.linha.decoracao',
  'sobre.linha.sign',
  'sobre.linha.comunicacao',
  'sobre.linha.impressao',
  'sobre.linha.laminacao',
  'sobre.linha.tecnicas',
]

const VALORES = [
  'sobre.valor.inovacao', 'sobre.valor.etica', 'sobre.valor.respeito',
  'sobre.valor.uniao', 'sobre.valor.agilidade', 'sobre.valor.qualidade',
]

export default function Sobre() {
  const t = useT()
  return (
    <>
      <PageHeader eyebrow={t('sobre.eyebrow')} title={t('sobre.titulo')}>
        {t('sobre.headerSub')}
      </PageHeader>

      {/* História */}
      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="eyebrow text-alltak-blueDark">{t('sobre.historiaTag')}</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{t('sobre.historiaTitulo')}</h2>
              <div className="mt-5 space-y-4 text-alltak-black/75">
                <p>{t('sobre.historia1')}</p>
                <p>{t('sobre.historia2')}</p>
                <p>{t('sobre.historia3')}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(([n, d], i) => (
                <div
                  key={n}
                  className={`border border-black/10 bg-white p-6 ${i % 2 ? 'mt-6' : ''}`}
                >
                  <div className="mb-3 h-1.5 w-12 bg-alltak-blue clip-slant" />
                  <div className="font-display text-4xl font-black text-alltak-blueDark md:text-5xl">{n}</div>
                  <p className="mt-1 text-sm text-alltak-black/60">{t(d)}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Missão / Visão */}
      <section className="relative overflow-hidden bg-alltak-black py-16 md:py-24">
        <img
          src={caveira}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 h-96 w-auto -translate-y-1/2 opacity-[0.05]"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <div className="container-x relative grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="h-full border border-white/10 bg-white/[0.03] p-8">
              <p className="eyebrow text-alltak-blue">{t('sobre.missao')}</p>
              <p className="mt-4 text-xl leading-relaxed text-white/85 md:text-2xl">
                {t('sobre.missaoTexto')}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full border border-white/10 bg-white/[0.03] p-8">
              <p className="eyebrow text-alltak-blue">{t('sobre.visao')}</p>
              <p className="mt-4 text-xl leading-relaxed text-white/85 md:text-2xl">
                {t('sobre.visaoTexto')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-alltak-navyDeep py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-alltak-blue">{t('sobre.valoresTag')}</p>
            <h2 className="mt-3 text-4xl text-white md:text-5xl">{t('sobre.valoresTitulo')}</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {VALORES.map((v, i) => (
              <Reveal key={v} delay={i * 60}>
                <div className="flex items-center gap-3 border border-white/10 bg-white/[0.03] p-5">
                  <span className="font-display text-lg font-black text-alltak-blue">0{i + 1}</span>
                  <span className="font-display text-xl font-bold uppercase text-white">{t(v)}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Linhas */}
      <section className="bg-alltak-black py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-alltak-blue">{t('sobre.linhasTag')}</p>
            <h2 className="mt-3 text-4xl text-white md:text-5xl">{t('sobre.linhasTitulo')}</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-3">
            {LINHAS.map((l, i) => (
              <Reveal key={l} delay={i * 50}>
                <span className="btn-trapezoid btn-outline pointer-events-none !py-2 !text-xs">{t(l)}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sustentabilidade */}
      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="eyebrow text-alltak-blueDark">{t('sobre.sustTag')}</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{t('sobre.sustTitulo')}</h2>
              <div className="mt-5 space-y-4 text-alltak-black/75">
                <p>{t('sobre.sust1')}</p>
                <p>{t('sobre.sust2')}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="border-l-4 border-alltak-blue bg-white p-8">
              <div className="font-display text-5xl font-black text-alltak-blueDark md:text-6xl">♻</div>
              <p className="mt-4 font-display text-2xl font-bold uppercase leading-tight">
                {t('sobre.sustCard')}
              </p>
              <p className="mt-2 text-sm text-alltak-black/60">
                {t('sobre.sustCardTexto')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alltak-black py-16 md:py-20">
        <div className="container-x flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-12 md:flex-row md:items-center">
          <h2 className="max-w-xl text-3xl text-white md:text-4xl">
            {t('sobre.ctaTitulo')}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/contato" className="btn-trapezoid btn-blue">{t('sobre.ctaFale')}</Link>
            <Link to="/onde-comprar" className="btn-trapezoid btn-outline">{t('cta.ondeComprar')}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
