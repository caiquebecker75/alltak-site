import { Link, Navigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { DOWNLOADS, texto, tipoArquivo, type GrupoDownload } from '../data/downloads'
import { useLeadGate } from '../lead/LeadGate'
import { useI18n } from '../i18n'

// Downloads como no site antigo: a página principal lista os seis grupos
// (catálogos, logotipos, perfis de cor, pattern, wallpaper, instalador) e
// cada grupo tem a sua página com os arquivos. Download com cadastro (leads).

function Abas({ ativo }: { ativo: string }) {
  const { lang } = useI18n()
  return (
    <div className="flex flex-wrap gap-2">
      {DOWNLOADS.map((g) => (
        <Link key={g.slug} to={`/downloads/${g.slug}`} aria-current={g.slug === ativo ? 'page' : undefined}
          className={`px-4 py-2 font-display text-base font-bold uppercase tracking-wide transition ${
            g.slug === ativo ? 'bg-alltak-blue text-white' : 'bg-white text-alltak-black hover:bg-black/5'
          }`}>
          {texto(g.titulo, lang)}
        </Link>
      ))}
    </div>
  )
}

export function DownloadsInicio() {
  const { lang, t } = useI18n()
  return (
    <>
      <PageHeader eyebrow={t('dl.eyebrow')} title={t('nav.downloads')}>
        {t('dl.headerSub')}
      </PageHeader>
      <section className="bg-alltak-cream py-14 text-alltak-black md:py-20">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOWNLOADS.map((g, i) => (
            <Reveal key={g.slug} delay={(i % 3) * 60}>
              <Link to={`/downloads/${g.slug}`}
                className="group flex h-full flex-col border border-black/10 bg-white p-7 transition hover:border-alltak-blue hover:shadow-lg">
                <div className="mb-4 h-1.5 w-14 bg-alltak-blue clip-slant" />
                <h2 className="text-3xl leading-none transition group-hover:text-alltak-blueDark md:text-4xl">{texto(g.titulo, lang)}</h2>
                <p className="mt-2 text-base text-alltak-black/65">{texto(g.desc, lang)}</p>
                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="text-sm text-alltak-black/50">
                    {g.itens.length} {t(g.itens.length === 1 ? 'dl.arquivo' : 'dl.arquivos')}
                  </span>
                  <span className="font-display text-base font-bold uppercase tracking-wide text-alltak-blueDark transition-transform group-hover:translate-x-1">
                    {t('dl.acessar')} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}

export function DownloadsGrupo() {
  const { grupo } = useParams()
  const g = DOWNLOADS.find((x) => x.slug === grupo)
  if (!g) return <Navigate to="/downloads" replace />
  return <Grupo g={g} />
}

function Grupo({ g }: { g: GrupoDownload }) {
  const { open } = useLeadGate()
  const { lang, t } = useI18n()
  const catalogos = g.slug === 'catalogos'

  return (
    <>
      <PageHeader eyebrow={t('nav.downloads')} title={texto(g.titulo, lang)}>
        {texto(g.desc, lang)} {t('dl.cadastro')}
      </PageHeader>
      <section className="bg-alltak-cream py-12 text-alltak-black md:py-16">
        <div className="container-x">
          <Link to="/downloads" className="font-display text-base font-bold uppercase tracking-wide text-alltak-blueDark hover:text-alltak-blue">
            ← {t('dl.todos')}
          </Link>
          <div className="mt-4"><Abas ativo={g.slug} /></div>

          <div className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${catalogos ? '' : 'xl:grid-cols-4'}`}>
            {g.itens.map((a, i) => {
              const nome = texto(a.nome, lang)
              const tipo = tipoArquivo(a.arquivo)
              const baixar = () => open({ title: catalogos ? `${t('cat.catalogo')} ${nome}` : nome, url: a.arquivo, kind: tipo })
              return (
                <Reveal key={a.arquivo} delay={(i % 4) * 50}>
                  {catalogos ? (
                    <div className="flex h-full flex-col border border-black/10 bg-white p-7 transition hover:border-alltak-blue hover:shadow-lg">
                      <div className="mb-4 h-1.5 w-14 bg-alltak-blue clip-slant" />
                      <h3 className="text-3xl">{nome}</h3>
                      {a.desc && <p className="mt-2 text-base text-alltak-black/65">{texto(a.desc, lang)}</p>}
                      <div className="mt-auto pt-6">
                        <button onClick={baixar} className="btn-trapezoid btn-blue !py-2.5 !text-base">
                          {t('cta.baixarCatalogo')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={baixar}
                      className="group flex h-full w-full items-center justify-between gap-3 border border-black/10 bg-white p-4 text-left transition hover:border-alltak-blue">
                      <div className="min-w-0">
                        <div className="font-display text-sm font-bold uppercase tracking-[0.2em] text-alltak-blueDark">{tipo}</div>
                        <div className="mt-0.5 font-display text-lg font-bold uppercase leading-tight">{nome}</div>
                      </div>
                      <span className="shrink-0 bg-alltak-blue px-4 py-2 font-display text-base font-bold uppercase tracking-wide text-white clip-tz transition-transform group-hover:-translate-y-0.5">
                        {t('cat.baixar')}
                      </span>
                    </button>
                  )}
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
