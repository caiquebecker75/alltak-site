import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import type { Entrada, Grupo } from '../lib/indiceBusca'

// Busca do site: lupa discreta no cabeçalho (ou Ctrl/⌘+K). O índice é
// carregado na primeira abertura. Todas as palavras digitadas precisam
// aparecer no resultado; até 6 por grupo.

const ORDEM: Grupo[] = ['paginas', 'linhas', 'cores', 'downloads', 'instaladores', 'lojas', 'blog']
const POR_GRUPO = 6

export default function Busca({ className = '' }: { className?: string }) {
  const { lang, t, tv } = useI18n()
  const navigate = useNavigate()
  const [aberta, setAberta] = useState(false)
  const [q, setQ] = useState('')
  const [indice, setIndice] = useState<{ lang: string; itens: Entrada[]; normalizar: (s: string) => string } | null>(null)
  const campo = useRef<HTMLInputElement>(null)
  const carregando = useRef('')

  useEffect(() => {
    const atalho = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setAberta(true)
      } else if (e.key === 'Escape') setAberta(false)
    }
    addEventListener('keydown', atalho)
    return () => removeEventListener('keydown', atalho)
  }, [])

  useEffect(() => {
    if (!aberta) return
    setTimeout(() => campo.current?.focus(), 30)
    if (indice?.lang === lang || carregando.current === lang) return
    carregando.current = lang
    import('../lib/indiceBusca').then((m) => setIndice({ lang, itens: m.montarIndice(lang, t, tv), normalizar: m.normalizar }))
  }, [aberta, lang, indice, t, tv])

  useEffect(() => {
    document.body.style.overflow = aberta ? 'hidden' : ''
  }, [aberta])

  const grupos = useMemo(() => {
    if (!indice) return []
    const palavras = indice.normalizar(q.trim()).split(/\s+/).filter(Boolean)
    if (!palavras.length) return []
    const achados = indice.itens.filter((e) => palavras.every((p) => e.chave.includes(p)))
    return ORDEM.map((g) => {
      const todos = achados.filter((e) => e.grupo === g)
      return { g, itens: todos.slice(0, POR_GRUPO), total: todos.length }
    }).filter((x) => x.total)
  }, [indice, q])

  const ir = (e: Entrada) => {
    setAberta(false)
    setQ('')
    if (e.externo) window.open(e.to, '_blank', 'noreferrer')
    else navigate(e.to)
  }

  return (
    <>
      <button onClick={() => setAberta(true)} aria-label={t('busca.abrir')} title={`${t('busca.abrir')} (Ctrl+K)`}
        className={`flex h-10 w-10 items-center justify-center text-white/60 transition hover:text-white ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      {/* portal: o cabeçalho usa transform, que prenderia o "fixed" dentro dele */}
      {aberta && createPortal(
        <div className="fixed inset-0 z-[120] flex justify-center bg-black/80 p-4 pt-[12vh] backdrop-blur-sm" onClick={() => setAberta(false)}>
          <div className="flex max-h-[76vh] w-full max-w-2xl flex-col bg-alltak-coal shadow-2xl" onClick={(e) => e.stopPropagation()}
            role="dialog" aria-label={t('busca.abrir')}>
            <div className="flex items-center gap-3 border-b border-white/10 px-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className="h-5 w-5 shrink-0 text-alltak-blue" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input ref={campo} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('busca.placeholder')}
                onKeyDown={(e) => { if (e.key === 'Enter' && grupos[0]) ir(grupos[0].itens[0]) }}
                className="w-full bg-transparent py-4 text-lg text-white outline-none placeholder:text-white/40" />
              <button onClick={() => setAberta(false)} className="shrink-0 text-sm text-white/45 hover:text-white">Esc</button>
            </div>

            <div className="overflow-y-auto">
              {q.trim() && indice && grupos.length === 0 && (
                <p className="px-5 py-6 text-base text-white/60">{t('busca.nenhum')}</p>
              )}
              {!q.trim() && <p className="px-5 py-6 text-sm text-white/45">{t('busca.dica')}</p>}
              {grupos.map(({ g, itens, total }) => (
                <div key={g} className="border-b border-white/5 py-2 last:border-0">
                  <p className="px-5 pb-1 pt-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-alltak-blue">
                    {t(`busca.g.${g}`)} <span className="text-white/35">{total > itens.length ? `${itens.length} / ${total}` : total}</span>
                  </p>
                  {itens.map((e, i) => (
                    <button key={`${e.to}-${e.titulo}-${i}`} onClick={() => ir(e)}
                      className="flex w-full items-baseline justify-between gap-4 px-5 py-2 text-left transition hover:bg-white/5">
                      <span className="text-base text-white">{e.titulo}</span>
                      {e.sub && <span className="shrink-0 truncate text-sm text-white/45 sm:max-w-[45%]">{e.sub}</span>}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
