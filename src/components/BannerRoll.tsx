import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import { COLORS } from '../data/catalog'

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
  link: string // rota interna, ou URL externa (abre em nova aba)
  visual?: { src: string; className: string }
  paineis?: Painel[]
  leque?: boolean // visual conceitual: as cores da linha em faixas (Evolution Pro)
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
    key: 'evolution',
    fundo: 'bg-black',
    fundoStyle: { backgroundImage: 'radial-gradient(60% 80% at 78% 45%, rgba(152,187,29,0.18), transparent 70%), radial-gradient(50% 70% at 95% 90%, rgba(26,121,205,0.25), transparent 70%)' },
    acento: '#b8dc2a',
    acentoTexto: '#0b0b0b',
    kicker: 'banner.lancamento',
    titulo: ['Evolution', 'Pro'],
    sub: 'banner.evolution.sub',
    texto: 'banner.evolution.texto',
    link: '/cores?linha=wraps&familia=Evolution%20Pro',
    leque: true,
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
    link: '/produtos/revestfacil',
    // duas fotos encaixadas como na colagem do IWC: amostras no stand e o
    // RevestFácil no ponto de venda
    paineis: [
      { src: './assets/campanhas/revestfacil-amostras.jpg', left: 0, top: 4, width: 71.8, height: 84 },
      { src: './assets/campanhas/revestfacil-foto.jpg', left: 38.5, top: 24, width: 61.5, height: 72 },
    ],
  },
]

const DURATION = 6000

// cores da Evolution Pro em ordem de matiz (cinzas e pretos no fim), para o
// leque do banner
function matiz(hex: string): [number, number] {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, bl = (n & 255) / 255
  const max = Math.max(r, g, bl), min = Math.min(r, g, bl), d = max - min
  if (d < 0.08) return [999, max] // neutros por último, do claro ao escuro
  const h = max === r ? ((g - bl) / d) % 6 : max === g ? (bl - r) / d + 2 : (r - g) / d + 4
  return [(h * 60 + 360) % 360, max]
}
const EVOLUTION = COLORS.filter((c) => c.family === 'Evolution Pro')
  .map((c) => c.hex)
  .sort((a, b) => matiz(a)[0] - matiz(b)[0] || matiz(b)[1] - matiz(a)[1])

// visual conceitual: as 21 cores em faixas inclinadas (o trapézio da marca),
// com brilho metálico; sobem em onda enquanto o banner está no ar
function LequeEvolution({ ativo }: { ativo: boolean }) {
  return (
    <div className="relative mr-[3%] flex h-[86%] w-[min(58vw,980px)] items-end gap-[0.45%] pb-[4%]" aria-hidden>
      {EVOLUTION.map((hex, k) => {
        const onda = 62 + 30 * Math.sin((k / (EVOLUTION.length - 1)) * Math.PI)
        return (
          <div key={hex + k} className="relative flex-1 -skew-x-[16deg] overflow-hidden"
            style={{
              height: `${onda}%`,
              background: `linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%), ${hex}`,
              transform: ativo ? 'translateY(0)' : 'translateY(14%)',
              opacity: ativo ? 1 : 0.4,
              transition: `transform 1.2s cubic-bezier(.2,.7,.1,1) ${k * 45}ms, opacity 1s ease ${k * 45}ms`,
            }}>
            {/* reflexo metálico que corre pela faixa */}
            <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              style={{ animation: ativo ? `brilhoEvo 3.2s ease-in-out ${k * 90}ms infinite` : 'none' }} />
          </div>
        )
      })}
    </div>
  )
}

function Slide({ b, ativo }: { b: Banner; ativo: boolean }) {
  const t = useT()
  const zoom = (escala: number): CSSProperties => ({
    transform: ativo ? `scale(${escala})` : 'scale(1)',
    transition: `transform ${DURATION + 1200}ms linear`,
  })
  return (
    <div
      className={`absolute inset-0 ${b.fundo} transition-opacity duration-1000`}
      // os três ficam empilhados: só o visível recebe clique (senão o de cima,
      // transparente, engolia o clique no botão do banner ativo)
      style={{ ...b.fundoStyle, opacity: ativo ? 1 : 0, pointerEvents: ativo ? 'auto' : 'none', zIndex: ativo ? 1 : 0 }}
      aria-hidden={!ativo}
    >
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[1760px] -translate-x-1/2">
        {/* visual à direita, com um leve zoom enquanto o banner está no ar */}
        <div className="absolute bottom-0 right-0 flex h-full items-end justify-end opacity-60 md:opacity-100">
          {b.leque ? (
            <LequeEvolution ativo={ativo} />
          ) : b.paineis ? (
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
              alt={t('banner.revestfacil.alt')}
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
          {(() => {
            const cls = 'btn-trapezoid mt-[3.5vh] self-start !px-7 !py-2.5'
            const st = { background: b.acento, color: b.acentoTexto ?? '#fff' }
            const rotulo = `${t('banner.confira')} →`
            return b.link.startsWith('http') ? (
              <a href={b.link} target="_blank" rel="noreferrer" tabIndex={ativo ? 0 : -1} className={cls} style={st}>
                {rotulo}
              </a>
            ) : (
              <Link to={b.link} tabIndex={ativo ? 0 : -1} className={cls} style={st}>
                {rotulo}
              </Link>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export default function BannerRoll() {
  const t = useT()
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
        { passo: -1, lado: 'left-1.5 md:left-5', rotulo: t('banner.anterior'), d: 'M15 5l-7 7 7 7' },
        { passo: 1, lado: 'right-1.5 md:right-5', rotulo: t('banner.proximo'), d: 'M9 5l7 7-7 7' },
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
