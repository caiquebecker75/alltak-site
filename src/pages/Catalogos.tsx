import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CATALOGS } from '../data/site'
import { useLeadGate } from '../lead/LeadGate'
import downloads from '../data/wp/downloads.json'

// Grupos de materiais migrados do site antigo (logos, patterns, perfis de
// cor, wallpapers, materiais do instalador) — download com cadastro (leads).
type Grupo = { titulo: string; itens: { rotulo: string; arquivo: string }[]; links_externos: string[] }
const GRUPOS_ORDEM = ['logos', 'patterns', 'perfis-de-cor', 'wallpapers', 'instalador'] as const
const GRUPO_NOME: Record<string, string> = {
  logos: 'Logos da marca', patterns: 'Patterns', 'perfis-de-cor': 'Perfis de cor',
  wallpapers: 'Wallpapers Alltak Tuning', instalador: 'Materiais do instalador',
}
const kindOf = (arq: string) =>
  arq.toLowerCase().includes('.zip') ? 'ZIP' : arq.toLowerCase().includes('.pdf') ? 'PDF' : 'Arquivo'

export default function Catalogos() {
  const { open } = useLeadGate()

  return (
    <>
      <PageHeader eyebrow="Materiais de apoio" title="Catálogos">
        Organizados por linha para facilitar a escolha do produto certo. Baixe,
        consulte e resolva rápido no atendimento, na especificação e na aplicação.
      </PageHeader>

      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATALOGS.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <div className="flex h-full flex-col justify-between border border-black/10 bg-white p-7 transition hover:border-alltak-blue hover:shadow-lg">
                <div>
                  <div className="mb-4 h-1.5 w-14 bg-alltak-blue clip-slant" />
                  <h3 className="text-3xl">{c.name}</h3>
                  <p className="mt-2 text-sm text-alltak-black/60">{c.desc}</p>
                </div>
                <button
                  onClick={() =>
                    open({
                      title: c.name.startsWith('Catálogo') ? c.name : `Catálogo ${c.name}`,
                      url: c.file ?? '#',
                      kind: 'PDF',
                    })
                  }
                  className="btn-trapezoid btn-blue mt-6 self-start !py-2 !text-xs"
                >
                  {c.file ? 'Baixar catálogo' : 'Em breve'}
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
            <span className="tag">Materiais da marca</span>
            <h2 className="mt-4 text-4xl text-white md:text-6xl">Logos e manuais</h2>
            <p className="mt-3 max-w-2xl text-white/60">
              Baixe os materiais oficiais da Alltak. O download é liberado após um
              cadastro rápido, para mantermos você por dentro das novidades e do suporte.
            </p>
          </Reveal>

          <div className="mt-10 space-y-10">
            {GRUPOS_ORDEM.map((g) => {
              const grupo = (downloads as Record<string, Grupo>)[g]
              if (!grupo || grupo.itens.length === 0) return null
              return (
                <div key={g}>
                  <h3 className="font-display text-2xl font-bold uppercase text-white">
                    {GRUPO_NOME[g]} <span className="text-white/40">· {grupo.itens.length}</span>
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {grupo.itens.map((m, i) => (
                      <Reveal key={m.arquivo} delay={(i % 3) * 60}>
                        <button
                          onClick={() => open({ title: m.rotulo, url: m.arquivo, kind: kindOf(m.arquivo) })}
                          className="group flex w-full items-center justify-between gap-3 border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-alltak-blue hover:bg-white/[0.06]"
                        >
                          <div className="min-w-0">
                            <div className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-alltak-blue">
                              {kindOf(m.arquivo)}
                            </div>
                            <div className="mt-0.5 truncate font-display text-base font-bold uppercase text-white">
                              {m.rotulo}
                            </div>
                          </div>
                          <span className="shrink-0 bg-alltak-blue px-3 py-2 font-display text-[10px] font-bold uppercase text-white clip-tz transition-transform group-hover:-translate-y-0.5">
                            Baixar ↓
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
