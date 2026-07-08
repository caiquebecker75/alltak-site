import { Link } from 'react-router-dom'
import { UNITS, CATALOGS, HIGHLIGHTS, YOUTUBE_URL } from '../data/site'
import BusinessUnit from '../components/BusinessUnit'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'

export default function Home() {
  return (
    <>
      {/* 1 — BANNER PRINCIPAL */}
      <Hero />

      {/* 2 — UNIDADES DE NEGÓCIO */}
      <div id="unidades">
        <div className="container-x pt-16 text-center md:pt-24">
          <Reveal>
            <p className="eyebrow text-alltak-red">Três frentes, um só padrão</p>
            <h2 className="mt-3 text-5xl text-white md:text-6xl">Unidades de negócio</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Wraps, Decor e Signs: linhas dedicadas para envelopamento veicular,
              revestimento de ambientes e comunicação visual.
            </p>
          </Reveal>
        </div>
        {UNITS.map((unit, i) => (
          <BusinessUnit key={unit.key} unit={unit} index={i} />
        ))}
      </div>

      {/* 3 — BLOCO DE INSPIRAÇÃO / VÍDEO INSTITUCIONAL */}
      <section className="relative overflow-hidden bg-alltak-ink">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('./assets/automotivo_02.avif')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-alltak-black/70" aria-hidden />
        <div className="container-x relative flex flex-col items-center py-24 text-center md:py-32">
          <Reveal>
            <p className="eyebrow text-alltak-red">Veja na prática</p>
            <h2 className="mt-3 max-w-3xl text-5xl text-white md:text-7xl">
              Aplicações reais, <span className="text-alltak-red">resultado impecável</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Inspiração e prova visual do que é possível com os materiais Alltak.
              Acompanhe aplicações, técnicas e transformações no nosso canal.
            </p>
            <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-white mt-9">
              <span className="text-alltak-red">▶</span> Assistir no YouTube
            </a>
          </Reveal>
        </div>
      </section>

      {/* 4 — CATÁLOGOS */}
      <section className="bg-alltak-mist py-20 text-alltak-black md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Materiais de apoio</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-5xl md:text-6xl">Catálogos</h2>
              <Link to="/catalogos" className="font-display text-sm font-bold uppercase tracking-wide text-alltak-red hover:underline">
                Ver todos os catálogos →
              </Link>
            </div>
            <p className="mt-3 max-w-2xl text-alltak-black/60">
              Organizados por linha para facilitar a escolha do produto certo.
              Baixe, consulte e resolva rápido na especificação e na aplicação.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATALOGS.slice(0, 4).map((c, i) => (
              <Reveal key={c.name} delay={i * 80}>
                <div className="group flex h-full flex-col justify-between border border-black/10 bg-white p-6 transition hover:border-alltak-red hover:shadow-lg">
                  <div>
                    <div className="mb-4 h-1.5 w-12 bg-alltak-red clip-slant" />
                    <h3 className="text-2xl text-alltak-black">{c.name}</h3>
                    <p className="mt-2 text-sm text-alltak-black/60">{c.desc}</p>
                  </div>
                  <Link to="/catalogos" className="btn-trapezoid btn-red mt-6 self-start !py-2 !text-xs">
                    Baixar catálogo
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — CONTEÚDOS COMPLEMENTARES / DESTAQUES */}
      <section className="bg-alltak-black py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-alltak-red">Explore</p>
            <h2 className="text-5xl text-white md:text-6xl">Onde a Alltak te leva</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {HIGHLIGHTS.map((h, i) => {
              const inner = (
                <div className="group flex h-full flex-col justify-between border border-white/10 bg-white/[0.03] p-6 transition hover:border-alltak-red hover:bg-white/[0.06]">
                  <div>
                    <div className="mb-4 h-1.5 w-12 bg-alltak-red clip-slant" />
                    <h3 className="text-2xl text-white">{h.title}</h3>
                    <p className="mt-2 text-sm text-white/60">{h.desc}</p>
                  </div>
                  <span className="mt-6 font-display text-sm font-bold uppercase tracking-wide text-alltak-red">
                    Acessar →
                  </span>
                </div>
              )
              return (
                <Reveal key={h.title} delay={i * 70}>
                  {h.external ? (
                    <a href={h.to} target="_blank" rel="noreferrer" className="block h-full">{inner}</a>
                  ) : (
                    <Link to={h.to} className="block h-full">{inner}</Link>
                  )}
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6 — SOBRE NÓS (âncora) */}
      <section id="sobre" className="relative overflow-hidden bg-alltak-navy py-20 md:py-28">
        <div className="container-x grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-alltak-blue">Sobre nós</p>
            <h2 className="mt-3 text-5xl text-white md:text-6xl">
              Produção nacional,<br /><span className="text-alltak-blue">padrão de verdade</span>
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-white/70">
              A Alltak desenvolve e produz materiais adesivos para envelopamento,
              decoração e comunicação visual. Estrutura própria, produção nacional e
              linhas completas — Wraps, Decor e Signs — pensadas para quem vive de
              aplicação e precisa manter o padrão do começo ao fim.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {['Produção nacional', 'Linhas completas', 'Acabamento constante', 'Suporte técnico'].map((d) => (
                <li key={d} className="flex items-center gap-2 text-sm text-white/80">
                  <span className="h-2 w-2 bg-alltak-red" /> {d}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="aspect-[4/5] w-full overflow-hidden clip-trapezoid">
              <img src="./assets/sobre_01.avif" alt="Produção nacional Alltak" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
