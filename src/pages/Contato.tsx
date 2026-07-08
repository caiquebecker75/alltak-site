import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const PERFIS = ['Aplicador', 'Distribuidor', 'Arquiteto', 'Gráfica', 'Consumidor final', 'Outro']
const ASSUNTOS = ['Compra', 'Produto', 'Suporte técnico', 'Revenda', 'Cursos', 'Institucional', 'Outro']

const field = 'w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-alltak-blue'

export default function Contato() {
  const [sent, setSent] = useState(false)

  return (
    <>
      <PageHeader eyebrow="Fale com a Alltak" title="Contato">
        Preencha o formulário e nossa equipe retornará. Para compras, use a Alltak Store;
        para dúvidas técnicas, o suporte especializado.
      </PageHeader>

      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {sent ? (
              <div className="border border-alltak-blue bg-white p-8">
                <h3 className="text-3xl text-alltak-blue">Mensagem enviada!</h3>
                <p className="mt-2 text-alltak-black/70">
                  Obrigado pelo contato. Retornaremos em breve. (Formulário de demonstração —
                  integrar ao e-mail/CRM da Alltak.)
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <input required placeholder="Nome" className={field} />
                <input placeholder="Empresa" className={field} />
                <input required type="email" placeholder="E-mail" className={field} />
                <input placeholder="WhatsApp" className={field} />
                <input placeholder="Cidade" className={field} />
                <input placeholder="Estado" className={field} />
                <select className={field} defaultValue="">
                  <option value="" disabled>Perfil</option>
                  {PERFIS.map((p) => <option key={p}>{p}</option>)}
                </select>
                <select className={field} defaultValue="">
                  <option value="" disabled>Assunto</option>
                  {ASSUNTOS.map((a) => <option key={a}>{a}</option>)}
                </select>
                <textarea required placeholder="Mensagem" rows={5} className={`${field} sm:col-span-2`} />
                <button type="submit" className="btn-trapezoid btn-blue sm:col-span-2 justify-self-start">
                  Enviar mensagem
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div>
              <h4 className="font-display text-xl font-bold uppercase">Atendimento</h4>
              <p className="mt-2 text-sm text-alltak-black/70">Seg. a Sex., 8h às 18h</p>
            </div>
            <div>
              <h4 className="font-display text-xl font-bold uppercase">E-mail</h4>
              <p className="mt-2 text-sm text-alltak-black/70">contato@alltak.com.br</p>
            </div>
            <div>
              <h4 className="font-display text-xl font-bold uppercase">Endereço</h4>
              <p className="mt-2 text-sm text-alltak-black/70">
                Preencher com o endereço oficial da Alltak.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
