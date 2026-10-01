import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import blog from '../data/wp/blog.json'

// Artigo do blog: conteúdo completo carregado sob demanda de /wp-blog/<slug>.json
// (texto extraído do site antigo + imagens migradas).

type PostFull = {
  slug: string; titulo: string; data: string; capa: string | null
  resumo: string; texto: string; imagens: string[]
}

export default function BlogPost() {
  const { slug } = useParams()
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
    const pars = post.texto
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 2 && !/^(Facebook|Twitter|LinkedIn|Pinterest|WhatsApp|Compartilhe|Postagens? recentes?|Categorias)/i.test(l))
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
        <p className="eyebrow text-alltak-blue">Artigo não encontrado</p>
        <Link to="/blog" className="btn-trapezoid btn-blue mt-8">Voltar ao blog</Link>
      </section>
    )
  }

  return (
    <>
      <section className="relative bg-alltak-black pb-10 pt-28 md:pt-36">
        <div className="container-x max-w-4xl">
          <Link to="/blog" className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white/50 hover:text-alltak-blue">
            ← Blog
          </Link>
          <h1 className="mt-4 text-4xl text-white md:text-6xl">{post?.titulo ?? '…'}</h1>
          {post?.data && (
            <p className="mt-3 text-sm uppercase tracking-widest text-white/40">
              {post.data.split('-').reverse().join('/')}
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

          {relacionados.length > 0 && (
            <div className="mt-14 border-t border-white/10 pt-8">
              <p className="eyebrow text-alltak-blue">Leia também</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {relacionados.map((r) => (
                  <Link key={r.slug} to={`/blog/${r.slug}`}
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
