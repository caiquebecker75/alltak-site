import { lazy, Suspense, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FINISHES } from '../data/visualizer'
import { STORE_URL } from '../data/site'

// real-time 3D preview — heavy (three.js), so it streams in as its own chunk
const Car3D = lazy(() => import('../components/Car3D'))

// swatch background per film
function swatchStyle(color: string, shift: string | undefined, chrome: boolean): React.CSSProperties {
  if (shift) return { backgroundImage: `linear-gradient(120deg, ${color}, ${shift})` }
  if (chrome)
    return { backgroundImage: `linear-gradient(180deg, #fff6 0%, ${color} 40%, #0006 55%, ${color} 70%)` }
  return { backgroundColor: color }
}

export default function Visualizador() {
  const [finishKey, setFinishKey] = useState(FINISHES[0].key)
  const [filmIndex, setFilmIndex] = useState(2)

  const finish = useMemo(() => FINISHES.find((f) => f.key === finishKey)!, [finishKey])
  const film = finish.films[Math.min(filmIndex, finish.films.length - 1)]

  return (
    <>
      {/* Hero-ish header */}
      <section className="relative overflow-hidden bg-alltak-black pb-8 pt-28 md:pt-36">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('./assets/caveiras.avif')" }}
          aria-hidden
        />
        <div className="container-x relative">
          <p className="eyebrow text-alltak-blue">Ferramenta Alltak</p>
          <h1 className="mt-3 text-5xl text-white md:text-7xl">
            Visualizador de <span className="text-alltak-blue">Envelopamento</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/65">
            Escolha o acabamento e a cor e veja na hora como fica no veículo. Tire a dúvida
            antes de aplicar, do jeito Alltak, com padrão do começo ao fim.
          </p>
        </div>
      </section>

      {/* Visualizer */}
      <section className="bg-alltak-black pb-24">
        <div className="container-x grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* Stage — real-time 3D */}
          <div className="relative flex flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-b from-alltak-ink to-black p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="tag">Cupê esportivo · 3D</span>
              <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-white/45">
                Arraste para girar · role para zoom
              </span>
            </div>

            <div className="relative h-[380px] md:h-[460px]">
              {/* soft blue floor glow */}
              <div className="pointer-events-none absolute inset-x-10 bottom-8 h-16 rounded-[50%] bg-alltak-blue/20 blur-2xl" aria-hidden />
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-white/40 animate-pulse">
                      Carregando modelo 3D…
                    </span>
                  </div>
                }
              >
                <Car3D finish={finish.key} color={film.color} shift={film.shift} className="h-full w-full cursor-hot" />
              </Suspense>
            </div>

            <div className="flex items-end justify-between border-t border-white/10 pt-4">
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-alltak-blue">
                  {finish.line} · {finish.label}
                </p>
                <p className="font-display text-3xl uppercase text-white">{film.name}</p>
              </div>
              <div
                className="h-12 w-20 border border-white/20 clip-slant"
                style={swatchStyle(film.color, film.shift, finish.key === 'cromado')}
                aria-hidden
              />
            </div>
          </div>

          {/* Controls */}
          <div className="border border-white/10 bg-white/[0.02] p-5 md:p-6">
            <h2 className="text-2xl text-white">Acabamento</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {FINISHES.map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    setFinishKey(f.key)
                    setFilmIndex(0)
                  }}
                  className={`font-display text-xs font-bold uppercase tracking-wide px-3.5 py-2 transition ${
                    f.key === finishKey ? 'bg-white text-alltak-black' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-white/50">{finish.hint}</p>

            <h2 className="mt-7 text-2xl text-white">Cores <span className="text-white/40 text-base">· {finish.line}</span></h2>
            <div className="mt-3 grid grid-cols-5 gap-2.5 sm:grid-cols-6 lg:grid-cols-5">
              {finish.films.map((f, i) => {
                const active = i === filmIndex
                return (
                  <button
                    key={f.name}
                    onClick={() => setFilmIndex(i)}
                    title={f.name}
                    aria-label={f.name}
                    className={`aspect-square w-full border transition clip-slant ${
                      active ? 'border-alltak-blue ring-2 ring-alltak-blue' : 'border-white/15 hover:border-white/50'
                    }`}
                    style={swatchStyle(f.color, f.shift, finish.key === 'cromado')}
                  />
                )
              })}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-sm text-white/50">Gostou da combinação?</p>
              <div className="mt-3 flex flex-col gap-3">
                <Link to="/catalogos" className="btn-trapezoid btn-blue justify-center">Baixar catálogo</Link>
                <Link to="/onde-comprar" className="btn-trapezoid btn-outline justify-center">Onde comprar</Link>
                <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-outline justify-center">
                  Alltak Store ↗
                </a>
              </div>
              <p className="mt-4 text-xs text-white/40">
                Prévia ilustrativa. As cores podem variar conforme tela, iluminação e superfície.
                Consulte o catálogo oficial e um aplicador Alltak.
              </p>
              <p className="mt-2 text-[10px] text-white/25">
                Modelo 3D: exemplo do projeto three.js. “Ferrari 458” por vicent091036 (CC-BY).
              </p>
            </div>
          </div>
        </div>

        {/* value strip */}
        <div className="container-x mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ['+7 acabamentos', 'Brilho, fosco, acetinado, metálico, carbono, cromado e camaleão.'],
            ['Dezenas de cores', 'Um portfólio completo para cada estilo e projeto.'],
            ['Padrão Alltak', 'Aplicação eficiente e resultado final impecável.'],
          ].map(([t, d]) => (
            <div key={t} className="border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-3 h-1.5 w-12 bg-alltak-blue clip-slant" />
              <h3 className="text-xl text-white">{t}</h3>
              <p className="mt-1 text-sm text-white/55">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
