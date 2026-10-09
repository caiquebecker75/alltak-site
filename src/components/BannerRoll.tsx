import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n'

// Full-bleed auto-rotating campaign carousel. The three banners share one
// layout so they read as a set: the text is real text on the left (same
// typography and position in all of them: accent-bar kicker, light title,
// accent subtitle, support line, CTA) and each campaign brings its own visual
// on the right and its line's colors. Visuals come from the brand artworks,
// cut out by migracao/banners_campanha.py. Discreet arrows on each side and
// the progress dots move between banners; hovering pauses.

type Banner = {
  key: string
  fundo: string
  fundoStyle?: CSSProperties
  acento: string
  acentoTexto?: string // cor do texto do botão sobre o acento
  kicker: string
  titulo?: string[]
  logo?: string
  sub?: string
  texto: string
  link: string
  visual?: { src: string; className: string }
  paineis?: Painel[]
}
// painel de foto em paralelogramo, em % da caixa do visual (ver PAINEIS_CAIXA)
type Painel = { src: string; left: number; top: number; width: number; height: number }

// Inclinação das fotos nas artes originais (IWC e Muxarabi): ~0,38 px na
// horizontal por px na vertical. Os painéis do RevestFácil usam a mesma.
// Caixa do visual: 0,975 x altura; painéis com largura = 0,83 x altura, o que
// dá um recuo de 45,7% da largura no topo/base para a inclinação 0,38.
const PAINEIS_CAIXA = 'aspect-[39/40]'
const RECUO = '45.7%'

const BANNERS: Banner[] = [
  {
    key: 'iwc',
    fundo: 'bg-black',
    // o fundo de caveiras da arte IWC, repetido na mesma escala da arte
    fundoStyle: { backgroundImage: "url('./assets/campanhas/iwc-padrao.png')", backgroundSize: 'auto 41%' },
    acento: '#0080ff',
    kicker: 'banner.linha',
    titulo: ['IWC'],
    sub: 'banner.iwc.sub',
    texto: 'banner.iwc.texto',
    link: '/cores?linha=wraps',
    visual: { src: './assets/campanhas/iwc-visual.webp', className: 'h-full' },
  },
  {
    key: 'muxarabi',
    fundo: 'bg-alltak-navy',
    acento: '#b49a5e',
    acentoTexto: '#00205b',
    kicker: 'banner.lancamento',
    titulo: ['Wood', 'Muxarabi'],
    sub: 'banner.muxarabi.sub',
    texto: 'banner.muxarabi.texto',
    link: '/cor/decor/977D125',
    visual: { src: './assets/campanhas/muxarabi-visual.webp', className: 'h-full' },
  },
  {
    key: 'revestfacil',
    fundo: 'bg-alltak-navyDeep',
    fundoStyle: { backgroundImage: 'radial-gradient(70% 90% at 75% 40%, rgba(0,85,170,0.45), transparent 70%)' },
    acento: '#55aaff',
    kicker: 'banner.lancamento',
    logo: './assets/campanhas/revestfacil-logo.png',
    texto: 'banner.revestfacil.texto',
    link: '/onde-comprar',
    // duas fotos encaixadas como na colagem do IWC: amostras no stand e o
    // RevestFácil no ponto de venda
    paineis: [
      { src: './assets/campanhas/revestfacil-amostras.jpg', left: 0, top: 4, width: 71.8, height: 84 },
      { src: './assets/campanhas/revestfacil-foto.jpg', left: 38.5, top: 24, width: 61.5, height: 72 },
    ],
  },
]

const DURATION = 6000

function Slide({ b, ativo }: { b: Banner; ativo: boolean }) {
  const t = useT()
  const zoom = (escala: number): CSSProperties => ({
    transform: ativo ? `scale(${escala})` : 'scale(1)',
    transition: `transform ${DURATION + 1200}ms linear`,
  })
  return (
    <div
      className={`absolute inset-0 ${b.fundo} transition-opacity duration-1000`}
      style={{ ...b.fundoStyle, opacity: ativo ? 1 : 0 }}
      aria-hidden={!ativo}
    >
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[1760px] -translate-x-1/2">
        {/* visual à direita, com um leve zoom enquanto o banner está no ar */}
        <div className="absolute bottom-0 right-0 flex h-full items-end justify-end opacity-60 md:opacity-100">
          {b.paineis ? (
            <div className={`relative mr-[4%] h-full ${PAINEIS_CAIXA}`}>
              {b.paineis.map((pn) => (
                <div
                  key={pn.src}
                  className="absolute overflow-hidden"
                  style={{
                    left: `${pn.left}%`, top: `${pn.top}%`, width: `${pn.width}%`, height: `${pn.height}%`,
                    clipPath: `polygon(${RECUO} 0, 100% 0, calc(100% - ${RECUO}) 100%, 0 100%)`,
                  }}
                >
                  <img src={pn.src} alt="" className="h-full w-full object-cover" style={zoom(1.06)} />
                </div>
              ))}
            </div>
          ) : (
            b.visual && <img src={b.visual.src} alt="" className={`${b.visual.className} w-auto max-w-none origin-bottom-right`} style={zoom(1.04)} />
          )}
        </div>
        {/* no celular o visual fica atrás do texto: véu para leitura */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent md:hidden" aria-hidden />

        {/* bloco de texto: mesma posição (fixo pelo topo) e tipografia nos três
            banners; títulos de 1 ou 2 linhas só mudam onde o bloco termina */}
        <div className="relative flex h-full flex-col justify-start px-6 pt-[max(2.5rem,8vh)] sm:px-10 lg:px-[7%]">
          <div className="flex items-center gap-3 text-[clamp(1.4rem,4vh,2.5rem)]">
            <span className="h-[1.1em] w-1.5" style={{ background: b.acento }} aria-hidden />
            <span className="font-display font-light uppercase leading-none tracking-[0.06em]" style={{ color: b.acento }}>
              {t(b.kicker)}
            </span>
          </div>
          {b.logo ? (
            <img
              src={b.logo}
              alt="Alltak RevestFácil · Revestimento vinílico adesivo"
              className="mt-[2.2vh] h-[clamp(5.5rem,17vh,10rem)] w-auto self-start"
            />
          ) : (
            <h3 className="mt-[1vh] font-display text-[clamp(3rem,10.5vh,6.75rem)] font-light uppercase leading-[0.88] tracking-[0.01em] text-white">
              {b.titulo!.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </h3>
          )}
          {b.sub && (
            <div className="mt-[1.4vh] font-display text-[clamp(1.1rem,3.2vh,1.9rem)] font-normal uppercase tracking-[0.12em]" style={{ color: b.acento }}>
              {t(b.sub)}
            </div>
          )}
          <p className="mt-[2.2vh] max-w-[30rem] font-display text-[clamp(1.15rem,3.4vh,2rem)] font-light uppercase leading-[1.1] tracking-[0.04em] text-white/90">
            {t(b.texto)}
          </p>
          <Link
            to={b.link}
            tabIndex={ativo ? 0 : -1}
            className="btn-trapezoid mt-[3.5vh] self-start !px-7 !py-2.5"
            style={{ background: b.acento, color: b.acentoTexto ?? '#fff' }}
          >
            {t('banner.confira')} →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BannerRoll() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  // um timer por slide: trocar pela seta reinicia a contagem do próximo
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => setI((v) => (v + 1) % BANNERS.length), DURATION)
    return () => clearTimeout(id)
  }, [i, paused])

  const ir = (passo: number) => setI((v) => (v + passo + BANNERS.length) % BANNERS.length)

  return (
    <section
      className="relative h-[62vh] min-h-[440px] w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {BANNERS.map((b, idx) => (
        <Slide key={b.key} b={b} ativo={idx === i} />
      ))}

      {/* legibility gradient for the progress dots */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />

      {/* setas discretas, uma de cada lado */}
      {[
        { passo: -1, lado: 'left-1.5 md:left-5', rotulo: 'Banner anterior', d: 'M15 5l-7 7 7 7' },
        { passo: 1, lado: 'right-1.5 md:right-5', rotulo: 'Próximo banner', d: 'M9 5l7 7-7 7' },
      ].map((s) => (
        <button
          key={s.passo}
          onClick={() => ir(s.passo)}
          aria-label={s.rotulo}
          className={`absolute top-1/2 ${s.lado} z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white/60 backdrop-blur-[2px] transition hover:border-white/50 hover:bg-black/35 hover:text-white md:h-12 md:w-12`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={s.d} />
          </svg>
        </button>
      ))}

      {/* controles */}
      <div className="container-x absolute inset-x-0 bottom-8 z-10 flex items-end justify-end gap-6">
        <div className="flex items-center gap-2">
          {BANNERS.map((b, idx) => (
            <button
              key={b.key}
              onClick={() => setI(idx)}
              aria-label={`Banner ${idx + 1}`}
              className="group relative h-1.5 w-12 overflow-hidden bg-white/25"
            >
              <span
                className="absolute inset-y-0 left-0 bg-alltak-blue"
                style={{
                  width: idx === i ? '100%' : '0%',
                  transition: idx === i && !paused ? `width ${DURATION}ms linear` : 'width .3s ease',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
