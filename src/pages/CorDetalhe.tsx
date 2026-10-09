import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { findColor, relatedColors, colorSlug } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'
import { STORE_URL } from '../data/site'
import { useI18n } from '../i18n'
import escudo from '../brand/escudo-oficial.png'

// Página única da cor: foto aplicada em destaque, bobina/textura, ficha
// completa, carrossel ampliado com download das imagens e gerador de artes
// (1:1, 4:5 e 9:16) para uso em marketplaces, coerente com a identidade.

type Slide = { src: string; rotulo: string }

const FORMATOS = {
  '1:1': [1080, 1080],
  '4:5': [1080, 1350],
  '9:16': [1080, 1920],
} as const

function carregarImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = rej
    i.src = src
  })
}

export default function CorDetalhe() {
  const { line, code } = useParams()
  const navigate = useNavigate()
  const { open } = useLeadGate()
  const { t, tv } = useI18n()
  const color = findColor(line, code)
  const [slide, setSlide] = useState<number | null>(null)
  const [gerando, setGerando] = useState(false)

  const slides: Slide[] = useMemo(() => {
    if (!color) return []
    const s: Slide[] = []
    if (color.applied) s.push({ src: color.applied, rotulo: t('cor.aplicado') })
    s.push({ src: color.swatch, rotulo: t('cor.bobina') })
    return s
  }, [color, t])

  const fechar = useCallback(() => setSlide(null), [])
  const prox = useCallback(() => setSlide((s) => (s === null ? s : (s + 1) % slides.length)), [slides.length])
  const ant = useCallback(() => setSlide((s) => (s === null ? s : (s - 1 + slides.length) % slides.length)), [slides.length])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (slide === null) return
      if (e.key === 'Escape') fechar()
      if (e.key === 'ArrowRight') prox()
      if (e.key === 'ArrowLeft') ant()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [slide, fechar, prox, ant])

  const baixar = useCallback(async (src: string, nome: string) => {
    const blob = await fetch(src).then((r) => r.blob())
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = nome
    a.click()
    URL.revokeObjectURL(a.href)
  }, [])

  // arte para marketplace: imagem + faixa de marca (trapézio, nome, código)
  const gerarArte = useCallback(
    async (formato: keyof typeof FORMATOS) => {
      if (!color || slide === null) return
      setGerando(true)
      try {
        const [W, H] = FORMATOS[formato]
        await document.fonts.load('900 90px "Big Shoulders Display"').catch(() => null)
        const img = await carregarImg(slides[slide].src)
        const cv = document.createElement('canvas')
        cv.width = W
        cv.height = H
        const ctx = cv.getContext('2d')!
        ctx.fillStyle = '#0b0d10'
        ctx.fillRect(0, 0, W, H)
        // imagem em "cover" na área superior
        const areaH = Math.round(H * 0.8)
        const esc = Math.max(W / img.width, areaH / img.height)
        const iw = img.width * esc, ih = img.height * esc
        ctx.drawImage(img, (W - iw) / 2, (areaH - ih) / 2, iw, ih)
        // véu inferior p/ legibilidade
        const g = ctx.createLinearGradient(0, areaH - 200, 0, H)
        g.addColorStop(0, 'rgba(11,13,16,0)')
        g.addColorStop(0.45, 'rgba(11,13,16,0.92)')
        g.addColorStop(1, '#0b0d10')
        ctx.fillStyle = g
        ctx.fillRect(0, areaH - 200, W, H - areaH + 200)
        // trapézio-assinatura (base maior embaixo)
        const ty = H - Math.round(H * 0.155)
        ctx.fillStyle = '#0080FF'
        ctx.beginPath()
        ctx.moveTo(64 + 10, ty)
        ctx.lineTo(64 + 150, ty)
        ctx.lineTo(64 + 160, ty + 14)
        ctx.lineTo(64, ty + 14)
        ctx.closePath()
        ctx.fill()
        // nome + código + linha
        ctx.fillStyle = '#ffffff'
        ctx.font = `900 ${formato === '9:16' ? 84 : 72}px "Big Shoulders Display", sans-serif`
        ctx.textBaseline = 'top'
        const nome = color.name.toUpperCase()
        ctx.fillText(nome, 64, ty + 34, W - 128)
        ctx.font = '700 34px "IBM Plex Sans", sans-serif'
        ctx.fillStyle = '#9fb6cf'
        ctx.fillText(`${color.lineName.toUpperCase()} · CÓD ${color.code}`, 64, ty + (formato === '9:16' ? 136 : 118))
        // escudo da marca no canto
        try {
          const logo = await carregarImg(escudo)
          const lh = 110, lw = (logo.width / logo.height) * lh
          ctx.drawImage(logo, W - lw - 56, H - lh - 48, lw, lh)
        } catch { /* sem logo, segue */ }
        cv.toBlob((b) => {
          if (!b) return
          const a = document.createElement('a')
          a.href = URL.createObjectURL(b)
          a.download = `alltak-${color.code}-${formato.replace(':', 'x')}.png`
          a.click()
          URL.revokeObjectURL(a.href)
        }, 'image/png')
      } finally {
        setGerando(false)
      }
    },
    [color, slide, slides],
  )

  if (!color) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-alltak-black px-6 text-center">
        <p className="eyebrow text-alltak-blue">{t('cor.naoEncontrada')}</p>
        <h1 className="mt-3 text-4xl text-white md:text-6xl">{t('cor.naoCatalogo')}</h1>
        <Link to="/cores" className="btn-trapezoid btn-blue mt-8">{t('cor.verTodas')}</Link>
      </section>
    )
  }

  const related = relatedColors(color)

  return (
    <>
      {/* Hero: foto aplicada, grande e ampliável */}
      <section className="relative bg-alltak-black pt-20 md:pt-24">
        <button
          onClick={() => setSlide(0)}
          className="group relative block h-[52vh] min-h-[340px] w-full cursor-zoom-in overflow-hidden md:h-[66vh]"
          aria-label="Ampliar imagem"
        >
          {color.applied ? (
            <img src={color.applied} alt={`${color.name} aplicado`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
          ) : (
            <div className="h-full w-full" style={{ background: color.hex }} />
          )}
          <span className="absolute right-4 top-4 bg-black/60 px-3 py-2 font-display text-xs font-bold uppercase tracking-widest text-white opacity-0 transition group-hover:opacity-100">
            {t('cor.ampliar')}
          </span>
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-alltak-black via-alltak-black/40 to-transparent pb-6 pt-24">
          <div className="container-x pointer-events-auto">
            <button onClick={() => navigate(-1)} className="mb-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/70 hover:text-alltak-blue">
              {t('cor.voltar')}
            </button>
            <span className="tag">{color.lineName}</span>
            <h1 className="mt-3 font-display text-5xl font-black uppercase leading-none text-white md:text-8xl">
              {color.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Ficha + bobina */}
      <section className="bg-alltak-black pb-8 pt-10">
        <div className="container-x grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow text-alltak-blue">{t('cor.bobina')}</p>
            <button
              onClick={() => setSlide(slides.length - 1)}
              className="group mt-3 block aspect-[16/10] w-full cursor-zoom-in overflow-hidden border border-white/10 bg-alltak-coal"
              aria-label="Ampliar bobina"
            >
              <img src={color.swatch} alt={`${color.name} bobina`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </button>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/55">{t('cor.corSolida')}</div>
                <div className="h-16 w-full border border-white/15" style={{ background: color.hex }} />
                <div className="mt-1 text-center text-xs uppercase text-white/55">{color.hex}</div>
              </div>
              {color.applied && (
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/55">{t('cor.aplicado')}</div>
                  <button onClick={() => setSlide(0)} className="block h-16 w-full cursor-zoom-in overflow-hidden border border-white/15">
                    <img src={color.applied} alt="" className="h-full w-full object-cover" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="eyebrow text-alltak-blue">
              {tv(color.family)}
              {color.finish ? ` · ${tv(color.finish)}` : ''}
            </p>
            <h2 className="mt-2 text-3xl text-white md:text-4xl">{t('cor.informacoes')}</h2>

            <dl className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {[
                [t('cor.nome'), color.name, false],
                [t('cor.codigo'), color.code, true],
                [t('cor.linha'), color.lineName, false],
                [t('cor.familia'), tv(color.family), false],
                ...(color.finish ? [[t('cor.acabamento'), tv(color.finish), false]] : []),
                ...(color.pantone ? [['Pantone', color.pantone, false]] : []),
              ].map(([k, v, azul]) => (
                <div key={k as string} className="flex items-center justify-between py-3 text-base">
                  <dt className="text-white/60">{k}</dt>
                  <dd className={`font-display font-bold uppercase ${azul ? 'text-alltak-blue' : 'text-white'}`}>{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => open({ title: `Boletim Técnico ${color.name} (${color.code})`, url: '#', kind: 'PDF' })}
                className="btn-trapezoid btn-blue justify-center"
              >
                {t('cor.baixarBoletim')}
              </button>
              <button
                onClick={() => baixar(color.applied ?? color.swatch, `alltak-${color.code}.jpg`)}
                className="btn-trapezoid btn-navy justify-center"
              >
                {t('cor.baixarImagemProduto')}
              </button>
              {color.line === 'wraps' && (
                <Link to="/visualizador" className="btn-trapezoid btn-outline justify-center">
                  {t('cor.verVisualizador')}
                </Link>
              )}
              <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline justify-center">
                {t('prod.comprarStore')}
              </a>
            </div>

            <p className="mt-4 text-sm text-white/45">{t('cor.disclaimer')}</p>
          </div>
        </div>
      </section>

      {/* Relacionadas */}
      {related.length > 0 && (
        <section className="bg-alltak-black py-14">
          <div className="container-x">
            <p className="eyebrow text-alltak-blue">{t('cor.mesmaFamilia')}</p>
            <h2 className="mt-2 text-3xl text-white md:text-4xl">{t('cor.relacionadas')}</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {related.map((c) => (
                <Link key={`${c.line}-${c.code}`} to={colorSlug(c)} className="group text-left">
                  <div className="relative aspect-square overflow-hidden bg-alltak-coal">
                    <img src={c.swatch} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mt-1.5 truncate font-display text-sm font-bold uppercase text-white group-hover:text-alltak-blue">
                    {c.name}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-white/55">{c.code}</div>
                </Link>
              ))}
            </div>
            <Link to="/cores" className="btn-trapezoid btn-outline mt-8">{t('cor.verTodas')}</Link>
          </div>
        </section>
      )}

      {/* Carrossel ampliado */}
      {slide !== null && slides[slide] && (
        <div className="fixed inset-0 z-[95] flex flex-col items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={fechar} />
          <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center justify-center">
              {slides.length > 1 && (
                <button onClick={ant} aria-label="Anterior"
                  className="absolute left-0 z-10 flex h-12 w-12 items-center justify-center bg-black/60 font-display text-2xl text-white hover:bg-alltak-blue md:-left-16">
                  ‹
                </button>
              )}
              <img src={slides[slide].src} alt={`${color.name} · ${slides[slide].rotulo}`} className="max-h-[72vh] w-auto max-w-full border border-white/10" />
              {slides.length > 1 && (
                <button onClick={prox} aria-label="Próxima"
                  className="absolute right-0 z-10 flex h-12 w-12 items-center justify-center bg-black/60 font-display text-2xl text-white hover:bg-alltak-blue md:-right-16">
                  ›
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-display text-xl font-bold uppercase text-white">
                  {color.name} <span className="text-white/50">· {slides[slide].rotulo}</span>
                </div>
                <div className="text-xs uppercase tracking-widest text-white/50">
                  {slide + 1} / {slides.length}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => baixar(slides[slide].src, `alltak-${color.code}-${slides[slide].rotulo.toLowerCase().split(' ')[0]}.jpg`)}
                  className="btn-trapezoid btn-blue !py-2 !text-xs"
                >
                  {t('comum.baixarImagem')}
                </button>
                <span className="font-display text-[11px] font-bold uppercase tracking-widest text-white/50">
                  {t('cor.artes')}
                </span>
                {(Object.keys(FORMATOS) as (keyof typeof FORMATOS)[]).map((f) => (
                  <button key={f} onClick={() => gerarArte(f)} disabled={gerando}
                    className="btn-trapezoid btn-outline !px-3 !py-2 !text-xs disabled:opacity-40">
                    {f}
                  </button>
                ))}
                <button onClick={fechar} aria-label="Fechar"
                  className="ml-2 flex h-10 w-10 items-center justify-center bg-white/10 text-white hover:bg-alltak-blue">
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
