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

type Item = { src: string; linha: LinhaT; produto: string }

// nomes vindos do arquivo no WordPress chegam sem acento e em caixa alta
// ("MASCARA AZUL PROTECAO"); volta os acentos e deixa no mesmo padrão
const ACENTOS: Record<string, string> = {
  mascara: 'Máscara', protecao: 'Proteção', laminacao: 'Laminação', transferencia: 'Transferência',
  medio: 'Médio', cod: 'Cód.', moldnhold: 'Mold n’ Hold', 'moldn’hold': 'Mold n’ Hold', tec: 'Tec',
}
const MINUSCULAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e'])
function nomeProduto(r: string): string {
  return limparRotulo(r)
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => ACENTOS[w] ?? (i > 0 && MINUSCULAS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

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
      // "PRODUTO 1" e afins não dizem nada: fica o nome da linha
      const generico = !limparRotulo(c.rotulo) || /^produto\s*\d*$/i.test(limparRotulo(c.rotulo))
      out.push({ src: c.arquivo, linha: l, produto: generico ? nomeProduto(l.nome) : nomeProduto(c.rotulo) })
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
            {lista.map((i) => {
              // produto + linha; quando o nome do produto já traz o da linha
              // (Dupla Face, Adesive Killer, Kleaner), mostra o segmento no lugar
              const linhaNome = tv(i.linha.nome)
              const sub = norm(i.produto).includes(norm(i.linha.nome)) ? tv(seg.nome) : linhaNome
              return (
                <Link key={i.src} to={`/produtos/${i.linha.categoria}/${i.linha.slug}`} className="group text-left">
                  <div className="relative aspect-square overflow-hidden bg-alltak-coal">
                    <img
                      src={i.src}
                      alt={`${i.produto} · ${linhaNome}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* a linha em cima (mesma altura em todos os cards) e o produto
                      logo abaixo, em até 2 linhas, sem cortar o nome */}
                  <div className="mt-2">
                    <div className="min-h-[2.5em] font-display text-sm font-bold uppercase leading-tight tracking-[0.1em] text-white/55 sm:min-h-0 sm:truncate sm:tracking-[0.14em]">{sub}</div>
                    <div className="mt-0.5 line-clamp-2 font-display text-base font-bold uppercase leading-tight text-white group-hover:text-alltak-blue">
                      {i.produto}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
