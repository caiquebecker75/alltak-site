import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import subAcademy from '../brand/sub-academy.png'

const CURSOS = [
  { nome: 'Academia de Envelopamento', nivel: 'Básico', desc: 'Fundamentos de aplicação e manuseio dos materiais.' },
  { nome: 'Módulo Intermediário', nivel: 'Intermediário', desc: 'Técnicas de aplicação em superfícies complexas.' },
  { nome: 'Módulo Avançado', nivel: 'Avançado', desc: 'Acabamento profissional e produtividade.' },
  { nome: 'Treinamento Alltak Decor', nivel: 'Especial', desc: 'Aplicação de revestimentos em ambientes.' },
  { nome: 'Alltak Experience', nivel: 'Imersão', desc: 'Experiência completa com a marca e os produtos.' },
]

export default function Cursos() {
  return (
    <>
      <PageHeader eyebrow="Academia Alltak" title="Cursos">
        <img
          src={subAcademy}
          alt="Alltak Academy"
          className="mb-4 h-10 w-auto select-none md:h-12"
          draggable={false}
        />
        Treinamentos para elevar o nível da sua aplicação. Sem turmas com data aberta
        no momento — deixe seu interesse para as próximas.
      </PageHeader>

      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CURSOS.map((c, i) => (
            <Reveal key={c.nome} delay={i * 60}>
              <div className="flex h-full flex-col justify-between border border-black/10 bg-white p-7">
                <div>
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-alltak-blue">{c.nivel}</span>
                  <h3 className="mt-2 text-2xl">{c.nome}</h3>
                  <p className="mt-2 text-sm text-alltak-black/60">{c.desc}</p>
                </div>
                <button className="btn-trapezoid btn-blue mt-6 self-start !py-2 !text-xs">Tenho interesse</button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
