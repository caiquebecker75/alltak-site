import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import instaladores from '../data/wp/instaladores.json'
import { useT } from '../i18n'

// Instaladores Pro-Expert migrados do site antigo: perfis com foto,
// Instagram e mini-bio.

type Perfil = {
  slug: string; nome: string; fotos: string[]; instagram: string | null
  texto: string; url_antiga: string
}

export default function Instaladores() {
  const t = useT()
  const [aberto, setAberto] = useState<Perfil | null>(null)
  const lista = instaladores as Perfil[]

  return (
    <>
      <PageHeader eyebrow={t('inst.eyebrow')} title={t('inst.titulo')}>
        {lista.length} {t('inst.headerSub')}
      </PageHeader>

      <section className="bg-alltak-black py-12 md:py-16">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {lista.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 60}>
                <button onClick={() => setAberto(p)} className="group w-full text-left">
                  <div className="aspect-square overflow-hidden bg-alltak-coal">
                    {p.fotos[0] && (
                      <img src={p.fotos[0]} alt={p.nome} loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="mt-2 font-display text-base font-bold uppercase leading-tight text-white group-hover:text-alltak-blue">
                    {p.nome}
                  </div>
                  {p.instagram && (
                    <div className="text-xs text-white/40">@{p.instagram.split('/').filter(Boolean).pop()}</div>
                  )}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {aberto && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setAberto(null)} />
          <div className="relative grid max-h-[90vh] w-full max-w-3xl overflow-auto bg-alltak-coal md:grid-cols-2">
            <div className="bg-black">
              {aberto.fotos[0] && <img src={aberto.fotos[0]} alt={aberto.nome} className="h-64 w-full object-cover md:h-full" />}
            </div>
            <div className="p-6">
              <button onClick={() => setAberto(null)} aria-label={t('inst.fechar')}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-black/60 text-white hover:bg-alltak-blue">
                ✕
              </button>
              <p className="eyebrow text-alltak-blue">Pro-Expert</p>
              <h3 className="mt-1 font-display text-3xl font-extrabold uppercase text-white">{aberto.nome}</h3>
              <p className="mt-4 max-h-60 overflow-auto whitespace-pre-line pr-2 text-sm leading-relaxed text-white/70">
                {aberto.texto.split('\n').filter((l) => l.length > 40).slice(0, 10).join('\n\n')}
              </p>
              {aberto.instagram && (
                <a href={aberto.instagram} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue mt-5 !py-2 !text-xs">
                  Instagram ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
