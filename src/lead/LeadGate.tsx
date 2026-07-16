import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

// Lead-gated downloads: any download (catalog, logo, manual, technical bulletin)
// opens a registration form first. On submit the lead is captured and the file
// is released. Front-end only for now — plug the submit into the Alltak
// CRM/e-mail endpoint where marked.

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

  const open = useCallback((d: Download) => {
    setDone(false)
    // returning visitors skip the form
    if (localStorage.getItem(LS_KEY)) {
      setDownload(d)
      setDone(true)
    } else {
      setDownload(d)
    }
  }, [])

  const close = () => setDownload(null)

  const submit = (lead: Lead) => {
    // TODO: enviar para o CRM/e-mail da Alltak (RD Station, HubSpot, etc.)
    try {
      const prev = JSON.parse(localStorage.getItem('alltak_leads') || '[]')
      prev.push({ ...lead, at: new Date().toISOString(), file: download?.title })
      localStorage.setItem('alltak_leads', JSON.stringify(prev))
      localStorage.setItem(LS_KEY, '1')
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
              <span className="tag">Download</span>
              <h3 className="mt-2 font-display text-2xl font-extrabold uppercase text-white">
                {download.title}
              </h3>
            </div>

            {done ? (
              <div className="p-6 text-center">
                <div className="mx-auto mb-4 h-5 w-8 bg-alltak-blue clip-tz" />
                <h4 className="font-display text-2xl font-extrabold uppercase">Tudo pronto!</h4>
                <p className="mt-2 text-sm text-alltak-black/65">
                  Seu material está liberado. Obrigado pelo cadastro.
                </p>
                <a
                  href={download.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="btn-trapezoid btn-blue mt-5"
                  onClick={close}
                >
                  Baixar agora
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
                  Preencha para liberar o download. Entraremos em contato com novidades e suporte.
                </p>
                <input name="nome" required placeholder="Nome" className={field} />
                <input name="empresa" placeholder="Empresa" className={field} />
                <input name="email" required type="email" placeholder="E-mail" className={field} />
                <input name="whatsapp" required placeholder="WhatsApp" className={field} />
                <input name="cidade" placeholder="Cidade" className={`${field} sm:col-span-2`} />
                <button type="submit" className="btn-trapezoid btn-blue sm:col-span-2 justify-center">
                  Liberar download
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="sm:col-span-2 text-center text-xs uppercase tracking-wide text-alltak-black/40 hover:text-alltak-black/70"
                >
                  Cancelar
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </LeadCtx.Provider>
  )
}
