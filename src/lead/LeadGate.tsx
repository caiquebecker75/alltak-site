import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { useI18n } from '../i18n'

// Lead-gated downloads: any download (catalog, logo, manual, technical bulletin)
// opens a registration form first. On submit the lead goes to the Alltak sheet
// (Apps Script na conta marketing@75lab.com.br, que grava na planilha e avisa
// por e-mail) and the file is released. localStorage é só reserva local.

// Recebedor de leads (planilha "Alltak · Leads do site" + aviso por e-mail)
const LEADS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxoU0M1aS8V0i7N9VPDrr2hCcg8179fwOvWybZ89CnuK3JoAjLNRdHI30QeZ9gaNW8c/exec'

// Content-Type text/plain: o Apps Script não responde à checagem prévia (CORS)
const enviarLead = (dados: Record<string, string>) => {
  try {
    void fetch(LEADS_ENDPOINT, { method: 'POST', body: JSON.stringify(dados) }).catch(() => null)
  } catch {
    /* lead fica na reserva local */
  }
}

export type Download = { title: string; url: string; kind?: string }
export type Lead = {
  nome: string
  email: string
  empresa: string
  whatsapp: string
  cidade: string
}

type Ctx = { open: (d: Download) => void }
const LeadCtx = createContext<Ctx>({ open: () => {} })
export const useLeadGate = () => useContext(LeadCtx)

const LS_KEY = 'alltak_lead'
const field =
  'w-full border border-black/15 bg-white px-4 py-3 text-sm text-alltak-black outline-none focus:border-alltak-blue'

export function LeadGateProvider({ children }: { children: ReactNode }) {
  const [download, setDownload] = useState<Download | null>(null)
  const [done, setDone] = useState(false)
  const { lang, t } = useI18n()

  const open = useCallback(
    (d: Download) => {
      setDone(false)
      // returning visitors skip the form; o download repetido também é registrado
      const salvo = localStorage.getItem(LS_KEY)
      if (salvo) {
        try {
          const lead = JSON.parse(salvo)
          if (lead && lead.email) {
            enviarLead({
              ...lead,
              material: d.title,
              pagina: window.location.pathname,
              idioma: lang,
              origem: 'site (retorno)',
            })
          }
        } catch {
          /* registro antigo sem dados */
        }
        setDownload(d)
        setDone(true)
      } else {
        setDownload(d)
      }
    },
    [lang],
  )

  const close = () => setDownload(null)

  const submit = (lead: Lead) => {
    enviarLead({
      ...lead,
      material: download?.title ?? '',
      pagina: window.location.pathname,
      idioma: lang,
      origem: 'site',
    })
    try {
      const prev = JSON.parse(localStorage.getItem('alltak_leads') || '[]')
      prev.push({ ...lead, at: new Date().toISOString(), file: download?.title })
      localStorage.setItem('alltak_leads', JSON.stringify(prev))
      localStorage.setItem(LS_KEY, JSON.stringify(lead))
    } catch {
      /* ignore storage errors */
    }
    setDone(true)
  }

  return (
    <LeadCtx.Provider value={{ open }}>
      {children}
      {download && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-lg overflow-hidden bg-alltak-cream text-alltak-black">
            <div className="bg-alltak-navy px-6 py-4">
              <span className="tag">{t('lead.tag')}</span>
              <h3 className="mt-2 font-display text-2xl font-extrabold uppercase text-white">
                {download.title}
              </h3>
            </div>

            {done ? (
              <div className="p-6 text-center">
                <div className="mx-auto mb-4 h-5 w-8 bg-alltak-blue clip-tz" />
                <h4 className="font-display text-2xl font-extrabold uppercase">{t('lead.pronto')}</h4>
                <p className="mt-2 text-sm text-alltak-black/65">
                  {t('lead.liberado')}
                </p>
                <a
                  href={download.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="btn-trapezoid btn-blue mt-5"
                  onClick={close}
                >
                  {t('lead.baixar')}
                </a>
              </div>
            ) : (
              <form
                className="grid gap-3 p-6 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  const f = e.currentTarget
                  submit({
                    nome: (f.elements.namedItem('nome') as HTMLInputElement).value,
                    email: (f.elements.namedItem('email') as HTMLInputElement).value,
                    empresa: (f.elements.namedItem('empresa') as HTMLInputElement).value,
                    whatsapp: (f.elements.namedItem('whatsapp') as HTMLInputElement).value,
                    cidade: (f.elements.namedItem('cidade') as HTMLInputElement).value,
                  })
                }}
              >
                <p className="sm:col-span-2 text-sm text-alltak-black/65">
                  {t('lead.intro')}
                </p>
                <input name="nome" required placeholder={t('lead.nome')} className={field} />
                <input name="empresa" placeholder={t('lead.empresa')} className={field} />
                <input name="email" required type="email" placeholder={t('lead.email')} className={field} />
                <input name="whatsapp" required placeholder={t('lead.whatsapp')} className={field} />
                <input name="cidade" placeholder={t('lead.cidade')} className={`${field} sm:col-span-2`} />
                <button type="submit" className="btn-trapezoid btn-blue sm:col-span-2 justify-center">
                  {t('lead.liberar')}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="sm:col-span-2 text-center text-sm uppercase tracking-wide text-alltak-black/40 hover:text-alltak-black/70"
                >
                  {t('lead.cancelar')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </LeadCtx.Provider>
  )
}
