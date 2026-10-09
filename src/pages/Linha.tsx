import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import linhas from '../data/wp/linhas.json'
import linhasI18n from '../data/wp/linhas-i18n.json'
import { STORE_URL } from '../data/site'
import { useI18n } from '../i18n'

// Página de linha de produto migrada do site antigo (WordPress):
// descrição, galeria de cores com código, especificações técnicas e boletim.
// Em EN/ES a descrição e as specs vêm de linhas-i18n.json (gerado em migracao/).

type Cor = { arquivo: string; rotulo: string; codigo: string | null }
type LinhaT = {
  categoria: string; slug: string; nome: string; meta_description?: string | null
  descricao: string; specs: string[]; boletins: string[]; pdfs_apoio: string[]
  cores: Cor[]; og_image?: string | null; url_antiga: string
}
type LinhaI18n = Record<string, Record<'en' | 'es', { descricao: string; specs: string[] }>>

const CAT_NOME: Record<string, string> = {
  automotivo: 'Automotivo', arquitetura: 'Arquitetura', impressao: 'Impressão',
  'sign-design': 'Sign & Design', 'wrap-care': 'Wrap Care', acessorios: 'Acessórios',
  'aplicacoes-tecnicas': 'Aplicações Técnicas',
}

export default function Linha() {
  const { categoria, slug } = useParams()
  const { lang, t, tv } = useI18n()
  const linha = (linhas as LinhaT[]).find((l) => l.categoria === categoria && l.slug === slug)
  const trad = lang !== 'pt' && slug ? (linhasI18n as LinhaI18n)[slug]?.[lang] : undefined
  const descricao = trad?.descricao || linha?.descricao || linha?.meta_description
  const specs = trad && trad.specs.length > 0 ? trad.specs : linha?.specs ?? []
  const [idx, setIdx] = useState<number | null>(null)
  const corAtiva = idx !== null ? linha?.cores[idx] ?? null : null
  const baixar = async (src: string, nome: string) => {
    const blob = await fetch(src).then((r) => r.blob())
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = nome
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const irmas = useMemo(
    () => (linhas as LinhaT[]).filter((l) => l.categoria === categoria && l.slug !== slug),
    [categoria, slug],
  )

  if (!linha) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-alltak-black px-6 text-center">
        <p className="eyebrow text-alltak-blue">{t('prod.naoEncontrada')}</p>
        <h1 className="mt-3 text-4xl text-white md:text-6xl">{t('prod.naoExiste')}</h1>
        <Link to="/produtos" className="btn-trapezoid btn-blue mt-8">{t('cta.verProdutos')}</Link>
      </section>
    )
  }

  return (
    <>
      <PageHeader eyebrow={tv(CAT_NOME[linha.categoria] ?? linha.categoria)} title={linha.nome}>
        {descricao}
        <div className="mt-6 flex flex-wrap gap-3">
          {linha.boletins[0] && (
            <a href={linha.boletins[0]} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue !py-2.5 !text-sm">
              {t('prod.boletim')} ↓
            </a>
          )}
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-navy !py-2.5 !text-sm">
            {t('prod.comprarStore')}
          </a>
          <Link to="/onde-comprar" className="btn-trapezoid btn-outline !py-2.5 !text-sm">{t('cta.ondeComprar')}</Link>
        </div>
      </PageHeader>

      {/* Cores disponíveis */}
      {linha.cores.length > 0 && (
        <section className="bg-alltak-black py-14">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow text-alltak-blue">{t('prod.coresDisponiveis')}</p>
              <h2 className="mt-2 text-4xl text-white md:text-5xl">{linha.cores.length} {t('prod.opcoes')}</h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {linha.cores.map((c, i) => (
                <button key={c.arquivo} onClick={() => setIdx(i)} className="group text-left">
                  <div className="aspect-square overflow-hidden bg-alltak-coal">
                    <img src={c.arquivo} alt={c.rotulo} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mt-1.5 truncate font-display text-sm font-bold uppercase leading-tight text-white group-hover:text-alltak-blue">
                    {c.rotulo}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Especificações técnicas */}
      {specs.length > 0 && (
        <section className="border-t border-white/10 bg-alltak-black py-14">
          <div className="container-x grid gap-10 md:grid-cols-2">
            <Reveal>
              <div>
                <p className="eyebrow text-alltak-blue">{t('prod.fichaLinha')}</p>
                <h2 className="mt-2 text-4xl text-white md:text-5xl">{t('prod.especificacoes')}</h2>
                <p className="mt-4 text-sm text-white/50">{t('prod.refBoletim')}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {linha.boletins.map((b, i) => (
                    <a key={b} href={b} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue !py-2.5 !text-sm">
                      {t('prod.boletim')}{linha.boletins.length > 1 ? ` ${i + 1}` : ''} ↓
                    </a>
                  ))}
                  {linha.pdfs_apoio.map((p) => (
                    <a key={p} href={p} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline !py-2.5 !text-sm">
                      {p.includes('check-list') ? t('prod.checklist') : p.includes('limpeza') ? t('prod.manualLimpeza') : t('prod.materialApoio')} ↓
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {specs.map((s, i) => (
                  <li key={i} className="py-2.5 text-sm text-white/75">{s}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {/* Outras linhas da categoria */}
      {irmas.length > 0 && (
        <section className="border-t border-white/10 bg-alltak-black py-14">
          <div className="container-x">
            <p className="eyebrow text-alltak-blue">{tv(CAT_NOME[linha.categoria])}</p>
            <h2 className="mt-2 text-3xl text-white md:text-4xl">{t('prod.outrasLinhas')}</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {irmas.map((l) => (
                <Link key={l.slug} to={`/produtos/${l.categoria}/${l.slug}`}
                  className="border border-white/15 px-3 py-1.5 font-display text-sm font-semibold uppercase tracking-wide text-white/70 transition hover:border-alltak-blue hover:text-white">
                  {l.nome}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox da cor: navegação anterior/próxima e download */}
      {corAtiva && idx !== null && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4" onClick={() => setIdx(null)}>
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          {linha.cores.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + linha.cores.length) % linha.cores.length) }}
                aria-label="Cor anterior"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-white/10 px-4 py-3 font-display text-2xl font-black text-white transition hover:bg-alltak-blue md:left-6">
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % linha.cores.length) }}
                aria-label="Próxima cor"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-white/10 px-4 py-3 font-display text-2xl font-black text-white transition hover:bg-alltak-blue md:right-6">
                ›
              </button>
            </>
          )}
          <div className="relative max-h-[90vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={corAtiva.arquivo} alt={corAtiva.rotulo} className="max-h-[78vh] w-auto" />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <span className="font-display text-sm font-bold uppercase text-white">
                {corAtiva.rotulo}
                <span className="ml-2 text-white/40">{idx + 1}/{linha.cores.length}</span>
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => baixar(corAtiva.arquivo, `alltak-${linha.slug}-${corAtiva.codigo ?? idx + 1}.jpg`)}
                  className="font-display text-sm font-bold uppercase text-alltak-blue hover:text-white">
                  {t('comum.baixarImagem')}
                </button>
                <button onClick={() => setIdx(null)} className="font-display text-sm font-bold uppercase text-white/60 hover:text-alltak-blue">
                  {t('comum.fechar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
