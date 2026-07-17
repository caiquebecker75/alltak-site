import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { Link } from 'react-router-dom'
import caveira from '../brand/caveira-simbolo.png'

const STATS = [
  ['2017', 'Fundação, em Guarulhos (SP)'],
  ['7.500 m²', 'Dedicados à produção'],
  ['100%', 'Adesivos de fabricação nacional'],
  ['3', 'Continentes atendidos'],
]

const LINHAS = [
  'Envelopamento e Customização de Veículos',
  'Decoração',
  'Sign & Design',
  'Comunicação Visual',
  'Impressão',
  'Laminação',
  'Aplicações Técnicas',
]

const VALORES = ['Inovação', 'Ética', 'Respeito', 'União', 'Agilidade', 'Qualidade']

export default function Sobre() {
  return (
    <>
      <PageHeader eyebrow="Quem somos" title="Sobre a Alltak">
        Uma das principais fabricantes de adesivos do Brasil, especializada em envelopamento,
        decoração e comunicação visual. Do começo ao fim, com padrão Alltak.
      </PageHeader>

      {/* História */}
      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="eyebrow text-alltak-blueDark">Nossa história</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Adesivo nacional, padrão internacional</h2>
              <div className="mt-5 space-y-4 text-alltak-black/75">
                <p>
                  Fundada em 2017 e sediada em Guarulhos, na Grande São Paulo, a Alltak nasceu
                  para transformar o mercado auto adesivo brasileiro com produção 100% nacional.
                </p>
                <p>
                  São 7.500 metros quadrados totalmente dedicados à fabricação de laminados de
                  PVC para envelopamento e customização de veículos, decoração, sign & design,
                  comunicação visual, impressão, laminação e aplicações técnicas.
                </p>
                <p>
                  A marca se destaca pela qualidade, texturas, inovação, novas tecnologias,
                  moldabilidade e, principalmente, pelo brilho, consolidando-se cada vez mais
                  no Brasil e em países da América do Sul, América do Norte e Europa.
                </p>
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
                  <p className="mt-1 text-sm text-alltak-black/60">{d}</p>
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
              <p className="eyebrow text-alltak-blue">Missão</p>
              <p className="mt-4 text-xl leading-relaxed text-white/85 md:text-2xl">
                Produzir laminados de PVC com qualidade, inovação, pontualidade e preços justos,
                gerando empregos e cativando clientes por meio da qualificação constante das
                equipes e da agilidade nas decisões.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full border border-white/10 bg-white/[0.03] p-8">
              <p className="eyebrow text-alltak-blue">Visão</p>
              <p className="mt-4 text-xl leading-relaxed text-white/85 md:text-2xl">
                Ser a maior empresa de laminados de PVC atuando nos mercados interno e externo,
                por meio de pesquisa e desenvolvimento de produtos e serviços, cumprindo seu papel
                social e respeitando o meio ambiente.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-alltak-navyDeep py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-alltak-blue">Nossos valores</p>
            <h2 className="mt-3 text-4xl text-white md:text-5xl">O que nos move</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {VALORES.map((v, i) => (
              <Reveal key={v} delay={i * 60}>
                <div className="flex items-center gap-3 border border-white/10 bg-white/[0.03] p-5">
                  <span className="font-display text-lg font-black text-alltak-blue">0{i + 1}</span>
                  <span className="font-display text-xl font-bold uppercase text-white">{v}</span>
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
            <p className="eyebrow text-alltak-blue">Para todas as superfícies</p>
            <h2 className="mt-3 text-4xl text-white md:text-5xl">O que produzimos</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-3">
            {LINHAS.map((l, i) => (
              <Reveal key={l} delay={i * 50}>
                <span className="btn-trapezoid btn-outline pointer-events-none !py-2 !text-xs">{l}</span>
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
              <p className="eyebrow text-alltak-blueDark">Sustentabilidade</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Usina de Reciclagem própria</h2>
              <div className="mt-5 space-y-4 text-alltak-black/75">
                <p>
                  Comprometida em construir um futuro sustentável para as novas gerações, a Alltak
                  criou sua própria Usina de Reciclagem.
                </p>
                <p>
                  O centro de reciclagem processa aparas e materiais que são transformados para dar
                  origem a novos produtos, reduzindo o impacto ambiental de toda a operação.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="border-l-4 border-alltak-blue bg-white p-8">
              <div className="font-display text-5xl font-black text-alltak-blueDark md:text-6xl">♻</div>
              <p className="mt-4 font-display text-2xl font-bold uppercase leading-tight">
                Do resíduo ao novo produto
              </p>
              <p className="mt-2 text-sm text-alltak-black/60">
                Economia circular aplicada à produção de laminados de PVC.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alltak-black py-16 md:py-20">
        <div className="container-x flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-12 md:flex-row md:items-center">
          <h2 className="max-w-xl text-3xl text-white md:text-4xl">
            Quer levar o padrão Alltak para o seu projeto?
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/contato" className="btn-trapezoid btn-blue">Fale com a gente</Link>
            <Link to="/onde-comprar" className="btn-trapezoid btn-outline">Onde comprar</Link>
          </div>
        </div>
      </section>
    </>
  )
}
