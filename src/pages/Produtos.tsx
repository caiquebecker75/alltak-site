import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { PRODUCT_CATEGORIES, STORE_URL } from '../data/site'
import { LINE_DETAILS, type LineColor } from '../data/lines'

const CATEGORY_IMAGE: Record<string, string> = {
  automotivo: './assets/automotivo_03.avif',
  arquitetura: './assets/decor_02.avif',
  impressao: './assets/sign_02.avif',
  'sign-design': './assets/sign_03.avif',
  'aplicacoes-tecnicas': './assets/automotivo_02.avif',
  'wrap-care': './assets/decor_03.avif',
  acessorios: './assets/decor_01.avif',
}

function swatchBg(c: LineColor): React.CSSProperties {
  if (c.shift) return { backgroundImage: `linear-gradient(120deg, ${c.hex}, ${c.shift})` }
  return { backgroundColor: c.hex }
}

function LinePanel({ line }: { line: string }) {
  const d = LINE_DETAILS[line]
  const [sel, setSel] = useState(0)
  if (!d) {
    return (
      <div className="border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60">
        Informações técnicas desta linha no catálogo oficial.
        <Link to="/catalogos" className="ml-2 font-display font-bold uppercase text-alltak-blue link-underline">
          Baixar catálogo →
        </Link>
      </div>
    )
  }
  const color = d.colors[Math.min(sel, d.colors.length - 1)]
  return (
    <div className="grid gap-6 border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[1.2fr_1fr]">
      <div>
        <p className="text-sm text-white/65">{d.desc}</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {d.colors.map((c, i) => (
            <button
              key={c.code}
              onClick={() => setSel(i)}
              title={`${c.name} · ${c.code}`}
              aria-label={c.name}
              className={`h-10 w-14 border transition clip-escudo ${
                i === sel ? 'border-alltak-blue ring-2 ring-alltak-blue' : 'border-white/20 hover:border-white/60'
              }`}
              style={swatchBg(c)}
            />
          ))}
        </div>
        <div className="mt-5 flex items-center gap-4">
          <div className="h-12 w-20 border border-white/20 clip-escudo" style={swatchBg(color)} aria-hidden />
          <div>
            <div className="font-display text-2xl font-extrabold uppercase text-white">{color.name}</div>
            <div className="font-display text-sm font-bold uppercase tracking-[0.2em] text-alltak-blue">
              Código {color.code}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-white/50">
          Informações técnicas
        </h4>
        <dl className="mt-3 divide-y divide-white/10 border-y border-white/10">
          {d.specs.map((s) => (
            <div key={s.label} className="flex items-center justify-between py-2.5 text-sm">
              <dt className="text-white/55">{s.label}</dt>
              <dd className="font-display font-bold uppercase text-white">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] text-white/35">
          *Especificações de referência. Confirme na ficha técnica oficial da linha.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/visualizador" className="btn-trapezoid btn-blue !py-2 !text-xs">Ver no visualizador</Link>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline !py-2 !text-xs">
            Comprar ↗
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Produtos() {
  const [openLine, setOpenLine] = useState<string | null>('Ultra')

  return (
    <>
      <PageHeader eyebrow="Portfólio completo" title="Produtos">
        Um portfólio completo para diferentes estilos e necessidades. Clique em uma
        linha para ver cores, códigos e informações técnicas.
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue !py-2 !text-xs">
            Comprar na Alltak Store ↗
          </a>
          <Link to="/onde-comprar" className="btn-trapezoid btn-outline !py-2 !text-xs">
            Onde comprar
          </Link>
        </div>
      </PageHeader>

      <section className="bg-alltak-black py-16 md:py-24">
        <div className="container-x space-y-16">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug}>
              <div className="grid items-start gap-8 md:grid-cols-5">
                <div className={`md:col-span-2 ${i % 2 ? 'md:order-2' : ''}`}>
                  <div className="frame-trap aspect-[4/3] bg-alltak-navy cursor-hot">
                    <img src={CATEGORY_IMAGE[cat.slug]} alt={cat.name} loading="lazy" className="img-zoom" />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h2 className="text-4xl text-white md:text-5xl">{cat.name}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cat.items.map((it) => {
                      const active = openLine === it
                      const has = !!LINE_DETAILS[it]
                      return (
                        <button
                          key={it}
                          onClick={() => setOpenLine(active ? null : it)}
                          className={`px-3 py-1.5 text-sm transition font-display font-semibold uppercase tracking-wide ${
                            active
                              ? 'bg-alltak-blue text-white'
                              : has
                                ? 'border border-alltak-blue/50 text-white hover:bg-alltak-blue/20'
                                : 'border border-white/15 text-white/70 hover:border-white/40'
                          }`}
                        >
                          {it}
                          {has && <span className="ml-1.5 text-[10px] opacity-70">▾</span>}
                        </button>
                      )
                    })}
                  </div>
                  {openLine && cat.items.includes(openLine) && (
                    <div className="mt-5 animate-[fadein_.4s_ease]">
                      <LinePanel line={openLine} />
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
