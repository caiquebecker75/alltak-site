import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import blog from '../data/wp/blog.json'
import { useI18n, useT, type Lang } from '../i18n'
import { enviarPorEmail } from '../lib/contato'

// Artigo do blog: conteúdo completo carregado sob demanda de /wp-blog/<slug>.json
// (texto extraído do site antigo + imagens migradas). O artigo fica em
// português; só a interface é traduzida.

type PostFull = {
  slug: string; titulo: string; data: string; capa: string | null
  resumo: string; texto: string; imagens: string[]
}

// data AAAA-MM-DD: dd/mm/aaaa em PT/ES, "Mar 5, 2024" em EN (igual ao Blog.tsx)
function formatarData(data: string, lang: Lang): string {
  if (lang !== 'en') return data.split('-').reverse().join('/')
  const [a, m, d] = data.split('-').map(Number)
  if (!a || !m || !d) return data
  return new Date(a, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function BlogPost() {
  const { slug } = useParams()
  const { lang, t } = useI18n()
  const [post, setPost] = useState<PostFull | null>(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    setPost(null); setErro(false)
    fetch(`./wp-blog/${slug}.json`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
      .then(setPost)
      .catch(() => setErro(true))
  }, [slug])

  // texto em parágrafos, intercalando as imagens do artigo
  const blocos = useMemo(() => {
    if (!post) return []
    // o texto do site antigo termina com o formulário "Possui dúvidas?" (só os
    // rótulos, sem funcionar) e traz restos dos embeds do Instagram
    const linhas = post.texto.split('\n').map((l) => l.trim())
    const fim = linhas.findIndex((l) => /^POSSUI D[ÚU]VIDAS\??$/i.test(l))
    const pars: string[] = []
    let pularConta = false
    for (const l of fim >= 0 ? linhas.slice(0, fim) : linhas) {
      if (/^(A post shared by|Uma publica[çc][ãa]o compartilhada)/i.test(l)) { pularConta = true; continue }
      if (pularConta) { pularConta = false; continue } // nome da conta
      if (/^\(@[^)]+\)( on)?$/.test(l) || /\b(PDT|PST)$/.test(l) || /^View this post on Instagram$/i.test(l)) continue
      if (l.length > 2 && !/^(Facebook|Twitter|LinkedIn|Pinterest|WhatsApp|Compartilhe|Postagens? recentes?|Categorias)/i.test(l)) pars.push(l)
    }
    // dedup linhas repetidas de navegação
    const vistos = new Set<string>()
    return pars.filter((l) => { if (l.length < 60) { if (vistos.has(l)) return false; vistos.add(l) } return true })
  }, [post])

  const relacionados = useMemo(() => {
    const idx = (blog as { slug: string; titulo: string }[])
    const i = idx.findIndex((p) => p.slug === slug)
    return idx.slice(Math.max(0, i - 2), i).concat(idx.slice(i + 1, i + 3))
  }, [slug])

  if (erro) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-alltak-black px-6 text-center">
        <p className="eyebrow text-alltak-blue">{t('blog.naoEncontrado')}</p>
        <Link to="/noticias" className="btn-trapezoid btn-blue mt-8">{t('blog.voltar')}</Link>
      </section>
    )
  }

  return (
    <>
      <section className="relative bg-alltak-black pb-10 pt-28 md:pt-36">
        <div className="container-x max-w-4xl">
          <Link to="/noticias" className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white/50 hover:text-alltak-blue">
            ← {t('nav.blog')}
          </Link>
          <h1 className="mt-4 text-4xl text-white md:text-6xl">{post?.titulo ?? '…'}</h1>
          {post?.data && (
            <p className="mt-3 text-sm uppercase tracking-widest text-white/40">
              {formatarData(post.data, lang)}
            </p>
          )}
        </div>
      </section>

      <section className="bg-alltak-black pb-20">
        <div className="container-x max-w-4xl">
          {post?.capa && (
            <img src={post.capa} alt={post.titulo} className="mb-8 w-full border border-white/10 object-cover" />
          )}
          <article className="space-y-4">
            {blocos.map((b, i) =>
              b.length < 70 && b === b.toUpperCase() ? (
                <h2 key={i} className="pt-3 font-display text-2xl font-bold uppercase text-white">{b}</h2>
              ) : b.length < 90 && !/[.!?:,;]$/.test(b) ? (
                <h3 key={i} className="pt-2 font-display text-xl font-bold text-alltak-blue">{b}</h3>
              ) : (
                <p key={i} className="leading-relaxed text-white/75">{b}</p>
              ),
            )}
          </article>

          {post && <Compartilhar titulo={post.titulo} />}
          {post && <Duvidas titulo={post.titulo} />}

          {relacionados.length > 0 && (
            <div className="mt-14 border-t border-white/10 pt-8">
              <p className="eyebrow text-alltak-blue">{t('blog.leiaTambem')}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {relacionados.map((r) => (
                  <Link key={r.slug} to={`/noticias/${r.slug}`}
                    className="border border-white/10 p-4 font-display font-bold uppercase leading-tight text-white transition hover:border-alltak-blue hover:text-alltak-blue">
                    {r.titulo}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// compartilhar a notícia: e-mail, WhatsApp, LinkedIn e Facebook por link; o
// Instagram não aceita link de compartilhamento, então usa o menu do celular
// (Web Share) ou copia o endereço para colar no app
function Compartilhar({ titulo }: { titulo: string }) {
  const t = useT()
  const [copiado, setCopiado] = useState(false)
  const url = window.location.href
  const u = encodeURIComponent(url)
  const redes: [string, string][] = [
    ['E-mail', `mailto:?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(`${titulo}\n${url}`)}`],
    ['WhatsApp', `https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
  ]
  const instagram = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    } catch {
      /* compartilhamento cancelado */
    }
  }
  const botao =
    'border border-white/20 px-4 py-2 font-display text-base font-bold uppercase tracking-wide text-white/80 transition hover:border-alltak-blue hover:text-white'
  return (
    <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6">
      <span className="mr-2 font-display text-base font-bold uppercase tracking-[0.18em] text-alltak-blue">{t('blog.compartilhe')}</span>
      {redes.map(([nome, href]) => (
        <a key={nome} href={href} target={nome === 'E-mail' ? undefined : '_blank'} rel="noreferrer" className={botao}>
          {nome}
        </a>
      ))}
      <button onClick={instagram} className={botao}>Instagram</button>
      {copiado && <span className="text-sm text-white/60">{t('blog.copiado')}</span>}
    </div>
  )
}

// "Possui dúvidas?": o formulário do site antigo, agora funcionando (abre o
// e-mail do visitante com a mensagem para a Alltak, ver lib/contato.ts)
function Duvidas({ titulo }: { titulo: string }) {
  const t = useT()
  const campo =
    'w-full border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-alltak-blue'
  return (
    <form
      className="mt-10 grid gap-3 border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const v = (k: string) => String(f.get(k) ?? '')
        enviarPorEmail(`Dúvida sobre a notícia: ${titulo}`, [
          ['Nome', v('nome')], ['E-mail', v('email')], ['Fone', v('fone')],
          ['Notícia', window.location.href], ['Mensagem', v('mensagem')],
        ])
      }}
    >
      <div className="sm:col-span-3">
        <h2 className="font-display text-2xl font-bold uppercase text-white">{t('blog.duvidas')}</h2>
        <p className="mt-1 text-sm text-white/55">{t('blog.duvidasSub')}</p>
      </div>
      <input name="nome" required placeholder={t('blog.nome')} className={campo} />
      <input name="email" type="email" required placeholder={t('blog.email')} className={campo} />
      <input name="fone" placeholder={t('blog.fone')} className={campo} />
      <textarea name="mensagem" required rows={4} placeholder={t('blog.mensagem')} className={`${campo} sm:col-span-3`} />
      <button type="submit" className="btn-trapezoid btn-blue justify-self-start sm:col-span-3">{t('blog.enviar')}</button>
    </form>
  )
}
