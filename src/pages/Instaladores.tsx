import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import instaladores from '../data/instaladores.json'
import { useT } from '../i18n'

// Encontre um Instalador: primeiro os Pro Experts (só os aprovados na
// certificação), depois os demais instaladores da rede. Dados gerados por
// migracao/instaladores.py. O segmento (Automotivo / Decor) aparece num selo
// pequeno sobre a foto; os selos da legenda filtram a lista.

type Segmento = 'automotivo' | 'decor'
type Perfil = {
  slug: string; nome: string; segmentos: Segmento[]; cidade: string
  telefone: string; instagram: string | null; bio: string; foto: string | null
  proExpert?: boolean; homenagem?: boolean
}

const lista = instaladores as Perfil[]
const SEGMENTOS: Segmento[] = ['automotivo', 'decor']
// cores diferentes além do ícone, para os dois selos não se confundirem
const COR_SELO: Record<Segmento, string> = {
  automotivo: 'bg-alltak-blue text-white',
  decor: 'bg-white text-alltak-navyDeep',
}

const iniciais = (nome: string) =>
  nome.split(' ').filter((p) => p.length > 2).slice(0, 2).map((p) => p[0]).join('')

function Icone({ s, className = 'h-4 w-4' }: { s: Segmento; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      {s === 'automotivo' ? (
        // carro de perfil
        <>
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
        </>
      ) : (
        // casa
        <>
          <path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        </>
      )}
    </svg>
  )
}

function Selo({ s, titulo, compacto = false }: { s: Segmento; titulo: string; compacto?: boolean }) {
  return (
    <span title={titulo} aria-label={titulo}
      className={`flex shrink-0 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.35)] ${COR_SELO[s]} ${compacto ? 'h-7 w-7' : 'h-8 w-8 md:h-9 md:w-9'}`}>
      <Icone s={s} className="h-[18px] w-[18px]" />
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
  const [filtro, setFiltro] = useState<Segmento | null>(null)

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return lista.filter(
      (p) =>
        (!filtro || p.segmentos.includes(filtro)) &&
        (!q || p.nome.toLowerCase().includes(q) || p.cidade.toLowerCase().includes(q)),
    )
  }, [busca, filtro])
  const pros = visiveis.filter((p) => p.proExpert)
  const rede = visiveis.filter((p) => !p.proExpert)

  const grade = (itens: Perfil[]) => (
    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
      {itens.map((p, i) => (
        <Reveal key={p.slug} delay={(i % 4) * 60}>
          <button onClick={() => setAberto(p)} className="group w-full text-left">
            <div className="relative aspect-square overflow-hidden bg-alltak-coal">
              <Foto p={p} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
              {p.segmentos.length > 0 && (
                <div className="absolute bottom-2.5 right-2.5 flex gap-1.5">
                  {p.segmentos.map((s) => <Selo key={s} s={s} titulo={t(`inst.${s}`)} />)}
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
  )

  const cabecalho = (tag: string, titulo: string, sub: string, n: number) => (
    <Reveal>
      <p className="eyebrow text-alltak-blue">{tag}</p>
      <h2 className="mt-2 text-4xl text-white md:text-5xl">
        {titulo} <span className="text-white/35">· {n}</span>
      </h2>
      <p className="mt-3 max-w-2xl text-white/60">{sub}</p>
    </Reveal>
  )

  return (
    <>
      <PageHeader eyebrow={t('inst.eyebrow')} title={t('inst.titulo')}>
        {t('inst.headerSub')}
      </PageHeader>

      {/* busca + filtro por segmento (os selos da legenda são os filtros) */}
      <section className="bg-alltak-black pt-10 md:pt-12">
        <div className="container-x flex flex-wrap items-center gap-x-6 gap-y-4">
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={t('inst.buscar')}
            className="w-full border border-white/20 bg-white/5 px-4 py-2.5 text-base text-white outline-none placeholder:text-white/45 focus:border-alltak-blue sm:max-w-sm" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-white/50">{t('inst.filtrar')}</span>
            {SEGMENTOS.map((s) => {
              const ativo = filtro === s
              return (
                <button key={s} onClick={() => setFiltro(ativo ? null : s)} aria-pressed={ativo}
                  className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-4 text-base transition ${
                    ativo ? 'border-alltak-blue bg-alltak-blue/15 text-white' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                  }`}>
                  <Selo s={s} titulo={t(`inst.${s}`)} compacto />
                  {t(`inst.${s}`)}
                  {ativo && <span aria-hidden className="ml-1 text-white/60">✕</span>}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pro Experts em destaque */}
      {pros.length > 0 && (
        <section className="bg-alltak-black pb-14 pt-10 md:pb-16">
          <div className="container-x">
            <div className="border-t-4 border-alltak-blue bg-alltak-navyDeep/60 p-5 md:p-8">
              {cabecalho(t('inst.proTag'), t('inst.proTitulo'), t('inst.proSub'), pros.length)}
              {grade(pros)}
            </div>
          </div>
        </section>
      )}

      {/* demais instaladores da rede */}
      {rede.length > 0 && (
        <section className={`bg-alltak-black pb-16 md:pb-20 ${pros.length ? '' : 'pt-10'}`}>
          <div className="container-x">
            {cabecalho(t('inst.redeTag'), t('inst.redeTitulo'), t('inst.redeSub'), rede.length)}
            {grade(rede)}
          </div>
        </section>
      )}

      {visiveis.length === 0 && (
        <section className="bg-alltak-black py-16">
          <p className="container-x text-white/60">{t('inst.nenhum')}</p>
        </section>
      )}

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
                {aberto.proExpert ? 'Pro Expert' : t('inst.instalador')}
                {aberto.homenagem ? ` · ${t('inst.homenagem')}` : ''}
              </p>
              <h3 className="mt-1 pr-8 font-display text-3xl font-extrabold uppercase leading-none text-white">{aberto.nome}</h3>
              {aberto.segmentos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {aberto.segmentos.map((s) => (
                    <span key={s} className="flex items-center gap-2 bg-white/10 py-1 pl-1 pr-3 font-display text-base font-bold uppercase tracking-wide text-white/85">
                      <Selo s={s} titulo={t(`inst.${s}`)} compacto />
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
                {(aberto.bio || t(aberto.proExpert ? 'inst.semBio' : 'inst.semBioRede')).split('\n').map((par, i) => <p key={i}>{par}</p>)}
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
