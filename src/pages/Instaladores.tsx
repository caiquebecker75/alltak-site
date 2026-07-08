import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'

type Inst = { nome: string; cidade: string; uf: string; espec: string }
const INSTALADORES: Inst[] = [
  { nome: 'Aplicador Exemplo', cidade: 'São Paulo', uf: 'SP', espec: 'Envelopamento automotivo' },
  { nome: 'Aplicador Exemplo', cidade: 'Campinas', uf: 'SP', espec: 'Decor / ambientes' },
  { nome: 'Aplicador Exemplo', cidade: 'Rio de Janeiro', uf: 'RJ', espec: 'Frotas e sinalização' },
  { nome: 'Aplicador Exemplo', cidade: 'Curitiba', uf: 'PR', espec: 'Envelopamento automotivo' },
]

export default function Instaladores() {
  return (
    <>
      <PageHeader eyebrow="Aplicadores parceiros" title="Instaladores">
        Encontre aplicadores por região. A negociação e a execução do serviço
        acontecem diretamente entre cliente e instalador.
      </PageHeader>

      <section className="bg-alltak-black py-16 md:py-24">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INSTALADORES.map((p, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-3 h-1.5 w-12 bg-alltak-blue clip-slant" />
                <h3 className="text-2xl text-white">{p.nome}</h3>
                <p className="mt-1 text-sm text-white/55">{p.cidade} · {p.uf}</p>
                <p className="mt-2 text-sm text-alltak-blue">{p.espec}</p>
                <button className="btn-trapezoid btn-outline mt-5 !py-2 !text-xs">Contato</button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
