import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import linhas from '../data/wp/linhas.json'
import { STORE_URL } from '../data/site'

// Página de linha de produto migrada do site antigo (WordPress):
// descrição, galeria de cores com código, especificações técnicas e boletim.

type Cor = { arquivo: string; rotulo: string; codigo: string | null }
type LinhaT = {
  categoria: string; slug: string; nome: string; meta_description?: string | null
  descricao: string; specs: string[]; boletins: string[]; pdfs_apoio: string[]
  cores: Cor[]; og_image?: string | null; url_antiga: string
}

const CAT_NOME: Record<string, string> = {
  automotivo: 'Automotivo', arquitetura: 'Arquitetura', impressao: 'Impressão',
  'sign-design': 'Sign & Design', 'wrap-care': 'Wrap Care', acessorios: 'Acessórios',
  'aplicacoes-tecnicas': 'Aplicações Técnicas',
}

export default function Linha() {
  const { categoria, slug } = useParams()
  const linha = (linhas as LinhaT[]).find((l) => l.categoria === categoria && l.slug === slug)
  const [corAtiva, setCorAtiva] = useState<Cor | null>(null)
  const irmas = useMemo(
    () => (linhas as LinhaT[]).filter((l) => l.categoria === categoria && l.slug !== slug),
    [categoria, slug],
  )

  if (!linha) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-alltak-black px-6 text-center">
        <p className="eyebrow text-alltak-blue">Linha não encontrada</p>
        <h1 className="mt-3 text-4xl text-white md:text-6xl">Essa linha não existe</h1>
        <Link to="/produtos" className="btn-trapezoid btn-blue mt-8">Ver produtos</Link>
      </section>
    )
  }

  return (
    <>
      <PageHeader eyebrow={CAT_NOME[linha.categoria] ?? linha.categoria} title={linha.nome}>
        {linha.descricao || linha.meta_description}
        <div className="mt-6 flex flex-wrap gap-3">
          {linha.boletins[0] && (
            <a href={linha.boletins[0]} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue !py-2 !text-xs">
              Boletim técnico ↓
            </a>
          )}
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-navy !py-2 !text-xs">
            Comprar na Alltak Store ↗
          </a>
          <Link to="/onde-comprar" className="btn-trapezoid btn-outline !py-2 !text-xs">Onde comprar</Link>
        </div>
      </PageHeader>

      {/* Cores disponíveis */}
      {linha.cores.length > 0 && (
        <section className="bg-alltak-black py-14">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow text-alltak-blue">Cores disponíveis</p>
              <h2 className="mt-2 text-4xl text-white md:text-5xl">{linha.cores.length} opções</h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {linha.cores.map((c) => (
                <button key={c.arquivo} onClick={() => setCorAtiva(c)} className="group text-left">
                  <div className="aspect-square overflow-hidden bg-alltak-coal">
                    <img src={c.arquivo} alt={c.rotulo} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mt-1.5 truncate font-display text-xs font-bold uppercase leading-tight text-white group-hover:text-alltak-blue">
                    {c.rotulo}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Especificações técnicas */}
      {linha.specs.length > 0 && (
        <section className="border-t border-white/10 bg-alltak-black py-14">
          <div className="container-x grid gap-10 md:grid-cols-2">
            <Reveal>
              <div>
                <p className="eyebrow text-alltak-blue">Ficha da linha</p>
                <h2 className="mt-2 text-4xl text-white md:text-5xl">Especificações técnicas</h2>
                <p className="mt-4 text-sm text-white/50">
                  Dados de referência. Confirme sempre no boletim técnico oficial da linha.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {linha.boletins.map((b, i) => (
                    <a key={b} href={b} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue !py-2 !text-xs">
                      Boletim técnico{linha.boletins.length > 1 ? ` ${i + 1}` : ''} ↓
                    </a>
                  ))}
                  {linha.pdfs_apoio.map((p) => (
                    <a key={p} href={p} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline !py-2 !text-xs">
                      {p.includes('check-list') ? 'Check-list de envelopamento' : p.includes('limpeza') ? 'Manual de limpeza' : 'Material de apoio'} ↓
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {linha.specs.map((s, i) => (
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
            <p className="eyebrow text-alltak-blue">{CAT_NOME[linha.categoria]}</p>
            <h2 className="mt-2 text-3xl text-white md:text-4xl">Outras linhas</h2>
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

      {/* Lightbox da cor */}
      {corAtiva && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4" onClick={() => setCorAtiva(null)}>
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          <div className="relative max-h-[90vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={corAtiva.arquivo} alt={corAtiva.rotulo} className="max-h-[82vh] w-auto" />
            <div className="mt-2 flex items-center justify-between">
              <span className="font-display text-sm font-bold uppercase text-white">{corAtiva.rotulo}</span>
              <button onClick={() => setCorAtiva(null)} className="font-display text-xs font-bold uppercase text-white/60 hover:text-alltak-blue">
                Fechar ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
