import { Link } from 'react-router-dom'
import { YOUTUBE_URL, STORE_URL } from '../data/site'
import BannerRoll from '../components/BannerRoll'
import BrandFamily from '../components/BrandFamily'
import StickyUnits from '../components/StickyUnits'
import HScroll from '../components/HScroll'
import Marquee from '../components/Marquee'
import Parallax from '../components/Parallax'
import Reveal from '../components/Reveal'
import SplitWords from '../components/SplitWords'
import Counter from '../components/Counter'
import Magnetic from '../components/Magnetic'
import Logo from '../components/Logo'
import CarSVG from '../components/CarSVG'
import TrapDivider from '../components/TrapDivider'

export default function Home() {
  return (
    <>
      {/* ============ 1 — HERO: slogan + lightweight CSS scene ============ */}
      <section className="relative flex h-[100svh] min-h-[640px] flex-col justify-center overflow-hidden bg-black">
        {/* skull texture floor */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08] bg-cover bg-center"
          style={{ backgroundImage: "url('./assets/caveiras.avif')" }}
          aria-hidden
        />
        {/* lightweight floating trapezoids (CSS only — no 3D, keeps the home fast) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute left-[6%] top-[18%] h-40 w-64 rotate-6 bg-alltak-blue/10 clip-tz animate-floaty" />
          <div className="absolute right-[10%] top-[24%] h-28 w-52 -rotate-3 bg-alltak-blue/[0.07] clip-tz-alt animate-floaty" style={{ animationDelay: '1.2s' }} />
          <div className="absolute bottom-[16%] left-[16%] h-24 w-44 -rotate-6 border border-alltak-blue/20 clip-tz animate-floaty" style={{ animationDelay: '.6s' }} />
          <div className="absolute bottom-[22%] right-[18%] h-32 w-56 rotate-3 border border-alltak-blue/15 clip-tz-alt animate-floaty" style={{ animationDelay: '1.8s' }} />
        </div>
        {/* radial vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_45%,transparent_30%,rgba(0,0,0,.75)_100%)]" aria-hidden />

        <div className="container-x relative">
          <Reveal dir="up">
            <span className="tag">Alltak®</span>
          </Reveal>
          <h1 className="mt-6 font-display font-black uppercase leading-[0.82]">
            <span className="block text-[15vw] text-white md:text-[12vw]">For</span>
            <span className="block text-[15vw] text-outline-blue md:text-[12vw]">All</span>
            <span className="block text-[15vw] text-alltak-blue md:text-[12vw]">Surfaces</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Para qualquer superfície — envelopamento, decoração e comunicação visual.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Magnetic>
              <Link to="/visualizador" className="btn-trapezoid btn-blue !px-10 !py-4 !text-base">
                Visualizar envelopamento
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline !px-10 !py-4 !text-base">
                Alltak Store ↗
              </a>
            </Magnetic>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <div className="mx-auto h-10 w-6 rounded-full border border-white/30">
            <div className="mx-auto mt-1.5 h-2.5 w-1 animate-floaty rounded-full bg-alltak-blue" />
          </div>
          <div className="mt-2 font-display text-[10px] font-bold uppercase tracking-[0.35em] text-white/40">scroll</div>
        </div>
      </section>

      {/* marquee */}
      <div className="border-y border-black bg-alltak-blue py-4 text-black">
        <Marquee items={['Envelopamento', 'Decoração', 'Comunicação Visual', 'Wraps', 'Decor', 'Signs']} />
      </div>

      {/* banner roll-up — artes da marca deslizando com o scroll */}
      <BannerRoll />

      {/* alternating-trapezoid divider (format 01) */}
      <TrapDivider />

      {/* ============ 2 — MANIFESTO ============ */}
      <section className="bg-black py-24 md:py-36">
        <div className="container-x">
          <SplitWords
            as="h2"
            text="Não é só adesivo. É atitude aplicada em cada superfície."
            accent={['atitude', 'superfície']}
            className="max-w-5xl text-5xl text-white sm:text-6xl md:text-8xl"
          />
          <div className="mt-14 grid grid-cols-2 gap-10 border-t border-white/10 pt-10 md:grid-cols-4">
            {[
              [30, '+', 'anos de estrada'],
              [120, '+', 'cores e padrões'],
              [3, '', 'unidades de negócio'],
              [100, '%', 'produção nacional'],
            ].map(([n, suf, label], i) => (
              <Reveal key={String(label)} delay={i * 90}>
                <Counter
                  to={n as number}
                  suffix={suf as string}
                  className="font-display text-6xl font-black text-alltak-blue md:text-8xl"
                />
                <div className="mt-2 font-display text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                  {label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3 — UNIDADES (pinned trapezoid wipes) ============ */}
      <StickyUnits />

      {/* big reversed marquee */}
      <div className="border-y border-white/10 bg-black py-6 text-white/10">
        <Marquee big reverse invertSkull items={['Alltak Wraps', 'Alltak Decor', 'Alltak Signs']} />
      </div>

      {/* ============ 4 — VÍDEO / INSPIRAÇÃO (parallax) ============ */}
      <section className="relative overflow-hidden bg-alltak-ink">
        <Parallax speed={0.22} className="absolute inset-0">
          <div
            className="absolute inset-0 scale-125 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('./assets/automotivo_02.avif')" }}
            aria-hidden
          />
        </Parallax>
        <div className="absolute inset-0 bg-black/65" aria-hidden />
        <div className="container-x relative flex flex-col items-center py-28 text-center md:py-40">
          <Reveal dir="scale">
            <span className="tag">Veja na prática</span>
          </Reveal>
          <SplitWords
            as="h2"
            text="Aplicações reais, resultado impecável"
            accent={['impecável']}
            className="mt-6 max-w-4xl text-5xl text-white md:text-8xl"
          />
          <Reveal delay={200}>
            <Magnetic>
              <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-white mt-10 !px-10 !py-4">
                <span className="text-alltak-blue">▶</span> Assistir no YouTube
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ============ 5 — VISUALIZADOR teaser ============ */}
      <section className="relative overflow-hidden bg-alltak-navyDeep py-24 md:py-32">
        <div className="pointer-events-none absolute -left-24 top-10 h-48 w-96 rotate-6 bg-alltak-blue/10 clip-escudo" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-36 w-72 -rotate-6 bg-alltak-blue/10 clip-escudo" aria-hidden />
        <div className="container-x relative grid items-center gap-12 md:grid-cols-2">
          <Reveal dir="left">
            <span className="tag">Ferramenta exclusiva</span>
            <h2 className="mt-5 text-6xl text-white md:text-7xl">
              Pinte o carro<br /><span className="text-alltak-blue">sem tinta</span>
            </h2>
            <p className="mt-5 max-w-lg text-white/70">
              7 acabamentos, dezenas de cores, 3 silhuetas. Escolha, combine e veja o
              resultado na hora — antes de aplicar o primeiro metro de vinil.
            </p>
            <Magnetic>
              <Link to="/visualizador" className="btn-trapezoid btn-blue mt-8 !px-10 !py-4">
                Abrir o visualizador
              </Link>
            </Magnetic>
          </Reveal>
          <Reveal delay={140} dir="right">
            <div className="group relative">
              <div className="absolute inset-x-8 bottom-4 h-16 rounded-[50%] bg-alltak-blue/25 blur-2xl" aria-hidden />
              {/* lightweight 2D car (the live 3D lives inside the visualizer page) */}
              <div className="transition-transform duration-500 group-hover:-translate-y-2">
                <CarSVG model="coupe" color="#0080ff" finish="brilho" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 6 — LINHAS (horizontal scroll) ============ */}
      <HScroll />

      {/* ============ 6.5 — FAMÍLIA DE SUBMARCAS OFICIAIS ============ */}
      <BrandFamily />

      {/* ============ 7 — SOBRE (âncora) ============ */}
      <section id="sobre" className="relative overflow-hidden bg-alltak-navy py-24 md:py-32">
        <div className="pointer-events-none absolute -right-10 top-0 font-display text-[30vh] font-black leading-none text-white/5">
          BR
        </div>
        <div className="container-x grid items-center gap-12 md:grid-cols-2">
          <Reveal dir="left">
            <span className="tag">Sobre nós</span>
            <h2 className="mt-5 text-5xl text-white md:text-7xl">
              Produção nacional,<br /><span className="text-alltak-blue">padrão de verdade</span>
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-white/70">
              A Alltak desenvolve e produz materiais adesivos para envelopamento,
              decoração e comunicação visual. Estrutura própria, produção nacional e
              linhas completas — pensadas para quem vive de aplicação e precisa manter
              o padrão do começo ao fim.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Produção nacional', 'Linhas completas', 'Acabamento constante', 'Suporte técnico'].map((d) => (
                <li key={d} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="h-3 w-5 bg-alltak-blue clip-escudo" /> {d}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140} dir="right">
            <Parallax speed={-0.06}>
              <div className="frame-trap aspect-[4/5] w-full cursor-hot">
                <img src="./assets/sobre_01.avif" alt="Produção nacional Alltak" loading="lazy" className="img-zoom" />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* alternating-trapezoid divider (format 01) */}
      <TrapDivider />

      {/* ============ 8 — CTA FINAL ============ */}
      <section className="relative overflow-hidden bg-black py-28 text-center md:py-40">
        <Parallax speed={0.1} className="absolute inset-0">
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('./assets/caveiras.avif')" }}
            aria-hidden
          />
        </Parallax>
        <div className="container-x relative">
          <Reveal dir="scale">
            <Logo variant="escudo" className="mx-auto h-14 animate-floaty md:h-20" />
          </Reveal>
          <SplitWords
            as="h2"
            text="Pronto para transformar?"
            accent={['transformar']}
            className="mt-10 text-6xl text-white md:text-9xl"
          />
          <Reveal delay={220}>
            <div className="mt-10 flex flex-wrap justify-center gap-5">
              <Magnetic>
                <Link to="/produtos" className="btn-trapezoid btn-blue !px-10 !py-4">Ver produtos</Link>
              </Magnetic>
              <Magnetic>
                <Link to="/onde-comprar" className="btn-trapezoid btn-outline !px-10 !py-4">Onde comprar</Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
