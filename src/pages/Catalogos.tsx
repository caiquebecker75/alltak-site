import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CATALOGS } from '../data/site'

export default function Catalogos() {
  return (
    <>
      <PageHeader eyebrow="Materiais de apoio" title="Catálogos">
        Organizados por linha para facilitar a escolha do produto certo. Baixe,
        consulte e resolva rápido no atendimento, na especificação e na aplicação.
      </PageHeader>

      <section className="bg-alltak-mist py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATALOGS.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <div className="flex h-full flex-col justify-between border border-black/10 bg-white p-7 transition hover:border-alltak-red hover:shadow-lg">
                <div>
                  <div className="mb-4 h-1.5 w-14 bg-alltak-red clip-slant" />
                  <h3 className="text-3xl">{c.name}</h3>
                  <p className="mt-2 text-sm text-alltak-black/60">{c.desc}</p>
                </div>
                <button className="btn-trapezoid btn-red mt-6 self-start !py-2 !text-xs">
                  Baixar catálogo
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
