import { Link } from 'react-router-dom'
import { UNITS, CATALOGS, HIGHLIGHTS, YOUTUBE_URL } from '../data/site'
import BusinessUnit from '../components/BusinessUnit'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import Parallax from '../components/Parallax'
import Logo from '../components/Logo'
import CarSVG from '../components/CarSVG'

const STATS = [
  ['+30', 'anos de estrada'],
  ['+120', 'cores e padrões'],
  ['3', 'unidades de negócio'],
  ['BR', 'produção nacional'],
]

export default function Home() {
  return (
    <>
      {/* 1 — BANNER PRINCIPAL */}
      <Hero />

      {/* Marquee strip */}
      <div className="border-y border-black bg-alltak-blue py-3 text-alltak-black">
        <Marquee items={['Envelopamento', 'Decoração', 'Comunicação Visual', 'Alltak Wraps', 'Alltak Decor', 'Alltak Signs']} />
      </div>

      {/* 2 — UNIDADES DE NEGÓCIO */}
      <div id="unidades">
        <div className="container-x pt-16 text-center md:pt-24">
          <Reveal dir="scale">
            <span className="tag">Três frentes, um só padrão</span>
            <h2 className="mt-4 text-5xl text-white md:text-7xl">Unidades de negócio</h2>
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

      {/* NÚMEROS */}
      <section className="border-y border-white/10 bg-alltak-coal py-14">
        <div className="container-x grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map(([n, l], i) => (
            <Reveal key={l} delay={i * 90} dir="up" className="text-center">
              <div className="font-display text-6xl font-extrabold text-alltak-blue md:text-7xl">{n}</div>
              <div className="mt-1 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/60">{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3 — INSPIRAÇÃO / VÍDEO */}
      <section className="relative overflow-hidden bg-alltak-ink">
        <Parallax speed={0.2} className="absolute inset-0">
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('./assets/automotivo_02.avif')" }}
            aria-hidden
          />
        </Parallax>
        <div className="absolute inset-0 bg-alltak-black/70" aria-hidden />
        <div className="container-x relative flex flex-col items-center py-24 text-center md:py-32">
          <Reveal>
            <span className="tag">Veja na prática</span>
            <h2 className="mt-4 max-w-3xl text-5xl text-white md:text-7xl">
              Aplicações reais,<br /><span className="text-alltak-blue">resultado impecável</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Inspiração e prova visual do que é possível com os materiais Alltak.
              Acompanhe aplicações, técnicas e transformações no nosso canal.
            </p>
            <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-white mt-9">
              <span className="text-alltak-blue">▶</span> Assistir no YouTube
            </a>
          </Reveal>
        </div>
      </section>

      {/* 3.5 — TEASER DO VISUALIZADOR */}
      <section className="relative overflow-hidden bg-alltak-black py-20 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] bg-cover bg-center"
          style={{ backgroundImage: "url('./assets/caveiras.avif')" }}
          aria-hidden
        />
        <div className="container-x relative grid items-center gap-10 md:grid-cols-2">
          <Reveal dir="left">
            <span className="tag">Novo · Ferramenta Alltak</span>
            <h2 className="mt-4 text-5xl text-white md:text-6xl">
              Visualize o<br /><span className="text-alltak-blue">envelopamento</span>
            </h2>
            <p className="mt-5 max-w-lg text-white/70">
              Escolha o acabamento e a cor e veja na hora como fica no veículo. Brilho,
              fosco, acetinado, metálico, carbono, cromado e camaleão — tudo em um só lugar.
            </p>
            <Link to="/visualizador" className="btn-trapezoid btn-blue mt-8">Abrir o visualizador</Link>
          </Reveal>
          <Reveal delay={120} dir="right">
            <div className="group relative border border-white/10 bg-gradient-to-b from-alltak-navy/40 to-black p-4">
              <div className="pointer-events-none absolute inset-x-10 bottom-6 h-14 rounded-[50%] bg-alltak-blue/25 blur-2xl" aria-hidden />
              <div className="transition-transform duration-500 group-hover:-translate-y-1">
                <CarSVG model="coupe" color="#0080ff" finish="brilho" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 — CATÁLOGOS */}
      <section className="bg-alltak-cream py-20 text-alltak-black md:py-28">
        <div className="container-x">
          <Reveal>
            <span className="tag">Materiais de apoio</span>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-5xl md:text-6xl">Catálogos</h2>
              <Link to="/catalogos" className="link-underline font-display text-sm font-bold uppercase tracking-wide text-alltak-blueDark">
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
                <div className="card-hover hover-lift flex h-full flex-col justify-between border border-black/10 bg-white p-6 hover:shadow-xl">
                  <div>
                    <div className="mb-4 h-2 w-14 bg-alltak-blue clip-slant" />
                    <h3 className="text-2xl text-alltak-black">{c.name}</h3>
                    <p className="mt-2 text-sm text-alltak-black/60">{c.desc}</p>
                  </div>
                  <Link to="/catalogos" className="btn-trapezoid btn-blue mt-6 self-start !py-2 !text-xs">
                    Baixar catálogo
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* reverse marquee */}
      <div className="border-y border-white/10 bg-alltak-navy py-3 text-white">
        <Marquee reverse items={['Ultra', 'Satin', 'Carbon', 'Kroma', 'Klear', 'FX', 'Jateado', 'Wrap Care']} />
      </div>

      {/* 5 — DESTAQUES */}
      <section className="bg-alltak-black py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <span className="tag">Explore</span>
            <h2 className="mt-4 text-5xl text-white md:text-6xl">Onde a Alltak te leva</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {HIGHLIGHTS.map((h, i) => {
              const inner = (
                <div className="card-hover hover-lift flex h-full flex-col justify-between border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]">
                  <div>
                    <div className="mb-4 h-2 w-12 bg-alltak-blue clip-slant" />
                    <h3 className="text-2xl text-white">{h.title}</h3>
                    <p className="mt-2 text-sm text-white/60">{h.desc}</p>
                  </div>
                  <span className="mt-6 font-display text-sm font-bold uppercase tracking-wide text-alltak-blue">
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
          <Reveal dir="left">
            <span className="tag">Sobre nós</span>
            <h2 className="mt-4 text-5xl text-white md:text-6xl">
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
                  <span className="h-3 w-4 bg-alltak-blue clip-escudo" /> {d}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} dir="right">
            <div className="group aspect-[4/5] w-full overflow-hidden clip-trapezoid">
              <img
                src="./assets/sobre_01.avif"
                alt="Produção nacional Alltak"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 — CTA FINAL com ESCUDO */}
      <section className="relative overflow-hidden bg-alltak-black py-24 text-center">
        <Parallax speed={0.12} className="absolute inset-0">
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('./assets/caveiras.avif')" }}
            aria-hidden
          />
        </Parallax>
        <div className="container-x relative">
          <Reveal dir="scale">
            <Logo variant="escudo" className="mx-auto h-14 md:h-16" />
            <h2 className="mt-8 text-5xl text-white md:text-7xl">
              Pronto para <span className="text-alltak-blue">transformar</span>?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/produtos" className="btn-trapezoid btn-blue">Ver produtos</Link>
              <Link to="/onde-comprar" className="btn-trapezoid btn-outline">Onde comprar</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
