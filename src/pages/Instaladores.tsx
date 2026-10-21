import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import instaladores from '../data/instaladores.json'
import { useT } from '../i18n'

// Instaladores Pro Expert: a listagem oficial do site antigo + os certificados
// de out/2026 (gerado por migracao/instaladores.py). Como no site antigo: aviso
// de responsabilidade no topo e abas Todos / Automotivo / Decorativo /
// Instrutores. A categoria aparece também num selo pequeno sobre a foto.

type Categoria = 'automotivo' | 'decor' | 'instrutor'
type Perfil = {
  slug: string; nome: string; categorias: Categoria[]; cidade: string
  telefone: string; instagram: string | null; bio: string; foto: string | null
  homenagem?: boolean
}

const lista = instaladores as Perfil[]
const ATIVOS = lista.filter((p) => !p.homenagem)
const CATEGORIAS: Categoria[] = ['automotivo', 'decor', 'instrutor']
// cores diferentes além do ícone, para os selos não se confundirem
const COR_SELO: Record<Categoria, string> = {
  automotivo: 'bg-alltak-blue text-white',
  decor: 'bg-white text-alltak-navyDeep',
  instrutor: 'bg-alltak-navyDeep text-white ring-1 ring-white/50',
}
const SAC_WHATSAPP = 'https://wa.me/5511997753029'
const SAC_EMAIL = 'sac@alltak.com.br'

const iniciais = (nome: string) =>
  nome.split(' ').filter((p) => p.length > 2).slice(0, 2).map((p) => p[0]).join('')

function Icone({ c, className = 'h-[18px] w-[18px]' }: { c: Categoria; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      {c === 'automotivo' && (
        // carro de perfil
        <>
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
        </>
      )}
      {c === 'decor' && (
        // casa
        <>
          <path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        </>
      )}
      {c === 'instrutor' && (
        // capelo de formatura
        <>
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" /><path d="M22 10v6" />
        </>
      )}
    </svg>
  )
}

function Selo({ c, titulo, compacto = false }: { c: Categoria; titulo: string; compacto?: boolean }) {
  return (
    <span title={titulo} aria-label={titulo}
      className={`flex shrink-0 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.35)] ${COR_SELO[c]} ${compacto ? 'h-7 w-7' : 'h-8 w-8 md:h-9 md:w-9'}`}>
      <Icone c={c} />
    </span>
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
  const [aba, setAba] = useState<Categoria | 'todos'>('todos')

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return lista.filter(
      (p) =>
        (aba === 'todos' || p.categorias.includes(aba)) &&
        (!q || p.nome.toLowerCase().includes(q) || p.cidade.toLowerCase().includes(q)),
    )
  }, [busca, aba])
  const rotulo = (c: Categoria) => t(c === 'instrutor' ? 'inst.instrutorUm' : `inst.${c}`)

  return (
    <>
      <PageHeader eyebrow={t('inst.eyebrow')} title={t('inst.titulo')}>
        {t('inst.headerSub')}
      </PageHeader>

      <section className="bg-alltak-black pb-16 pt-8 md:pb-20 md:pt-10">
        <div className="container-x">
          {/* aviso de responsabilidade (o mesmo do site antigo), discreto */}
          <div className="border-l-2 border-white/25 py-1 pl-4 text-sm leading-relaxed text-white/50 md:max-w-4xl">
            <p className="font-semibold uppercase tracking-wide text-white/70">{t('inst.avisoTitulo')}</p>
            <p className="mt-1">{t('inst.avisoTexto')}</p>
            <p className="mt-1">
              {t('inst.avisoSac')}{' '}
              <a href={SAC_WHATSAPP} target="_blank" rel="noreferrer" className="text-white/75 underline-offset-2 hover:text-alltak-blue hover:underline">
                WhatsApp (11) 99775-3029
              </a>
              {' · '}
              <a href={`mailto:${SAC_EMAIL}`} className="text-white/75 underline-offset-2 hover:text-alltak-blue hover:underline">{SAC_EMAIL}</a>
            </p>
          </div>

          {/* abas por categoria + busca */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex flex-wrap gap-2">
              {(['todos', ...CATEGORIAS] as const).map((c) => {
                const ativo = aba === c
                // a contagem não inclui o perfil em memória (homenagem)
                const n = ATIVOS.filter((p) => c === 'todos' || p.categorias.includes(c)).length
                return (
                  <button key={c} onClick={() => setAba(c)} aria-pressed={ativo}
                    className={`flex items-center gap-2 px-4 py-2 font-display text-base font-bold uppercase tracking-wide transition md:px-5 md:py-2.5 ${
                      ativo ? 'bg-alltak-blue text-white' : 'bg-white/5 text-white/75 hover:bg-white/15 hover:text-white'
                    }`}>
                    {c !== 'todos' && <Icone c={c} />}
                    {t(`inst.${c}`)}
                    <span className={ativo ? 'text-white/70' : 'text-white/40'}>{n}</span>
                  </button>
                )
              })}
            </div>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={t('inst.buscar')}
              className="w-full border border-white/20 bg-white/5 px-4 py-2.5 text-base text-white outline-none placeholder:text-white/45 focus:border-alltak-blue sm:ml-auto sm:max-w-xs" />
          </div>

          {visiveis.length === 0 ? (
            <p className="mt-10 text-white/60">{t('inst.nenhum')}</p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
              {visiveis.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 4) * 60}>
                  <button onClick={() => setAberto(p)} className="group w-full text-left">
                    <div className="relative aspect-square overflow-hidden bg-alltak-coal">
                      <Foto p={p} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                      {p.categorias.length > 0 && (
                        <div className="absolute bottom-2.5 right-2.5 flex gap-1.5">
                          {p.categorias.map((c) => <Selo key={c} c={c} titulo={rotulo(c)} />)}
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
          )}
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
              {aberto.categorias.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {aberto.categorias.map((c) => (
                    <span key={c} className="flex items-center gap-2 bg-white/10 py-1 pl-1 pr-3 font-display text-base font-bold uppercase tracking-wide text-white/85">
                      <Selo c={c} titulo={rotulo(c)} compacto />
                      {rotulo(c)}
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
              {/* contato direto com o instalador: a ressalva fica junto */}
              {(aberto.telefone || aberto.instagram) && (
                <p className="mt-5 border-t border-white/10 pt-3 text-sm text-white/45">{t('inst.ressalva')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
