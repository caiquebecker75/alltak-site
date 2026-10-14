import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import lojas from '../data/lojas.json'
import { STORE_URL } from '../data/site'
import { useT } from '../i18n'

// Pontos de venda por estado, importados da página Onde Comprar do site antigo
// (gerado por migracao/lojas.py). Filtro por estado + busca por cidade/loja.

type Loja = { uf: string; estado: string; cidade: string; empresa: string; endereco: string; bairro: string; telefone: string }
const LOJAS = lojas as Loja[]
const ESTADOS = Array.from(new Map(LOJAS.map((l) => [l.uf, l.estado])).entries())
  .map(([uf, estado]) => ({ uf, estado, n: LOJAS.filter((l) => l.uf === uf).length }))
  .sort((a, b) => a.uf.localeCompare(b.uf))

// "21 3587-9004/3587-9005" -> link para o primeiro número, com DDD
function telLink(tel: string): string {
  const [primeiro] = tel.split('/')
  const d = primeiro.replace(/\D/g, '')
  return `tel:+55${d}`
}

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function OndeComprar() {
  const t = useT()
  const [uf, setUf] = useState('todos')
  const [busca, setBusca] = useState('')

  const grupos = useMemo(() => {
    const q = semAcento(busca.trim())
    const lista = LOJAS.filter(
      (l) =>
        (uf === 'todos' || l.uf === uf) &&
        (!q || semAcento(`${l.cidade} ${l.bairro} ${l.empresa}`).includes(q)),
    )
    const por = new Map<string, Loja[]>()
    for (const l of lista) por.set(l.estado, [...(por.get(l.estado) ?? []), l])
    return Array.from(por.entries())
  }, [uf, busca])
  const total = grupos.reduce((s, [, ls]) => s + ls.length, 0)

  return (
    <>
      <PageHeader eyebrow={t('onde.eyebrow')} title={t('onde.titulo')}>
        {t('onde.headerSub')}
      </PageHeader>

      <section className="bg-alltak-cream py-14 text-alltak-black md:py-20">
        <div className="container-x">
          {/* estados */}
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setUf('todos')} aria-pressed={uf === 'todos'}
              className={`px-4 py-2 font-display text-base font-bold uppercase tracking-wide transition ${
                uf === 'todos' ? 'bg-alltak-blue text-white' : 'bg-white text-alltak-black hover:bg-black/5'
              }`}>
              {t('onde.todos')}
            </button>
            {ESTADOS.map((e) => (
              <button key={e.uf} onClick={() => setUf(e.uf)} title={`${e.estado} · ${e.n}`} aria-pressed={uf === e.uf}
                className={`w-14 py-2 font-display text-base font-bold uppercase tracking-wide transition ${
                  uf === e.uf ? 'bg-alltak-blue text-white' : 'bg-white text-alltak-black hover:bg-black/5'
                }`}>
                {e.uf}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={t('onde.buscar')}
              className="w-full border border-black/15 bg-white px-4 py-2.5 text-base text-alltak-black outline-none placeholder:text-alltak-black/40 focus:border-alltak-blue sm:max-w-md" />
            <span className="text-base text-alltak-black/55">
              {total} {t(total === 1 ? 'onde.loja' : 'onde.lojas')}
            </span>
          </div>

          {total === 0 ? (
            <p className="mt-10 max-w-xl text-alltak-black/70">
              {t('onde.nenhuma')}{' '}
              <Link to="/contato" className="font-semibold text-alltak-blueDark underline-offset-2 hover:underline">{t('nav.contato')} →</Link>
            </p>
          ) : (
            <div className="mt-10 space-y-12">
              {grupos.map(([estado, ls]) => (
                <div key={estado}>
                  <h2 className="flex items-baseline gap-3 border-b border-black/10 pb-2 text-3xl md:text-4xl">
                    {estado} <span className="font-display text-xl text-alltak-black/35">{ls.length}</span>
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ls.map((l, i) => (
                      <Reveal key={`${l.empresa}-${l.endereco}-${i}`} delay={(i % 3) * 50}>
                        <div className="flex h-full flex-col border border-black/10 bg-white p-5">
                          <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-alltak-blueDark">
                            {l.cidade} · {l.uf}
                          </p>
                          <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-tight">{l.empresa}</h3>
                          <p className="mt-2 text-base text-alltak-black/70">
                            {l.endereco}{l.bairro ? ` · ${l.bairro}` : ''}
                          </p>
                          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                            {l.telefone && (
                              <a href={telLink(l.telefone)} className="text-base font-semibold text-alltak-black hover:text-alltak-blueDark">
                                {l.telefone}
                              </a>
                            )}
                            <a
                              href={`https://www.google.com/maps/search/${encodeURIComponent(`${l.empresa}, ${l.endereco}, ${l.cidade} - ${l.uf}`)}`}
                              target="_blank" rel="noreferrer"
                              className="font-display text-base font-bold uppercase tracking-wide text-alltak-blueDark hover:text-alltak-blue">
                              {t('onde.verMapa')} ↗
                            </a>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-black/10 pt-8">
            <span className="font-display text-2xl font-bold uppercase">{t('onde.comprarOnline')}</span>
            <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue">Alltak Store ↗</a>
          </div>
        </div>
      </section>
    </>
  )
}
