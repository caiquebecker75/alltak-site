import { Link, Navigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import subAcademy from '../brand/sub-academy.png'
import { CONTATO_CURSOS, CURSOS_TOPO, HOSPEDAGEM, cursoPorSlug, type Curso } from '../data/cursos'
import { useT } from '../i18n'

// Cursos como no site antigo: a página principal tem os três cursos
// (Academia de Envelopamento, Alltak Experience, Treinamento Alltak Decor);
// a Academia abre os módulos Intermediário e Avançado. Conteúdo em
// src/data/cursos.ts (em português, como o blog); datas e inscrições ficam na
// Alltak Store e na Doity.

function CardCurso({ c, i }: { c: Curso; i: number }) {
  const t = useT()
  return (
    <Reveal delay={i * 80}>
      <Link to={`/cursos/${c.slug}`} className="group flex h-full flex-col border border-black/10 bg-white transition hover:border-alltak-blue hover:shadow-lg">
        <div className="aspect-[16/9] overflow-hidden bg-alltak-black">
          <img src={c.imagem} alt={c.nome} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-alltak-blueDark">{c.chamada}</p>
          <h2 className="mt-1 text-3xl leading-none md:text-4xl">{c.nome}</h2>
          <p className="mt-3 text-base text-alltak-black/65">{c.resumo}</p>
          <span className="mt-auto pt-5 font-display text-base font-bold uppercase tracking-wide text-alltak-blueDark transition-transform group-hover:translate-x-1">
            {t('curso.verMais')} →
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

export default function Cursos() {
  const t = useT()
  return (
    <>
      <PageHeader eyebrow={t('cursos.eyebrow')} title={t('cursos.titulo')}>
        <img src={subAcademy} alt="Alltak Academy" className="mb-4 h-10 w-auto select-none md:h-12" draggable={false} />
        {t('cursos.headerSub')}
      </PageHeader>
      <section className="bg-alltak-cream py-14 text-alltak-black md:py-20">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CURSOS_TOPO.map((s, i) => {
            const c = cursoPorSlug(s)
            return c ? <CardCurso key={s} c={c} i={i} /> : null
          })}
        </div>
      </section>
    </>
  )
}

const hoje = () => new Date().toISOString().slice(0, 10)

export function CursoDetalhe() {
  const { slug } = useParams()
  const t = useT()
  const c = cursoPorSlug(slug)
  if (!c) return <Navigate to="/cursos" replace />
  const pai = c.pai ? cursoPorSlug(c.pai) : undefined
  const proximos = (c.eventos ?? []).filter((e) => e.data >= hoje())
  const whats = `https://wa.me/${CONTATO_CURSOS.whatsapp}`

  return (
    <>
      <PageHeader eyebrow={pai ? pai.nome : t('cursos.titulo')} title={c.nome}>
        {c.resumo}
        <div className="mt-6 flex flex-wrap gap-3">
          {c.agenda && (
            <a href={c.agenda} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue">{t('curso.verDatas')} ↗</a>
          )}
          <a href={whats} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline">{t('curso.duvidas')}</a>
        </div>
      </PageHeader>

      <section className="bg-alltak-cream py-12 text-alltak-black md:py-16">
        <div className="container-x">
          <Link to={pai ? `/cursos/${pai.slug}` : '/cursos'}
            className="font-display text-base font-bold uppercase tracking-wide text-alltak-blueDark hover:text-alltak-blue">
            ← {pai ? pai.nome : t('curso.todos')}
          </Link>
          <BannerCurso c={c} pai={pai?.nome} />

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            {/* conteúdo */}
            <div className="space-y-10">
              {c.blocos.map((b) => (
                <Reveal key={b.titulo}>
                  <div>
                    <h2 className="text-3xl md:text-4xl">{b.titulo}</h2>
                    {b.texto?.map((p, i) => <p key={i} className="mt-3 text-base leading-relaxed text-alltak-black/75 md:text-lg">{p}</p>)}
                    {b.lista && (
                      <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                        {b.lista.map((l) => (
                          <li key={l} className="flex gap-2 text-base text-alltak-black/80">
                            <span className="mt-2 h-1.5 w-3 shrink-0 bg-alltak-blue clip-slant" />{l}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              ))}

              {/* módulos da Academia */}
              {c.modulos && (
                <div>
                  <h2 className="text-3xl md:text-4xl">{t('curso.modulos')}</h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {c.modulos.map((s, i) => {
                      const m = cursoPorSlug(s)
                      return m ? <CardCurso key={s} c={m} i={i} /> : null
                    })}
                  </div>
                </div>
              )}

              {/* agenda da Alltak Experience */}
              {c.eventos && (
                <div>
                  <h2 className="text-3xl md:text-4xl">{t('curso.agenda')}</h2>
                  {proximos.length === 0 ? (
                    <p className="mt-3 text-base text-alltak-black/70">
                      {t('curso.semDatas')}{' '}
                      <a href={whats} target="_blank" rel="noreferrer" className="font-semibold text-alltak-blueDark hover:underline">WhatsApp ↗</a>
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {proximos.map((e) => (
                        <div key={e.url} className="border border-black/10 bg-white p-5">
                          <h3 className="font-display text-xl font-bold uppercase leading-tight">{e.titulo}</h3>
                          <p className="mt-1 text-base text-alltak-black/70">{e.local} · {e.quando}</p>
                          <a href={e.url} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue mt-4 !py-2 !text-base">{t('curso.inscreva')} ↗</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {c.galeria && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {c.galeria.map((g) => (
                    <div key={g} className="aspect-[4/3] overflow-hidden bg-alltak-black/5">
                      <img src={g} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ficha do curso */}
            {(c.fatos || c.incluso) && (
              <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                <div className="border-t-4 border-alltak-blue bg-white p-6">
                  {c.fatos?.investimento && (
                    <div className="mb-5">
                      <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-alltak-blueDark">{t('curso.investimento')}</p>
                      <p className="mt-1 font-display text-3xl font-black">{c.fatos.investimento}</p>
                    </div>
                  )}
                  <dl className="space-y-4 text-base">
                    {c.fatos?.carga && <Fato rotulo={t('curso.carga')} valor={c.fatos.carga} />}
                    {c.fatos?.local && <Fato rotulo={t('curso.local')} valor={c.fatos.local} />}
                    {c.fatos?.requisitos && <Fato rotulo={t('curso.requisitos')} valor={c.fatos.requisitos} />}
                  </dl>
                  {c.incluso && (
                    <div className="mt-5">
                      <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-alltak-blueDark">{t('curso.incluso')}</p>
                      <ul className="mt-2 space-y-1.5">
                        {c.incluso.map((x) => <li key={x} className="text-base text-alltak-black/80">✓ {x}</li>)}
                      </ul>
                    </div>
                  )}
                  {c.agenda && (
                    <a href={c.agenda} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue mt-6 w-full justify-center">{t('curso.verDatas')} ↗</a>
                  )}
                  <a href={HOSPEDAGEM} target="_blank" rel="noreferrer" className="mt-4 block text-sm text-alltak-black/60 hover:text-alltak-blueDark">
                    {t('curso.hospedagem')} ↗
                  </a>
                </div>
                <div className="text-sm text-alltak-black/65">
                  <p className="font-semibold text-alltak-black">{t('curso.informacoes')}</p>
                  <p className="mt-1">
                    <a href={`tel:+551139885022`} className="hover:text-alltak-blueDark">{CONTATO_CURSOS.telefone}</a>
                    {' · '}
                    <a href={whats} target="_blank" rel="noreferrer" className="hover:text-alltak-blueDark">WhatsApp (11) 98948-3158</a>
                    {' · '}
                    <a href={`mailto:${CONTATO_CURSOS.email}`} className="hover:text-alltak-blueDark">{CONTATO_CURSOS.email}</a>
                  </p>
                </div>
              </aside>
            )}
          </div>

          {c.leia && (
            <details className="mt-12 border border-black/10 bg-white p-6">
              <summary className="cursor-pointer font-display text-xl font-bold uppercase">{t('curso.leia')}</summary>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-alltak-black/70">
                {c.leia.map((l) => <li key={l}>• {l}</li>)}
              </ul>
            </details>
          )}
        </div>
      </section>
    </>
  )
}

// arte do curso no padrão do site: faixa escura com título e foto recortada
// em trapézio (substitui as artes de 2021, que tinham o texto na imagem)
function BannerCurso({ c, pai }: { c: Curso; pai?: string }) {
  return (
    <div className="relative mt-6 overflow-hidden bg-alltak-navyDeep">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.07]" style={{ backgroundImage: "url('./assets/caveiras.avif')" }} aria-hidden />
      <div className="relative grid min-h-[15rem] items-center md:grid-cols-[1.1fr_1fr]">
        <div className="relative z-10 p-7 md:p-10">
          <img src={subAcademy} alt="Alltak Academy" className="h-8 w-auto select-none md:h-10" draggable={false} />
          {pai && <p className="mt-5 font-display text-base font-bold uppercase tracking-[0.2em] text-alltak-blue">{pai}</p>}
          <p className={`${pai ? 'mt-1' : 'mt-5'} font-display text-5xl font-black uppercase leading-[0.9] text-white md:text-6xl`}>{c.nome}</p>
          <p className="mt-3 font-display text-lg font-bold uppercase tracking-wide text-white/70">{c.chamada}</p>
        </div>
        <div className="h-56 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[55%]">
          <img src={c.imagem} alt="" className="h-full w-full object-cover md:[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
        </div>
      </div>
    </div>
  )
}

function Fato({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="font-display text-sm font-bold uppercase tracking-[0.18em] text-alltak-blueDark">{rotulo}</dt>
      <dd className="mt-0.5 text-alltak-black/80">{valor}</dd>
    </div>
  )
}
