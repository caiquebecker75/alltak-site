import { Link, Navigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { DOWNLOADS, texto, tipoArquivo, type GrupoDownload } from '../data/downloads'
import { useLeadGate } from '../lead/LeadGate'
import { useI18n } from '../i18n'
import miniaturas from '../data/miniaturas.json'

// miniatura de cada arquivo (migracao/miniaturas_downloads.py): 1ª página do
// PDF, a imagem do TIF ou a 1ª imagem do ZIP; perfis de cor não têm imagem
const MINI = miniaturas as Record<string, string>
const miniDe = (g: GrupoDownload) => g.itens.map((a) => (g.pasta ? a.arquivo : MINI[a.arquivo])).find(Boolean)

function Miniatura({ arquivo, nome, tipo, claro = true }: { arquivo: string; nome: string; tipo: string; claro?: boolean }) {
  const src = MINI[arquivo]
  return (
    <div className={`flex aspect-[4/3] items-center justify-center overflow-hidden p-3 ${claro ? 'bg-alltak-black/5' : 'bg-alltak-black'}`}>
      {src ? (
        <img src={src} alt={nome} loading="lazy" className="max-h-full max-w-full object-contain shadow-sm" />
      ) : (
        // perfil de cor: sem imagem, um selo com as cores de impressão
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-3 w-28 overflow-hidden">
            {['#00a3e0', '#e5007e', '#ffed00', '#1d1d1b'].map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}
          </div>
          <span className="font-display text-2xl font-black uppercase tracking-[0.2em] text-alltak-black/60">{tipo}</span>
        </div>
      )}
    </div>
  )
}

// Downloads como no site antigo: a página principal lista os seis grupos
// (catálogos, logotipos, perfis de cor, pattern, wallpaper, instalador) e
// cada grupo tem a sua página com os arquivos. Download com cadastro (leads).

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
                className="group flex h-full flex-col border border-black/10 bg-white transition hover:border-alltak-blue hover:shadow-lg">
                {miniDe(g) ? (
                  <div className="flex aspect-[16/9] items-center justify-center overflow-hidden bg-alltak-black/5 p-3">
                    <img src={miniDe(g)} alt="" loading="lazy" className="max-h-full max-w-full object-contain shadow-sm transition duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <Miniatura arquivo="" nome="" tipo="ICC" />
                )}
                <div className="flex flex-1 flex-col p-7">
                <div className="mb-4 h-1.5 w-14 bg-alltak-blue clip-slant" />
                <h2 className="text-3xl leading-none transition group-hover:text-alltak-blueDark md:text-4xl">{texto(g.titulo, lang)}</h2>
                <p className="mt-2 text-base text-alltak-black/65">{texto(g.desc, lang)}</p>
                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="text-sm text-alltak-black/50">
                    {g.pasta ? `${g.itens.length} ${t('dl.artes')} · Google Drive` : `${g.itens.length} ${t(g.itens.length === 1 ? 'dl.arquivo' : 'dl.arquivos')}`}
                  </span>
                  <span className="font-display text-base font-bold uppercase tracking-wide text-alltak-blueDark transition-transform group-hover:translate-x-1">
                    {t('dl.acessar')} →
                  </span>
                </div>
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

          {g.pasta ? (
            // arquivos numa pasta externa: prévia das artes + um botão para a pasta
            <>
              {g.intro && <p className="mt-10 max-w-3xl text-lg text-alltak-black/75">{texto(g.intro, lang)}</p>}
              <button onClick={() => open({ title: texto(g.titulo, lang), url: g.pasta!, kind: 'Google Drive' })}
                className="btn-trapezoid btn-blue mt-6">
                {t('dl.acessarArquivos')} ↗
              </button>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {g.itens.map((a, i) => (
                  <Reveal key={a.arquivo} delay={i * 60}>
                    <figure className="h-full border border-black/10 bg-white">
                      <div className="flex aspect-[4/3] items-center justify-center bg-alltak-black/5 p-3">
                        <img src={a.arquivo} alt={texto(a.nome, lang)} loading="lazy" className="max-h-full max-w-full object-contain" />
                      </div>
                      <figcaption className="p-4">
                        <div className="font-display text-lg font-bold uppercase leading-tight">{texto(a.nome, lang)}</div>
                        {a.desc && <div className="text-sm text-alltak-black/55">{texto(a.desc, lang)}</div>}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
          <div className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${catalogos ? '' : 'xl:grid-cols-4'}`}>
            {g.itens.map((a, i) => {
              const nome = texto(a.nome, lang)
              const tipo = tipoArquivo(a.arquivo)
              const baixar = () => open({ title: catalogos ? `${t('cat.catalogo')} ${nome}` : nome, url: a.arquivo, kind: tipo })
              return (
                <Reveal key={a.arquivo} delay={(i % 4) * 50}>
                  {catalogos ? (
                    <div className="flex h-full flex-col border border-black/10 bg-white transition hover:border-alltak-blue hover:shadow-lg">
                      <button onClick={baixar} aria-label={nome}><Miniatura arquivo={a.arquivo} nome={nome} tipo={tipo} /></button>
                      <div className="flex flex-1 flex-col p-7">
                        <div className="mb-4 h-1.5 w-14 bg-alltak-blue clip-slant" />
                        <h3 className="text-3xl">{nome}</h3>
                        {a.desc && <p className="mt-2 text-base text-alltak-black/65">{texto(a.desc, lang)}</p>}
                        <div className="mt-auto pt-6">
                          <button onClick={baixar} className="btn-trapezoid btn-blue !py-2.5 !text-base">
                            {t('cta.baixarCatalogo')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button onClick={baixar}
                      className="group flex h-full w-full flex-col border border-black/10 bg-white text-left transition hover:border-alltak-blue">
                      <Miniatura arquivo={a.arquivo} nome={nome} tipo={tipo} />
                      <div className="flex w-full flex-1 items-end justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <div className="font-display text-sm font-bold uppercase tracking-[0.2em] text-alltak-blueDark">{tipo}</div>
                          <div className="mt-0.5 font-display text-lg font-bold uppercase leading-tight">{nome}</div>
                        </div>
                        <span className="shrink-0 bg-alltak-blue px-4 py-2 font-display text-base font-bold uppercase tracking-wide text-white clip-tz transition-transform group-hover:-translate-y-0.5">
                          {t('cat.baixar')}
                        </span>
                      </div>
                    </button>
                  )}
                </Reveal>
              )
            })}
          </div>
          )}
        </div>
      </section>
    </>
  )
}
