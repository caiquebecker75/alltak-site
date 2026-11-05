import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n'

// Full-bleed auto-rotating campaign carousel (artes da 75LAB, nov/2026). Each
// banner is a background artwork (left side plain, visual on the right; see
// migracao/banners_2026.py) with the text as real text on the left, same
// typography and position in all of them: accent-bar kicker, light title,
// accent subtitle, support line, CTA. Discreet arrows on each side and the
// progress dots move between banners; hovering pauses.

type Banner = {
  key: string
  fundo: string // arte de fundo: ./assets/2026/<fundo>.webp (e -1280.webp no celular)
  acento: string
  acentoTexto?: string // cor do texto do botão sobre o acento
  kicker: string
  titulo: string[]
  sub: string
  texto: string
  link: string // rota interna, ou URL externa (abre em nova aba)
}

const BANNERS: Banner[] = [
  {
    key: 'evolution',
    fundo: 'rotativo-evolution',
    acento: '#b8dc2a',
    acentoTexto: '#0b0b0b',
    kicker: 'banner.lancamento',
    titulo: ['Acid Lemon'],
    sub: 'banner.evolution.sub',
    texto: 'banner.evolution.texto',
    link: '/cores?linha=wraps&familia=Evolution%20Pro',
  },
  {
    key: 'revestfacil',
    fundo: 'rotativo-revestfacil',
    acento: '#2f86ff',
    kicker: 'banner.lancamento',
    titulo: ['Revest Fácil'],
    sub: 'banner.revestfacil.sub',
    texto: 'banner.revestfacil.texto',
    link: '/produtos/revestfacil',
  },
  {
    key: 'muxarabi',
    fundo: 'rotativo-muxarabi',
    acento: '#c8a66a',
    acentoTexto: '#00205b',
    kicker: 'banner.lancamento',
    titulo: ['Wood', 'Muxarabi'],
    sub: 'banner.muxarabi.sub',
    texto: 'banner.muxarabi.texto',
    link: '/cor/decor/977D125',
  },
  {
    key: 'signs',
    fundo: 'rotativo-signs',
    acento: '#f4711f',
    kicker: 'banner.lancamento',
    titulo: ['Linha Signs', 'Premium'],
    sub: 'banner.signs.sub',
    texto: 'banner.signs.texto',
    link: '/cores?linha=signs&familia=Premium',
  },
]

const DURATION = 6000

function Slide({ b, ativo }: { b: Banner; ativo: boolean }) {
  const t = useT()
  return (
    <div
      className="absolute inset-0 bg-black transition-opacity duration-1000"
      // os banners ficam empilhados: só o visível recebe clique (senão o de cima,
      // transparente, engolia o clique no botão do banner ativo)
      style={{ opacity: ativo ? 1 : 0, pointerEvents: ativo ? 'auto' : 'none', zIndex: ativo ? 1 : 0 }}
      aria-hidden={!ativo}
    >
      {/* arte de fundo (o lado esquerdo é liso, para o texto), com um leve
          zoom enquanto o banner está no ar; no celular a arte fica no alto e o
          texto embaixo, sobre o preto */}
      <img
        src={`./assets/2026/${b.fundo}.webp`}
        srcSet={`./assets/2026/${b.fundo}-1280.webp 1280w, ./assets/2026/${b.fundo}.webp 2560w`}
        sizes="100vw"
        alt=""
        className="absolute inset-x-0 top-0 h-[40%] w-full object-cover object-[80%_center] md:inset-0 md:h-full md:object-right"
        style={{ transform: ativo ? 'scale(1.04)' : 'scale(1)', transition: `transform ${DURATION + 1200}ms linear`, transformOrigin: 'right center' }}
      />
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-[28%] h-[12%] bg-gradient-to-b from-transparent to-black md:hidden" aria-hidden />

        {/* bloco de texto: mesma posição (fixo pelo topo) e tipografia em todos os
            banners; títulos de 1 ou 2 linhas só mudam onde o bloco termina */}
        <div className="relative flex h-full flex-col justify-end px-6 pb-16 sm:px-10 md:justify-center md:px-[9.5%] md:pb-0">
          <div className="flex items-center gap-3 text-[1.1rem] md:text-[clamp(1rem,1.55vw,2.5rem)]">
            <span className="h-[1.1em] w-1.5" style={{ background: b.acento }} aria-hidden />
            <span className="font-display font-light uppercase leading-none tracking-[0.06em]" style={{ color: b.acento }}>
              {t(b.kicker)}
            </span>
          </div>
          <h3 className="mt-2 font-display text-[2.4rem] font-light md:mt-[0.6vw] md:text-[clamp(2.2rem,4.3vw,6.75rem)] uppercase leading-[0.88] tracking-[0.01em] text-white">
            {b.titulo.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h3>
          <div className="mt-2 font-display text-[1rem] font-normal md:mt-[0.8vw] md:text-[clamp(0.95rem,1.35vw,1.9rem)] uppercase tracking-[0.12em]" style={{ color: b.acento }}>
            {t(b.sub)}
          </div>
          <p className="mt-3 max-w-[30rem] font-display text-[1rem] font-light md:mt-[1vw] md:max-w-[33vw] md:text-[clamp(0.95rem,1.4vw,2rem)] uppercase leading-[1.1] tracking-[0.04em] text-white/90">
            {t(b.texto)}
          </p>
          {(() => {
            const cls = 'btn-trapezoid mt-4 self-start !px-7 !py-2.5 md:mt-[2vw]'
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
      // no computador, a proporção da arte (3840 × 1200), para o texto cair no lado liso
      className="relative h-[500px] w-full overflow-hidden bg-black md:aspect-[16/5] md:h-auto"
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
