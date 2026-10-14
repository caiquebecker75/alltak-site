import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import instaladores from '../data/instaladores.json'
import { useT } from '../i18n'

// Instaladores Pro Expert: perfis migrados do site antigo + certificações
// novas (gerado por migracao/instaladores.py), com foto, cidade, contato e bio.

type Segmento = 'automotivo' | 'decor'
type Perfil = {
  slug: string; nome: string; segmento: Segmento | null; cidade: string
  telefone: string; instagram: string | null; bio: string; foto: string | null
  novo?: boolean; homenagem?: boolean
}

const lista = instaladores as Perfil[]
// o filtro por segmento só aparece quando todos os perfis estão classificados
const COM_FILTRO = lista.every((p) => p.segmento)

const iniciais = (nome: string) =>
  nome.split(' ').filter((p) => p.length > 2).slice(0, 2).map((p) => p[0]).join('')

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
  const [segmento, setSegmento] = useState<Segmento | 'todos'>('todos')
  const [busca, setBusca] = useState('')

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return lista.filter(
      (p) =>
        (segmento === 'todos' || p.segmento === segmento) &&
        (!q || p.nome.toLowerCase().includes(q) || p.cidade.toLowerCase().includes(q)),
    )
  }, [segmento, busca])

  const rotulo = (p: Perfil) =>
    p.homenagem ? t('inst.homenagem') : p.segmento ? t(`inst.${p.segmento}`) : null

  return (
    <>
      <PageHeader eyebrow={t('inst.eyebrow')} title={t('inst.titulo')}>
        {lista.length} {t('inst.headerSub')}
      </PageHeader>

      <section className="bg-alltak-black py-12 md:py-16">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {COM_FILTRO && (['todos', 'automotivo', 'decor'] as const).map((s) => (
              <button key={s} onClick={() => setSegmento(s)}
                className={`px-5 py-2.5 font-display text-base font-bold uppercase tracking-wide transition ${
                  segmento === s ? 'bg-alltak-blue text-white' : 'bg-white/5 text-white/75 hover:bg-white/15'
                }`}>
                {t(`inst.${s}`)}
              </button>
            ))}
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={t('inst.buscar')}
              className={`w-full border border-white/20 bg-white/5 px-4 py-2.5 text-base text-white outline-none placeholder:text-white/45 focus:border-alltak-blue sm:max-w-sm ${COM_FILTRO ? 'sm:ml-auto' : ''}`} />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {visiveis.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 60}>
                <button onClick={() => setAberto(p)} className="group w-full text-left">
                  <div className="relative aspect-square overflow-hidden bg-alltak-coal">
                    <Foto p={p} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                    {rotulo(p) && <span className="tag absolute left-3 top-3 !px-3 !py-0.5 !tracking-[0.14em]">{rotulo(p)}</span>}
                  </div>
                  <div className="mt-2.5 font-display text-base font-bold uppercase leading-tight text-white group-hover:text-alltak-blue md:text-lg">
                    {p.nome}
                  </div>
                  {p.cidade && <div className="mt-0.5 text-sm text-white/50">{p.cidade}</div>}
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
                Pro Expert{rotulo(aberto) ? ` · ${rotulo(aberto)}` : ''}
              </p>
              <h3 className="mt-1 pr-8 font-display text-3xl font-extrabold uppercase leading-none text-white">{aberto.nome}</h3>
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
                <a href={aberto.instagram} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue mt-6 !py-2.5 !text-sm">
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
