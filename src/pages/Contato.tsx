import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useT } from '../i18n'

// valor enviado (sempre em PT, para o e-mail/CRM) + chave do rótulo exibido
const PERFIS = [
  ['Aplicador', 'contato.perfil.aplicador'],
  ['Distribuidor', 'contato.perfil.distribuidor'],
  ['Arquiteto', 'contato.perfil.arquiteto'],
  ['Gráfica', 'contato.perfil.grafica'],
  ['Consumidor final', 'contato.perfil.consumidor'],
  ['Outro', 'contato.outro'],
]
const ASSUNTOS = [
  ['Compra', 'contato.assunto.compra'],
  ['Produto', 'contato.assunto.produto'],
  ['Suporte técnico', 'contato.assunto.suporte'],
  ['Revenda', 'contato.assunto.revenda'],
  ['Cursos', 'contato.assunto.cursos'],
  ['Institucional', 'contato.assunto.institucional'],
  ['Outro', 'contato.outro'],
]

const field = 'w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-alltak-blue'

export default function Contato() {
  const [sent, setSent] = useState(false)
  const t = useT()

  return (
    <>
      <PageHeader eyebrow={t('contato.eyebrow')} title={t('nav.contato')}>
        {t('contato.headerSub')}
      </PageHeader>

      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {sent ? (
              <div className="border border-alltak-blue bg-white p-8">
                <h3 className="text-3xl text-alltak-blue">{t('contato.enviado')}</h3>
                <p className="mt-2 text-alltak-black/70">{t('contato.enviadoTexto')}</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <input required placeholder={t('contato.nome')} className={field} />
                <input placeholder={t('contato.empresa')} className={field} />
                <input required type="email" placeholder={t('contato.email')} className={field} />
                <input placeholder={t('contato.whatsapp')} className={field} />
                <input placeholder={t('contato.cidade')} className={field} />
                <input placeholder={t('contato.estado')} className={field} />
                <select className={field} defaultValue="">
                  <option value="" disabled>{t('contato.perfil')}</option>
                  {PERFIS.map(([v, k]) => <option key={v} value={v}>{t(k)}</option>)}
                </select>
                <select className={field} defaultValue="">
                  <option value="" disabled>{t('contato.assunto')}</option>
                  {ASSUNTOS.map(([v, k]) => <option key={v} value={v}>{t(k)}</option>)}
                </select>
                <textarea required placeholder={t('contato.mensagem')} rows={5} className={`${field} sm:col-span-2`} />
                <button type="submit" className="btn-trapezoid btn-blue sm:col-span-2 justify-self-start">
                  {t('contato.enviar')}
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div>
              <h4 className="font-display text-xl font-bold uppercase">{t('contato.atendimento')}</h4>
              <p className="mt-2 text-sm text-alltak-black/70">{t('contato.horario')}</p>
            </div>
            <div>
              <h4 className="font-display text-xl font-bold uppercase">{t('contato.email')}</h4>
              <p className="mt-2 text-sm text-alltak-black/70">contato@alltak.com.br</p>
            </div>
            <div>
              <h4 className="font-display text-xl font-bold uppercase">{t('contato.endereco')}</h4>
              <p className="mt-2 text-sm text-alltak-black/70">{t('contato.enderecoTexto')}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
