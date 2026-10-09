import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CATALOGS } from '../data/site'
import { useLeadGate } from '../lead/LeadGate'
import downloads from '../data/wp/downloads.json'
import { useI18n } from '../i18n'

// Grupos de materiais migrados do site antigo (logos, patterns, perfis de
// cor, wallpapers, materiais do instalador) — download com cadastro (leads).
// rótulos de download vindos do WordPress: alguns são o nome do arquivo
// ("CHECK-LIST-PARA-ENVELOPAMENTO-ALLTAK.PDF"); vira texto legível e traduzido
function rotuloDownload(r: string, tv: (v: string) => string): string {
  const limpo = /\.pdf$/i.test(r) && r.includes('-')
    ? r.replace(/\.pdf$/i, '').replace(/-/g, ' ').toLowerCase().replace(/^./, (l) => l.toUpperCase()).replace(/\balltak\b/i, 'Alltak')
    : r
  return tv(limpo)
}

type Grupo = { titulo: string; itens: { rotulo: string; arquivo: string }[]; links_externos: string[] }
const GRUPOS_ORDEM = ['logos', 'patterns', 'perfis-de-cor', 'wallpapers', 'instalador'] as const
// chave do nome de cada grupo (dict-paginas.ts)
const GRUPO_NOME: Record<string, string> = {
  logos: 'cat.grupo.logos', patterns: 'cat.grupo.patterns', 'perfis-de-cor': 'cat.grupo.perfis',
  wallpapers: 'cat.grupo.wallpapers', instalador: 'cat.grupo.instalador',
}
// 'Arquivo' é traduzido na exibição (t('cat.arquivo'))
const kindOf = (arq: string) =>
  arq.toLowerCase().includes('.zip') ? 'ZIP' : arq.toLowerCase().includes('.pdf') ? 'PDF' : 'Arquivo'

export default function Catalogos() {
  const { open } = useLeadGate()
  const { t, tv } = useI18n()
  const tipo = (arq: string) => {
    const k = kindOf(arq)
    return k === 'Arquivo' ? t('cat.arquivo') : k
  }

  return (
    <>
      <PageHeader eyebrow={t('cat.eyebrow')} title={t('nav.catalogos')}>
        {t('cat.headerSub')}
      </PageHeader>

      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATALOGS.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <div className="flex h-full flex-col justify-between border border-black/10 bg-white p-7 transition hover:border-alltak-blue hover:shadow-lg">
                <div>
                  <div className="mb-4 h-1.5 w-14 bg-alltak-blue clip-slant" />
                  <h3 className="text-3xl">{tv(c.name)}</h3>
                  <p className="mt-2 text-sm text-alltak-black/60">{tv(c.desc)}</p>
                </div>
                <button
                  onClick={() =>
                    open({
                      title: c.name.startsWith('Catálogo') ? tv(c.name) : `${t('cat.catalogo')} ${tv(c.name)}`,
                      url: c.file ?? '#',
                      kind: 'PDF',
                    })
                  }
                  className="btn-trapezoid btn-blue mt-6 self-start !py-2 !text-xs"
                >
                  {c.file ? t('cta.baixarCatalogo') : t('cat.emBreve')}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Logos e Manuais — download com cadastro (leads) */}
      <section className="bg-alltak-black py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <span className="tag">{t('cat.marcaTag')}</span>
            <h2 className="mt-4 text-4xl text-white md:text-6xl">{t('cat.marcaTitulo')}</h2>
            <p className="mt-3 max-w-2xl text-white/60">{t('cat.marcaTexto')}</p>
          </Reveal>

          <div className="mt-10 space-y-10">
            {GRUPOS_ORDEM.map((g) => {
              const grupo = (downloads as Record<string, Grupo>)[g]
              if (!grupo || grupo.itens.length === 0) return null
              return (
                <div key={g}>
                  <h3 className="font-display text-2xl font-bold uppercase text-white">
                    {t(GRUPO_NOME[g])} <span className="text-white/40">· {grupo.itens.length}</span>
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {grupo.itens.map((m, i) => (
                      <Reveal key={m.arquivo} delay={(i % 3) * 60}>
                        <button
                          onClick={() => open({ title: rotuloDownload(m.rotulo, tv), url: m.arquivo, kind: tipo(m.arquivo) })}
                          className="group flex w-full items-center justify-between gap-3 border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-alltak-blue hover:bg-white/[0.06]"
                        >
                          <div className="min-w-0">
                            <div className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-alltak-blue">
                              {tipo(m.arquivo)}
                            </div>
                            <div className="mt-0.5 truncate font-display text-base font-bold uppercase text-white">
                              {rotuloDownload(m.rotulo, tv)}
                            </div>
                          </div>
                          <span className="shrink-0 bg-alltak-blue px-3 py-2 font-display text-[10px] font-bold uppercase text-white clip-tz transition-transform group-hover:-translate-y-0.5">
                            {t('cat.baixar')}
                          </span>
                        </button>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
