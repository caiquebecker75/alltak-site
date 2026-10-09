import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { findColor, relatedColors, colorSlug, type Color } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'
import { STORE_URL } from '../data/site'
import { useI18n } from '../i18n'
import { fichaDaCor } from '../data/catalog/fichas'
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
type Formato = keyof typeof FORMATOS

function carregarImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = rej
    i.src = src
  })
}

// Fotos únicas da cor. Signs só tem a foto do rolo (o "swatch" é o mesmo
// arquivo), então ela entra uma vez só; o mesmo vale para qualquer repetição.
function fotosDaCor(color: Color, t: (k: string) => string): Slide[] {
  const s: Slide[] = []
  if (color.applied) s.push({ src: color.applied, rotulo: color.line === 'signs' ? t('cor.produto') : t('cor.aplicado') })
  if (!s.some((x) => x.src === color.swatch)) s.push({ src: color.swatch, rotulo: t('cor.bobina') })
  return s
}

// ---------- arte para marketplace ----------
// Layout em três faixas, sempre dentro das margens de segurança:
//   topo: escudo Alltak + tag da linha
//   meio: foto inteira (contain, sem cortar o produto) sobre um fundo
//         desfocado da própria foto, que preenche o quadro sem barras
//   base: nome (ajusta o corpo e quebra em até 2 linhas), código, chip da cor
// No 9:16 o conteúdo fica fora das zonas cobertas pela interface dos stories.

const AZUL = '#0080FF'
const FUNDO = '#0a0d12'

function trapezio(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, recuo: number) {
  ctx.beginPath()
  ctx.moveTo(x + recuo, y)
  ctx.lineTo(x + w - recuo, y)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
}

// quebra o nome em até 2 linhas, reduzindo o corpo até caber na largura
function ajustarNome(ctx: CanvasRenderingContext2D, nome: string, larg: number, corpoMax: number) {
  const palavras = nome.split(/\s+/)
  for (let corpo = corpoMax; corpo >= 44; corpo -= 4) {
    ctx.font = `900 ${corpo}px "Big Shoulders Display", sans-serif`
    if (ctx.measureText(nome).width <= larg) return { corpo, linhas: [nome] }
    // melhor ponto de quebra: o que deixa as duas linhas mais equilibradas
    let melhor: string[] | null = null
    let pior = Infinity
    for (let i = 1; i < palavras.length; i++) {
      const a = palavras.slice(0, i).join(' ')
      const b = palavras.slice(i).join(' ')
      const m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width)
      if (m <= larg && m < pior) {
        pior = m
        melhor = [a, b]
      }
    }
    if (melhor) return { corpo, linhas: melhor }
  }
  ctx.font = '900 44px "Big Shoulders Display", sans-serif'
  return { corpo: 44, linhas: [nome] }
}

async function desenharArte(
  formato: Formato,
  color: Color,
  foto: string,
  rotulos: { cod: string; familia: string },
): Promise<Blob | null> {
  const [W, H] = FORMATOS[formato]
  await Promise.all([
    document.fonts.load('900 90px "Big Shoulders Display"'),
    document.fonts.load('700 34px "IBM Plex Sans"'),
  ]).catch(() => null)
  const [img, logo] = await Promise.all([carregarImg(foto), carregarImg(escudo).catch(() => null)])

  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const ctx = cv.getContext('2d')!
  ctx.textBaseline = 'alphabetic'

  // fundo da marca
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#00153d')
  bg.addColorStop(0.55, FUNDO)
  bg.addColorStop(1, '#000000')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  const M = 72 // margem lateral
  const seguroTopo = formato === '9:16' ? 230 : 64
  const seguroBase = formato === '9:16' ? 300 : 64

  // topo: escudo + tag da linha
  const logoH = 64
  if (logo) {
    const lw = (logo.width / logo.height) * logoH
    ctx.drawImage(logo, M, seguroTopo, lw, logoH)
  }
  ctx.font = '700 26px "Big Shoulders Display", sans-serif'
  const tag = color.lineName.toUpperCase()
  ctx.letterSpacing = '4px'
  const tagW = ctx.measureText(tag).width + 56
  trapezio(ctx, W - M - tagW, seguroTopo + 10, tagW, 44, 8)
  ctx.fillStyle = AZUL
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.fillText(tag, W - M - tagW / 2 + 2, seguroTopo + 42)
  ctx.textAlign = 'left'
  ctx.letterSpacing = '0px'

  // base: nome + código/família + chip da cor (medido antes p/ dimensionar a foto)
  const larguraTexto = W - 2 * M - 150 // reserva o chip da cor à direita
  const { corpo, linhas } = ajustarNome(ctx, color.name.toUpperCase(), larguraTexto, formato === '1:1' ? 92 : 104)
  const alturaNome = linhas.length * corpo * 0.95
  const alturaBase = 26 + 22 + alturaNome + 22 + 34 // barra azul + nome + linha de código
  const baseTopo = H - seguroBase - alturaBase

  // meio: quadro da foto
  const qx = M
  const qy = seguroTopo + logoH + 40
  const qw = W - 2 * M
  const qh = baseTopo - 40 - qy
  ctx.save()
  ctx.beginPath()
  ctx.rect(qx, qy, qw, qh)
  ctx.clip()
  // preenchimento desfocado da própria foto (cobre o quadro sem barras vazias)
  const cobre = Math.max(qw / img.width, qh / img.height) * 1.15
  ctx.filter = 'blur(28px) brightness(0.45) saturate(1.1)'
  ctx.drawImage(img, qx + (qw - img.width * cobre) / 2, qy + (qh - img.height * cobre) / 2, img.width * cobre, img.height * cobre)
  ctx.filter = 'none'
  // foto inteira, sem cortar o produto
  const cabe = Math.min(qw / img.width, qh / img.height)
  const iw = img.width * cabe
  const ih = img.height * cabe
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, qx + (qw - iw) / 2, qy + (qh - ih) / 2, iw, ih)
  ctx.restore()
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 2
  ctx.strokeRect(qx + 1, qy + 1, qw - 2, qh - 2)

  // barra-assinatura (trapézio, base maior embaixo)
  trapezio(ctx, M, baseTopo, 170, 16, 12)
  ctx.fillStyle = AZUL
  ctx.fill()

  // nome
  ctx.fillStyle = '#ffffff'
  ctx.font = `900 ${corpo}px "Big Shoulders Display", sans-serif`
  let y = baseTopo + 16 + 22 + corpo * 0.82
  linhas.forEach((l, i) => ctx.fillText(l, M, y + i * corpo * 0.95))
  y += (linhas.length - 1) * corpo * 0.95 + 22 + 34 + 8 // baseline da linha de detalhes

  // código + família/acabamento (+ Pantone)
  const detalhes = [`${rotulos.cod} ${color.code}`, rotulos.familia, color.pantone ? `Pantone ${color.pantone}` : '']
    .filter(Boolean)
    .join('  ·  ')
    .toUpperCase()
  ctx.font = '700 30px "IBM Plex Sans", sans-serif'
  ctx.fillStyle = '#9fb6cf'
  ctx.fillText(detalhes, M, y, W - 2 * M)

  // chip da cor, alinhado à base do nome
  const chipW = 118
  const chipH = 84
  const chipX = W - M - chipW
  const chipY = baseTopo + 16 + 22
  trapezio(ctx, chipX, chipY, chipW, chipH, 12)
  ctx.fillStyle = color.hex
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 2
  ctx.stroke()

  return new Promise((res) => cv.toBlob(res, 'image/png'))
}

export default function CorDetalhe() {
  const { line, code } = useParams()
  const navigate = useNavigate()
  const { open } = useLeadGate()
  const { lang, t, tv } = useI18n()
  const color = findColor(line, code)
  const [slide, setSlide] = useState<number | null>(null)
  const [gerando, setGerando] = useState(false)

  const slides: Slide[] = useMemo(() => (color ? fotosDaCor(color, t) : []), [color, t])

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

  const salvar = useCallback((blob: Blob, nome: string) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = nome
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }, [])

  const baixar = useCallback(
    async (src: string, nome: string) => salvar(await fetch(src).then((r) => r.blob()), nome),
    [salvar],
  )

  const gerarArte = useCallback(
    async (formato: Formato) => {
      if (!color || slide === null) return
      setGerando(true)
      try {
        const familia = color.finish ? tv(color.finish) : tv(color.family)
        const blob = await desenharArte(formato, color, slides[slide].src, { cod: t('cor.cod'), familia })
        if (blob) salvar(blob, `alltak-${color.code}-${formato.replace(':', 'x')}.png`)
      } finally {
        setGerando(false)
      }
    },
    [color, slide, slides, t, tv, salvar],
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
  // Signs usa a série como família e acabamento; não repete o mesmo valor
  const acabamento = color.finish && color.finish !== color.family ? color.finish : undefined
  // descrição e ficha técnica do catálogo digital oficial
  const ficha = fichaDaCor(color.line, color.code, lang)
  const principal = slides[0]
  const secundarias = slides.slice(1)

  return (
    <>
      {/* Hero: foto principal grande e ampliável. A foto aparece inteira e
          nítida (contain) sobre um fundo desfocado dela mesma, em vez de ser
          esticada em tela cheia além da resolução que o arquivo tem. */}
      <section className="relative bg-alltak-black pt-20 md:pt-24">
        <button
          onClick={() => setSlide(0)}
          className="group relative block h-[56vh] min-h-[340px] w-full cursor-zoom-in overflow-hidden md:h-[70vh]"
          aria-label={t('cor.ampliar')}
        >
          {principal ? (
            <>
              <img src={principal.src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl" />
              <img
                src={principal.src}
                alt={`${color.name} · ${principal.rotulo}`}
                className="relative h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </>
          ) : (
            <div className="h-full w-full" style={{ background: color.hex }} />
          )}
          <span className="absolute right-4 top-4 bg-black/60 px-3 py-2 font-display text-sm font-bold uppercase tracking-widest text-white opacity-0 transition group-hover:opacity-100">
            {t('cor.ampliar')}
          </span>
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-alltak-black via-alltak-black/70 to-transparent pb-6 pt-16">
          <div className="container-x pointer-events-auto">
            <button onClick={() => navigate(-1)} className="mb-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-white/75 hover:text-alltak-blue">
              {t('cor.voltar')}
            </button>
            <span className="tag">{color.lineName}</span>
            <h1 className="mt-3 font-display text-5xl font-black uppercase leading-none text-white md:text-8xl">
              {color.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Ficha + demais fotos (sem repetir a foto do topo) */}
      <section className="bg-alltak-black pb-8 pt-10">
        <div className="container-x grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            {secundarias.length > 0 ? (
              <>
                <p className="eyebrow text-alltak-blue">{secundarias[0].rotulo}</p>
                <button
                  onClick={() => setSlide(1)}
                  className="group mt-3 flex aspect-[4/3] w-full cursor-zoom-in items-center justify-center overflow-hidden border border-white/10 bg-alltak-coal"
                  aria-label={t('cor.ampliar')}
                >
                  <img src={secundarias[0].src} alt={`${color.name} · ${secundarias[0].rotulo}`} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                </button>
              </>
            ) : (
              <>
                <p className="eyebrow text-alltak-blue">{t('cor.amostra')}</p>
                <div className="mt-3 aspect-[4/3] w-full border border-white/15" style={{ background: color.hex }} />
              </>
            )}
            <div className="mt-3 flex items-center gap-4">
              {secundarias.length > 0 && (
                <div className="h-14 w-20 shrink-0 border border-white/15" style={{ background: color.hex }} aria-hidden />
              )}
              <div className="text-sm uppercase tracking-widest text-white/60">
                {t('cor.corSolida')} · {color.hex}
                {color.pantone ? ` · Pantone ${color.pantone}` : ''}
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow text-alltak-blue">
              {tv(color.family)}
              {acabamento ? ` · ${tv(acabamento)}` : ''}
            </p>
            <h2 className="mt-2 text-3xl text-white md:text-4xl">{t('cor.informacoes')}</h2>

            <dl className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {[
                [t('cor.nome'), color.name, false],
                [t('cor.codigo'), color.code, true],
                [t('cor.linha'), color.lineName, false],
                [t('cor.familia'), tv(color.family), false],
                ...(acabamento ? [[t('cor.acabamento'), tv(acabamento), false]] : []),
                ...(color.pantone ? [['Pantone', color.pantone, false]] : []),
              ].map(([k, v, azul]) => (
                <div key={k as string} className="flex items-center justify-between gap-4 py-3 text-base md:text-lg">
                  <dt className="text-white/65">{k}</dt>
                  <dd className={`text-right font-display font-bold uppercase ${azul ? 'text-alltak-blue' : 'text-white'}`}>{v}</dd>
                </div>
              ))}
            </dl>

            {ficha?.descricao && (
              <div className="mt-6">
                <p className="eyebrow">{t('cor.sobre')}</p>
                <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-white/75">{ficha.descricao}</p>
              </div>
            )}
            {ficha && ficha.specs.length > 0 && (
              <div className="mt-6">
                <p className="eyebrow">{t('cor.ficha')}</p>
                <ul className="mt-2 divide-y divide-white/10 border-y border-white/10">
                  {ficha.specs.map((sp) => {
                    const k = sp.indexOf(': ')
                    return (
                      <li key={sp} className="flex justify-between gap-4 py-2.5 text-sm">
                        {k > 0 && k < 40 ? (
                          <>
                            <span className="text-white/60">{sp.slice(0, k)}</span>
                            <span className="text-right text-white">{sp.slice(k + 2)}</span>
                          </>
                        ) : (
                          <span className="text-white/80">{sp}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-2 text-sm text-white/50">{t('prod.fonte')}: {ficha.fonte}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => open({ title: `${t('cor.baixarBoletim').replace(' ↓', '')} · ${color.name} (${color.code})`, url: '#', kind: 'PDF' })}
                className="btn-trapezoid btn-blue justify-center !text-base"
              >
                {t('cor.baixarBoletim')}
              </button>
              <button
                onClick={() => baixar(principal?.src ?? color.swatch, `alltak-${color.code}.jpg`)}
                className="btn-trapezoid btn-navy justify-center !text-base"
              >
                {t('cor.baixarImagemProduto')}
              </button>
              {color.line === 'wraps' && (
                <Link to="/visualizador" className="btn-trapezoid btn-outline justify-center !text-base">
                  {t('cor.verVisualizador')}
                </Link>
              )}
              <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline justify-center !text-base">
                {t('prod.comprarStore')}
              </a>
            </div>

            <p className="mt-4 text-sm text-white/55">{t('cor.disclaimer')}</p>
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
                  <div className="mt-1.5 truncate font-display text-base font-bold uppercase text-white group-hover:text-alltak-blue">
                    {c.name}
                  </div>
                  <div className="text-sm uppercase tracking-wide text-white/60">{c.code}</div>
                </Link>
              ))}
            </div>
            <Link to="/cores" className="btn-trapezoid btn-outline mt-8">{t('cor.verTodas')}</Link>
          </div>
        </section>
      )}

      {/* Carrossel ampliado: download da foto e artes para marketplace */}
      {slide !== null && slides[slide] && (
        <div className="fixed inset-0 z-[95] flex flex-col items-center justify-center p-3 md:p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={fechar} />
          <div className="relative flex max-h-full w-full max-w-5xl flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center justify-center">
              {slides.length > 1 && (
                <button onClick={ant} aria-label="‹"
                  className="absolute left-0 z-10 flex h-12 w-12 items-center justify-center bg-black/60 font-display text-2xl text-white hover:bg-alltak-blue md:-left-16">
                  ‹
                </button>
              )}
              <img src={slides[slide].src} alt={`${color.name} · ${slides[slide].rotulo}`} className="max-h-[58vh] w-auto max-w-full border border-white/10 md:max-h-[68vh]" />
              {slides.length > 1 && (
                <button onClick={prox} aria-label="›"
                  className="absolute right-0 z-10 flex h-12 w-12 items-center justify-center bg-black/60 font-display text-2xl text-white hover:bg-alltak-blue md:-right-16">
                  ›
                </button>
              )}
              <button onClick={fechar} aria-label={t('comum.fechar')}
                className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center bg-black/70 text-lg text-white hover:bg-alltak-blue md:-right-16">
                ✕
              </button>
            </div>

            {slides.length > 1 && (
              <div className="mt-3 flex justify-center gap-2">
                {slides.map((s, i) => (
                  <button key={s.src} onClick={() => setSlide(i)} aria-label={s.rotulo}
                    className={`h-14 w-20 overflow-hidden border-2 bg-alltak-coal transition ${i === slide ? 'border-alltak-blue' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={s.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-display text-xl font-bold uppercase text-white">
                  {color.name} <span className="text-white/55">· {slides[slide].rotulo}</span>
                </div>
                <div className="text-sm uppercase tracking-widest text-white/55">
                  {slide + 1} / {slides.length}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => baixar(slides[slide].src, `alltak-${color.code}-${slide + 1}.jpg`)}
                  className="btn-trapezoid btn-blue !px-5 !py-2.5 !text-sm"
                >
                  {t('comum.baixarImagem')}
                </button>
                <span className="w-full font-display text-sm font-bold uppercase tracking-widest text-white/60 md:ml-2 md:w-auto">
                  {gerando ? t('cor.gerando') : t('cor.artes')}
                </span>
                {(Object.keys(FORMATOS) as Formato[]).map((f) => (
                  <button key={f} onClick={() => gerarArte(f)} disabled={gerando}
                    className="btn-trapezoid btn-outline !px-4 !py-2.5 !text-sm disabled:opacity-40">
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
