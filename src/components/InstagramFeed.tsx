import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import { INSTAGRAM_FEED_URL, INSTAGRAM_URL } from '../data/site'
import { useI18n } from '../i18n'

// Últimas fotos do Instagram @alltakadesivos na Home, no visual dos cards do
// site. O Instagram só libera as fotos com autorização da conta: a Alltak
// conecta o perfil num serviço de feed (Behold.so) e o link do feed JSON vai em
// INSTAGRAM_FEED_URL (src/data/site.ts). Sem o link, ou se o feed falhar, a
// seção mostra o convite para seguir o perfil.

type Post = { id: string; permalink: string; mediaType?: string; mediaUrl?: string; thumbnailUrl?: string; caption?: string; prunedCaption?: string; timestamp?: string; sizes?: Record<string, { mediaUrl: string }> }

const QUANTOS = 6

// aceita o formato atual do Behold ({ posts: [...] }) e o antigo (lista direta)
function lerPosts(json: unknown): Post[] {
  const lista = Array.isArray(json) ? json : (json as { posts?: Post[] })?.posts
  return Array.isArray(lista) ? (lista as Post[]) : []
}

const imagemDo = (p: Post) =>
  p.sizes?.medium?.mediaUrl ?? (p.mediaType === 'VIDEO' ? p.thumbnailUrl : p.mediaUrl) ?? p.thumbnailUrl

export default function InstagramFeed() {
  const { lang, t } = useI18n()
  const [posts, setPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    if (!INSTAGRAM_FEED_URL) return
    fetch(INSTAGRAM_FEED_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => setPosts(lerPosts(j).filter((p) => imagemDo(p)).slice(0, QUANTOS)))
      .catch(() => setPosts([]))
  }, [])

  const data = (s?: string) =>
    s ? new Date(s).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

  return (
    <section className="border-t border-white/10 bg-alltak-black py-20 md:py-28">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="group max-w-2xl">
              <span className="tag">Instagram</span>
              <h2 className="mt-4 text-5xl text-white transition group-hover:text-alltak-blue md:text-7xl">@alltakadesivos</h2>
              <p className="mt-3 text-white/60">{t('home.instaSub')}</p>
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline">{t('home.instaSeguir')} ↗</a>
          </div>
        </Reveal>

        {posts && posts.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((p, i) => {
              const legenda = (p.prunedCaption ?? p.caption ?? '').trim()
              return (
                <Reveal key={p.id} delay={(i % 3) * 90}>
                  <a href={p.permalink} target="_blank" rel="noreferrer"
                    className="group flex h-full flex-col border border-white/10 bg-white/[0.02] transition hover:border-alltak-blue/60">
                    <div className="aspect-square overflow-hidden bg-alltak-coal">
                      <img src={imagemDo(p)} alt={legenda.slice(0, 120) || '@alltakadesivos'} loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {p.timestamp && <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-alltak-blue">{data(p.timestamp)}</p>}
                      {legenda && <p className="mt-2 line-clamp-3 text-sm text-white/65">{legenda}</p>}
                      <span className="mt-auto pt-4 font-display text-base font-bold uppercase tracking-wide text-alltak-blue">{t('home.instaVer')} ↗</span>
                    </div>
                  </a>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
