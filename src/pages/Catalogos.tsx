import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CATALOGS } from '../data/site'
import { useLeadGate, type Download } from '../lead/LeadGate'

// Logos & manuais — download gated by the lead form.
// ⚠️ URLs de exemplo: apontar para os PDFs/ZIPs oficiais da Alltak.
const MATERIAIS: Download[] = [
  { title: 'Manual da Marca Alltak', url: '#', kind: 'PDF' },
  { title: 'Pacote de Logos (Wraps/Decor/Signs)', url: '#', kind: 'ZIP' },
  { title: 'Manual de Aplicação', url: '#', kind: 'PDF' },
  { title: 'Tabela Técnica Geral', url: '#', kind: 'PDF' },
]

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
                    open({ title: c.name.startsWith('Catálogo') ? c.name : `Catálogo ${c.name}`, url: '#', kind: 'PDF' })
                  }
                  className="btn-trapezoid btn-blue mt-6 self-start !py-2 !text-xs"
                >
                  Baixar catálogo
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

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {MATERIAIS.map((m, i) => (
              <Reveal key={m.title} delay={i * 70}>
                <button
                  onClick={() => open(m)}
                  className="group flex w-full items-center justify-between gap-4 border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-alltak-blue hover:bg-white/[0.06]"
                >
                  <div>
                    <div className="font-display text-xs font-bold uppercase tracking-[0.25em] text-alltak-blue">
                      {m.kind}
                    </div>
                    <h3 className="mt-1 text-2xl text-white">{m.title}</h3>
                  </div>
                  <span className="shrink-0 bg-alltak-blue px-4 py-3 font-display text-xs font-bold uppercase text-white clip-tz transition-transform group-hover:-translate-y-0.5">
                    Baixar ↓
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
