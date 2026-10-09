import { useState } from 'react'
import linhas from '../data/wp/linhas.json'
import linhasI18n from '../data/wp/linhas-i18n.json'
import { fichaDaLinha } from '../data/catalog/fichas'
import { useI18n } from '../i18n'

// Quadro "Sobre a linha" na página de Cores, quando a família selecionada é
// uma linha de produto (Kroma, Wood, Satin...): descrição e ficha técnica do
// catálogo digital (ou, sem ele, o texto do site antigo) e o boletim técnico.
// Substitui a página de linha migrada do WordPress para essas linhas.

type LinhaT = { slug: string; nome: string; descricao: string; specs: string[]; boletins: string[] }
type LinhaI18n = Record<string, Record<'en' | 'es', { descricao: string; specs: string[] }>>

export default function SobreLinha({ slug }: { slug: string }) {
  const { lang, t, tv } = useI18n()
  const [aberto, setAberto] = useState(false)
  const linha = (linhas as LinhaT[]).find((l) => l.slug === slug)
  if (!linha) return null
  const catalogo = fichaDaLinha(slug, lang)
  const trad = lang !== 'pt' ? (linhasI18n as LinhaI18n)[slug]?.[lang] : undefined
  const descricao = catalogo?.descricao || trad?.descricao || linha.descricao
  const specs = catalogo?.specs.length ? catalogo.specs : trad?.specs.length ? trad.specs : linha.specs
  if (!descricao && specs.length === 0 && linha.boletins.length === 0) return null

  return (
    <div className="mt-6 border border-white/10 bg-white/[0.03] p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="eyebrow">{t('prod.sobreLinha')}</p>
          <h2 className="mt-1 text-2xl text-white md:text-3xl">{tv(linha.nome)}</h2>
          {descricao && (
            <p className={`mt-3 whitespace-pre-line text-base leading-relaxed text-white/70 ${aberto ? '' : 'line-clamp-3'}`}>{descricao}</p>
          )}
        </div>
        {linha.boletins[0] && (
          <a href={linha.boletins[0]} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue !py-2.5 !text-sm">
            {t('prod.boletim')} ↓
          </a>
        )}
      </div>

      {aberto && specs.length > 0 && (
        <ul className="mt-5 grid gap-x-8 border-t border-white/10 pt-4 md:grid-cols-2">
          {specs.map((s) => {
            const k = s.indexOf(': ')
            return (
              <li key={s} className="border-b border-white/10 py-2 text-sm text-white/75">
                {k > 0 && k < 40 ? (
                  <>
                    <span className="font-semibold text-white">{s.slice(0, k)}:</span> {s.slice(k + 2)}
                  </>
                ) : (
                  s
                )}
              </li>
            )
          })}
        </ul>
      )}
      {aberto && catalogo && <p className="mt-3 text-sm text-white/50">{t('prod.fonte')}: {catalogo.fonte}</p>}

      {(specs.length > 0 || (descricao?.length ?? 0) > 220) && (
        <button
          onClick={() => setAberto((v) => !v)}
          className="mt-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-alltak-blue hover:text-white"
        >
          {aberto ? t('prod.menos') : t('prod.fichaCompleta')} {aberto ? '↑' : '↓'}
        </button>
      )}
    </div>
  )
}
