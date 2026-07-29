import { useParams, Link, useNavigate } from 'react-router-dom'
import { findColor, relatedColors, colorSlug } from '../data/catalog'
import { useLeadGate } from '../lead/LeadGate'
import { STORE_URL } from '../data/site'

// Dedicated single page for one catalog color: applied photo, roll (bobina)
// image, codes, pantone, finish, video and boletim downloads.
export default function CorDetalhe() {
  const { line, code } = useParams()
  const navigate = useNavigate()
  const { open } = useLeadGate()
  const color = findColor(line, code)

  if (!color) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-alltak-black px-6 text-center">
        <p className="eyebrow text-alltak-blue">Cor não encontrada</p>
        <h1 className="mt-3 text-4xl text-white md:text-6xl">Essa cor não está no catálogo</h1>
        <Link to="/cores" className="btn-trapezoid btn-blue mt-8">Ver todas as cores</Link>
      </section>
    )
  }

  const related = relatedColors(color)

  return (
    <>
      {/* Hero: applied photo full-bleed */}
      <section className="relative bg-alltak-black pt-20 md:pt-24">
        <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden md:h-[56vh]">
          {color.applied ? (
            <img src={color.applied} alt={`${color.name} aplicado`} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full" style={{ background: color.hex }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-alltak-black via-alltak-black/30 to-transparent" />
          <div className="container-x absolute inset-x-0 bottom-0 pb-6">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:text-alltak-blue"
            >
              ← Voltar
            </button>
            <span className="tag">{color.lineName}</span>
            <h1 className="mt-3 font-display text-5xl font-black uppercase leading-none text-white md:text-8xl">
              {color.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Ficha + bobina */}
      <section className="bg-alltak-black pb-8 pt-10">
        <div className="container-x grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Bobina (roll) + cor */}
          <div>
            <p className="eyebrow text-alltak-blue">Bobina / textura</p>
            <div className="mt-3 aspect-[16/10] w-full overflow-hidden border border-white/10 bg-alltak-coal">
              <img src={color.swatch} alt={`${color.name} bobina`} className="h-full w-full object-cover" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Cor sólida</div>
                <div className="h-16 w-full border border-white/15" style={{ background: color.hex }} />
                <div className="mt-1 text-center text-[10px] uppercase text-white/40">{color.hex}</div>
              </div>
              {color.applied && (
                <div>
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Aplicado</div>
                  <img src={color.applied} alt="" className="h-16 w-full border border-white/15 object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Informações completas */}
          <div>
            <p className="eyebrow text-alltak-blue">
              {color.family}
              {color.finish ? ` · ${color.finish}` : ''}
            </p>
            <h2 className="mt-2 text-3xl text-white md:text-4xl">Informações da cor</h2>

            <dl className="mt-5 divide-y divide-white/10 border-y border-white/10">
              <div className="flex items-center justify-between py-3 text-sm">
                <dt className="text-white/55">Nome</dt>
                <dd className="font-display font-bold uppercase text-white">{color.name}</dd>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <dt className="text-white/55">Código</dt>
                <dd className="font-display font-bold uppercase text-alltak-blue">{color.code}</dd>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <dt className="text-white/55">Linha</dt>
                <dd className="font-display font-bold uppercase text-white">{color.lineName}</dd>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <dt className="text-white/55">Família</dt>
                <dd className="font-display font-bold uppercase text-white">{color.family}</dd>
              </div>
              {color.finish && (
                <div className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-white/55">Acabamento</dt>
                  <dd className="font-display font-bold uppercase text-white">{color.finish}</dd>
                </div>
              )}
              {color.pantone && (
                <div className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-white/55">Pantone</dt>
                  <dd className="font-display font-bold uppercase text-white">{color.pantone}</dd>
                </div>
              )}
            </dl>

            {/* Ações */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => open({ title: `Boletim Técnico ${color.name} (${color.code})`, url: '#', kind: 'PDF' })}
                className="btn-trapezoid btn-blue justify-center"
              >
                Baixar boletim técnico ↓
              </button>
              <button
                onClick={() => open({ title: `Vídeo de aplicação ${color.name} (${color.code})`, url: '#', kind: 'Vídeo' })}
                className="btn-trapezoid btn-navy justify-center"
              >
                Assistir vídeo de aplicação ▶
              </button>
              {color.line === 'wraps' && (
                <Link to="/visualizador" className="btn-trapezoid btn-outline justify-center">
                  Ver no visualizador 3D
                </Link>
              )}
              <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline justify-center">
                Comprar na Alltak Store ↗
              </a>
            </div>

            <p className="mt-4 text-xs text-white/35">
              Imagem meramente ilustrativa. A cor pode variar conforme a tela, iluminação e superfície.
              Solicite uma amostra física e consulte um aplicador Alltak.
            </p>
          </div>
        </div>
      </section>

      {/* Relacionadas */}
      {related.length > 0 && (
        <section className="bg-alltak-black py-14">
          <div className="container-x">
            <p className="eyebrow text-alltak-blue">Da mesma família</p>
            <h2 className="mt-2 text-3xl text-white md:text-4xl">Cores relacionadas</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {related.map((c) => (
                <Link key={`${c.line}-${c.code}`} to={colorSlug(c)} className="group text-left">
                  <div className="relative aspect-square overflow-hidden bg-alltak-coal">
                    <img
                      src={c.swatch}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-1.5 truncate font-display text-xs font-bold uppercase text-white group-hover:text-alltak-blue">
                    {c.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-white/40">{c.code}</div>
                </Link>
              ))}
            </div>
            <Link to="/cores" className="btn-trapezoid btn-outline mt-8">Ver todas as cores</Link>
          </div>
        </section>
      )}
    </>
  )
}
