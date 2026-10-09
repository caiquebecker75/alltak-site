import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import linhas from '../data/wp/linhas.json'
import { useI18n } from '../i18n'
import { limparRotulo } from '../lib/rotulos'

// Página de segmento sem cartela de cores (Aplicações Técnicas, Wrap Care,
// Acessórios), no mesmo formato da página de Cores: abas dos segmentos,
// filtros com as linhas do segmento logo abaixo e a grade de fotos. Cada foto
// leva à página completa da linha (descrição, ficha técnica, boletim).

type Cor = { arquivo: string; rotulo: string; codigo: string | null }
type LinhaT = { categoria: string; slug: string; nome: string; cores: Cor[] }

export const SEGMENTOS = [
  { slug: 'aplicacoes-tecnicas', nome: 'Aplicações Técnicas', texto: 'seg.aplicacoes' },
  { slug: 'wrap-care', nome: 'Wrap Care', texto: 'seg.wrapcare' },
  { slug: 'acessorios', nome: 'Acessórios', texto: 'seg.acessorios' },
] as const

const norm = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '')
const NOMES = new Set((linhas as LinhaT[]).map((l) => norm(l.nome)))

type Item = { src: string; linha: LinhaT; legenda: string }

// fotos de cada linha, sem as que o WordPress colocava como "veja também"
// (uma foto rotulada com o nome de OUTRA linha, ex.: as máscaras dentro de
// Dupla Face, o Jateado dentro de Pisos) e sem repetir o mesmo arquivo
function itensDo(segmento: string): Item[] {
  const vistos = new Set<string>()
  const out: Item[] = []
  for (const l of (linhas as LinhaT[]).filter((x) => x.categoria === segmento)) {
    for (const c of l.cores) {
      const r = norm(c.rotulo)
      if ((NOMES.has(r) && r !== norm(l.nome)) || vistos.has(c.arquivo)) continue
      vistos.add(c.arquivo)
      const legenda = limparRotulo(c.rotulo)
      // "PRODUTO 1", "MOLDNHOLD" etc. não acrescentam nada ao nome da linha
      const util = legenda && !/^produto\s*\d*$/i.test(legenda) && norm(legenda) !== norm(l.nome)
      out.push({ src: c.arquivo, linha: l, legenda: util ? legenda : '' })
    }
  }
  return out
}

export default function Segmento() {
  const { categoria = '' } = useParams()
  const { t, tv } = useI18n()
  const seg = SEGMENTOS.find((s) => s.slug === categoria) ?? SEGMENTOS[0]
  const doSegmento = useMemo(() => (linhas as LinhaT[]).filter((l) => l.categoria === seg.slug), [seg.slug])
  const itens = useMemo(() => itensDo(seg.slug), [seg.slug])
  const [linha, setLinha] = useState('all')
  useEffect(() => setLinha('all'), [seg.slug]) // novo segmento: mostra todos
  const lista = linha === 'all' ? itens : itens.filter((i) => i.linha.slug === linha)

  return (
    <>
      <PageHeader eyebrow={t('seg.eyebrow')} title={tv(seg.nome)}>
        {t(seg.texto)}
      </PageHeader>

      <section className="bg-alltak-black py-12 md:py-16">
        <div className="container-x">
          {/* abas dos segmentos: grandes e em destaque (como as linhas em Cores) */}
          <div className="flex flex-wrap gap-2">
            {SEGMENTOS.map((s) => (
              <Link
                key={s.slug}
                to={`/linhas/${s.slug}`}
                className={`clip-tz px-6 py-3 font-display text-base font-black uppercase tracking-wide transition md:text-lg ${
                  s.slug === seg.slug
                    ? 'bg-alltak-blue text-white shadow-[0_6px_24px_rgba(0,128,255,0.35)]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {tv(s.nome)}
              </Link>
            ))}
          </div>

          {/* linhas do segmento */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[{ slug: 'all', nome: '' }, ...doSegmento].map((l) => (
              <button
                key={l.slug}
                onClick={() => setLinha(l.slug)}
                className={`px-4 py-2 font-display text-sm font-bold uppercase tracking-wide transition md:px-5 md:py-2.5 md:text-base ${
                  linha === l.slug ? 'bg-white text-alltak-black' : 'bg-white/5 text-white/75 hover:bg-white/15'
                }`}
              >
                {l.slug === 'all' ? t('seg.todos') : tv(l.nome)}
              </button>
            ))}
          </div>

          <div className="mb-6 mt-5 text-base text-white/60">
            {lista.length} {t(lista.length === 1 ? 'seg.item' : 'seg.itens')}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {lista.map((i) => (
              <Link key={i.src} to={`/produtos/${i.linha.categoria}/${i.linha.slug}`} className="group text-left">
                <div className="relative aspect-square overflow-hidden bg-white">
                  <img
                    src={i.src}
                    alt={`${tv(i.linha.nome)}${i.legenda ? ` · ${i.legenda}` : ''}`}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-1.5">
                  <div className="truncate font-display text-base font-bold uppercase leading-tight text-white group-hover:text-alltak-blue">
                    {tv(i.linha.nome)}
                  </div>
                  <div className="truncate text-sm uppercase tracking-wide text-white/60">{i.legenda || t('seg.verProduto')}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
