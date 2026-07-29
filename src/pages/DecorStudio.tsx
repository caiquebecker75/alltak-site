import PageHeader from '../components/PageHeader'
import DecorVisualizer from '../components/DecorVisualizer'
import FurnitureStudio from '../components/FurnitureStudio'

// Decor visualizer page: re-skin a real 3D furniture model, plus 3 room
// scenes (kitchen / living / bedroom) with per-surface texture swap.
export default function DecorStudio() {
  return (
    <>
      <PageHeader eyebrow="Alltak Decor" title="Visualizador de Ambientes">
        Escolha um padrão Alltak Decor e veja aplicado num móvel 3D real e em 3 ambientes.
        Renove superfícies sem obra, mantendo o padrão do começo ao fim.
      </PageHeader>

      {/* Móvel 3D real */}
      <section className="bg-alltak-black pb-16 pt-4">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">Móvel 3D real</p>
          <h2 className="mt-2 text-4xl text-white md:text-5xl">Vista o móvel em 3D</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Um armário em 3D de verdade, girável, revestido na hora com o padrão Alltak Decor
            escolhido. Exatamente o que o adesivo faz no móvel real.
          </p>
          <div className="mt-8">
            <FurnitureStudio />
          </div>
        </div>
      </section>

      {/* Ambientes 3D por superfície */}
      <section className="border-t border-white/10 bg-alltak-black pb-24 pt-14">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">Ambientes 3D</p>
          <h2 className="mt-2 text-4xl text-white md:text-5xl">Clique nas superfícies</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Cozinha, sala e quarto em 3D. Clique num item (armário, parede, piso) e aplique o padrão.
          </p>
          <div className="mt-8">
            <DecorVisualizer />
          </div>
        </div>
      </section>
    </>
  )
}
