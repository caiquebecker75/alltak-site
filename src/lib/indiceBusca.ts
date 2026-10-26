// Índice da busca do site (carregado só quando a lupa é aberta, para não pesar
// no carregamento inicial). Cada entrada: título, complemento, destino e grupo.

import { NAV } from '../data/site'
import linhas from '../data/wp/linhas.json'
import blog from '../data/wp/blog.json'
import instaladores from '../data/instaladores.json'
import lojas from '../data/lojas.json'
import { COLORS, colorSlug } from '../data/catalog'
import { destinoDaLinha } from '../data/familias'
import { DOWNLOADS, texto } from '../data/downloads'
import { CURSOS } from '../data/cursos'
import type { Lang } from '../i18n'
import { previaAtiva } from './previa'

export type Grupo = 'paginas' | 'linhas' | 'cores' | 'downloads' | 'instaladores' | 'lojas' | 'blog'
export type Entrada = { titulo: string; sub: string; to: string; externo?: boolean; grupo: Grupo; chave: string }

export const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const CAT_NOME: Record<string, string> = {
  automotivo: 'Automotivo', arquitetura: 'Arquitetura', impressao: 'Impressão',
  'sign-design': 'Sign & Design', 'wrap-care': 'Wrap Care', acessorios: 'Acessórios',
  'aplicacoes-tecnicas': 'Aplicações Técnicas',
}

export function montarIndice(lang: Lang, t: (k: string) => string, tv: (v: string) => string): Entrada[] {
  const e: Entrada[] = []
  const add = (grupo: Grupo, titulo: string, sub: string, to: string, extra = '', externo = false) =>
    e.push({ grupo, titulo, sub, to, externo, chave: normalizar(`${titulo} ${sub} ${extra}`) })

  for (const n of NAV) add('paginas', t(n.tkey), '', n.to, n.label, n.external)
  // páginas que saíram do menu, mas continuam no site
  if (previaAtiva()) {
    add('paginas', t('nav.simule'), '', '/simulador', 'simulador visualizador')
    add('paginas', t('nav.visualizador'), t('nav.simule'), '/visualizador', 'carro 3d automotivo')
  }
  add('paginas', t('nav.decoracao'), t('nav.simule'), '/decoracao', 'ambientes moveis')
  add('paginas', t('nav.cores'), t('nav.produtos'), '/cores', 'cartela')
  for (const l of linhas as { categoria: string; slug: string; nome: string }[]) {
    add('linhas', tv(l.nome), tv(CAT_NOME[l.categoria] ?? l.categoria), destinoDaLinha(l), l.nome)
  }
  for (const c of COLORS) add('cores', c.name, `${c.code} · ${c.lineName}`, colorSlug(c), c.family)
  for (const c of CURSOS) add('paginas', c.nome, t('nav.cursos'), `/cursos/${c.slug}`, c.chamada)
  for (const g of DOWNLOADS) {
    add('downloads', texto(g.titulo, lang), texto(g.desc, lang), `/downloads/${g.slug}`)
    for (const a of g.itens) add('downloads', texto(a.nome, lang), texto(g.titulo, lang), `/downloads/${g.slug}`)
  }
  for (const p of instaladores as { nome: string; cidade: string }[]) add('instaladores', p.nome, p.cidade, '/instaladores')
  for (const l of lojas as { empresa: string; cidade: string; uf: string; bairro: string }[]) {
    add('lojas', l.empresa, `${l.cidade} · ${l.uf}`, '/onde-comprar', l.bairro)
  }
  for (const b of blog as { slug: string; titulo: string }[]) add('blog', b.titulo, t('nav.blog'), `/noticias/${b.slug}`)
  return e
}
