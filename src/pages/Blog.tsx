import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import blog from '../data/wp/blog.json'

// Blog migrado do site antigo: 100+ artigos sobre envelopamento e decoração.

type Post = { slug: string; titulo: string; data: string; capa: string | null; resumo: string }

export default function Blog() {
  const [q, setQ] = useState('')
  const [mostrar, setMostrar] = useState(24)
  const lista = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return (blog as Post[]).filter((p) => !qq || p.titulo.toLowerCase().includes(qq) || p.resumo.toLowerCase().includes(qq))
  }, [q])

  return (
    <>
      <PageHeader eyebrow="Conteúdo Alltak" title="Blog">
        {blog.length} artigos sobre envelopamento automotivo, decoração com adesivos,
        tendências e cuidados com a aplicação.
      </PageHeader>

      <section className="bg-alltak-black py-12 md:py-16">
        <div className="container-x">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setMostrar(24) }}
            placeholder="Buscar artigo…"
            className="w-full max-w-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-alltak-blue"
          />
          <div className="mb-4 mt-3 text-sm text-white/40">{lista.length} artigos</div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lista.slice(0, mostrar).map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group border border-white/10 bg-white/[0.02] transition hover:border-alltak-blue/60">
                <div className="aspect-[16/9] overflow-hidden bg-alltak-coal">
                  {p.capa && (
                    <img src={p.capa} alt={p.titulo} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-5">
                  {p.data && <div className="text-[11px] uppercase tracking-widest text-white/40">{p.data.split('-').reverse().join('/')}</div>}
                  <h3 className="mt-1.5 font-display text-xl font-bold uppercase leading-tight text-white group-hover:text-alltak-blue">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-white/55">{p.resumo}</p>
                </div>
              </Link>
            ))}
          </div>

          {mostrar < lista.length && (
            <div className="mt-10 text-center">
              <button onClick={() => setMostrar((m) => m + 24)} className="btn-trapezoid btn-outline">
                Carregar mais ({lista.length - mostrar} restantes)
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
