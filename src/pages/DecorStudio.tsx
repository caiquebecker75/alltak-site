import PageHeader from '../components/PageHeader'
import FurnitureStudio from '../components/FurnitureStudio'

// Decor visualizer page: re-skin a real 3D furniture model placed in a room,
// one piece per ambience (kitchen / living room / bedroom).
export default function DecorStudio() {
  return (
    <>
      <PageHeader eyebrow="Alltak Decor" title="Visualizador de Ambientes">
        Escolha um móvel, gire em 3D e revista com o padrão Alltak Decor na hora.
        Renove superfícies sem obra, mantendo o padrão do começo ao fim.
      </PageHeader>

      <section className="bg-alltak-black pb-24 pt-4">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">Ambientes 3D</p>
          <h2 className="mt-2 text-4xl text-white md:text-5xl">Vista o móvel em 3D</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Móveis 3D de verdade, giráveis, num ambiente. Troque de móvel (cozinha, sala,
            quarto) e clique num padrão para revesti-lo, do jeito que o adesivo faz no móvel real.
          </p>
          <div className="mt-8">
            <FurnitureStudio />
          </div>
        </div>
      </section>
    </>
  )
}
