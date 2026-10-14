import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import instaladores from '../data/instaladores.json'
import { useT } from '../i18n'

// Instaladores Pro Expert: perfis migrados do site antigo + certificações
// novas (gerado por migracao/instaladores.py), com foto, cidade, contato e bio.
// O segmento (Automotivo / Decor) aparece num selo pequeno sobre a foto;
// quem ainda não tem segmento confirmado fica sem selo.

type Segmento = 'automotivo' | 'decor'
type Perfil = {
  slug: string; nome: string; segmentos: Segmento[]; cidade: string
  telefone: string; instagram: string | null; bio: string; foto: string | null
  novo?: boolean; homenagem?: boolean
}

const lista = instaladores as Perfil[]
const SEGMENTOS: Segmento[] = ['automotivo', 'decor']

const iniciais = (nome: string) =>
  nome.split(' ').filter((p) => p.length > 2).slice(0, 2).map((p) => p[0]).join('')

function Icone({ s, className = 'h-4 w-4' }: { s: Segmento; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      {s === 'automotivo' ? (
        <>
          <path d="M3 16.5V13l2.2-4.6A2 2 0 0 1 7 7.3h10a2 2 0 0 1 1.8 1.1L21 13v3.5a1 1 0 0 1-1 1h-1.2" />
          <path d="M5.2 17.5H4a1 1 0 0 1-1-1M8.8 17.5h6.4M3 13h18" />
          <circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" />
        </>
      ) : (
        <>
          <path d="M5.5 11V8.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2V11" />
          <path d="M3 13a2 2 0 0 1 4 0v1.5h10V13a2 2 0 0 1 4 0v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          <path d="M6 18v1.5M18 18v1.5" />
        </>
      )}
    </svg>
  )
}

function Foto({ p, className }: { p: Perfil; className: string }) {
  if (p.foto) return <img src={p.foto} alt={p.nome} loading="lazy" className={`${className} object-cover object-[center_15%]`} />
  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-br from-alltak-navy to-alltak-coal`}>
      <span className="font-display text-6xl font-black uppercase text-white/25">{iniciais(p.nome)}</span>
    </div>
  )
}

export default function Instaladores() {
  const t = useT()
  const [aberto, setAberto] = useState<Perfil | null>(null)
  const [busca, setBusca] = useState('')

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return lista.filter((p) => !q || p.nome.toLowerCase().includes(q) || p.cidade.toLowerCase().includes(q))
  }, [busca])

  return (
    <>
      <PageHeader eyebrow={t('inst.eyebrow')} title={t('inst.titulo')}>
        {lista.length} {t('inst.headerSub')}
      </PageHeader>

      <section className="bg-alltak-black py-12 md:py-16">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={t('inst.buscar')}
              className="w-full border border-white/20 bg-white/5 px-4 py-2.5 text-base text-white outline-none placeholder:text-white/45 focus:border-alltak-blue sm:max-w-sm" />
            {/* legenda dos selos */}
            <div className="flex items-center gap-5 text-sm text-white/55">
              {SEGMENTOS.map((s) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-alltak-blue"><Icone s={s} /></span>
                  {t(`inst.${s}`)}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {visiveis.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 60}>
                <button onClick={() => setAberto(p)} className="group w-full text-left">
                  <div className="relative aspect-square overflow-hidden bg-alltak-coal">
                    <Foto p={p} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                    {p.segmentos.length > 0 && (
                      <div className="absolute bottom-2.5 right-2.5 flex gap-1.5">
                        {p.segmentos.map((s) => (
                          <span key={s} title={t(`inst.${s}`)} aria-label={t(`inst.${s}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white ring-1 ring-white/25 backdrop-blur-sm">
                            <Icone s={s} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5 font-display text-base font-bold uppercase leading-tight text-white group-hover:text-alltak-blue md:text-lg">
                    {p.nome}
                  </div>
                  <div className="mt-0.5 text-sm text-white/50">{p.homenagem ? t('inst.homenagem') : p.cidade}</div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {aberto && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setAberto(null)} />
          <div className="relative grid max-h-[90vh] w-full max-w-4xl overflow-auto bg-alltak-coal md:grid-cols-2">
            <div className="bg-black">
              <Foto p={aberto} className="h-72 w-full md:h-full md:min-h-[28rem]" />
            </div>
            <div className="p-6 md:p-8">
              <button onClick={() => setAberto(null)} aria-label={t('inst.fechar')}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-black/60 text-white hover:bg-alltak-blue">
                ✕
              </button>
              <p className="eyebrow text-alltak-blue">
                Pro Expert{aberto.homenagem ? ` · ${t('inst.homenagem')}` : ''}
              </p>
              <h3 className="mt-1 pr-8 font-display text-3xl font-extrabold uppercase leading-none text-white">{aberto.nome}</h3>
              {aberto.segmentos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {aberto.segmentos.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 font-display text-sm font-bold uppercase tracking-wide text-white/85">
                      <Icone s={s} className="h-4 w-4 text-alltak-blue" />
                      {t(`inst.${s}`)}
                    </span>
                  ))}
                </div>
              )}
              {(aberto.cidade || aberto.telefone) && (
                <div className="mt-3 space-y-0.5 text-sm text-white/60">
                  {aberto.cidade && <div>{aberto.cidade}</div>}
                  {aberto.telefone && (
                    <div>
                      {t('inst.telefone')}:{' '}
                      {aberto.telefone.split(' / ').map((f, i) => (
                        <span key={f}>
                          {i > 0 && ' / '}
                          <a href={`tel:${f.replace(/[^\d+]/g, '')}`} className="text-white/80 hover:text-alltak-blue">{f}</a>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-5 max-h-72 space-y-3 overflow-auto pr-2 text-sm leading-relaxed text-white/75">
                {(aberto.bio || t('inst.semBio')).split('\n').map((par, i) => <p key={i}>{par}</p>)}
              </div>
              {aberto.instagram && (
                <a href={aberto.instagram} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue mt-6 !py-2.5 !text-base">
                  Instagram @{aberto.instagram.split('/').filter(Boolean).pop()} ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
