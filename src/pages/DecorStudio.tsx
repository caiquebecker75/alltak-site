import PageHeader from '../components/PageHeader'
import AmbienteStudio from '../components/AmbienteStudio'
import FurnitureStudio from '../components/FurnitureStudio'

// Decor visualizer page: three fully interactive 3D rooms (kitchen, living
// room, bedroom) with clickable surfaces, plus a real 3D furniture re-skinner.
export default function DecorStudio() {
  return (
    <>
      <PageHeader eyebrow="Alltak Decor" title="Simulador de Ambientes 3D">
        Gire o ambiente, dê zoom, clique numa superfície e aplique o padrão Alltak Decor na
        hora. Renove superfícies sem obra, mantendo o padrão do começo ao fim.
      </PageHeader>

      {/* Ambientes 3D interativos */}
      <section className="bg-alltak-black pb-16 pt-4">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">Cozinha · Sala · Quarto</p>
          <h2 className="mt-2 text-4xl text-white md:text-5xl">Monte o seu ambiente</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Três ambientes 3D completos: arraste para girar, role para dar zoom e clique em
            armários, painéis, bancada, parede ou piso para revestir cada um com um padrão
            diferente.
          </p>
          <div className="mt-8">
            <AmbienteStudio />
          </div>
        </div>
      </section>

      {/* Móvel 3D real */}
      <section className="border-t border-white/10 bg-alltak-black pb-24 pt-14">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">Móvel 3D real</p>
          <h2 className="mt-2 text-4xl text-white md:text-5xl">Vista o móvel em 3D</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Móveis 3D giráveis num ambiente. Troque de móvel e clique num padrão para revesti-lo.
          </p>
          <div className="mt-8">
            <FurnitureStudio />
          </div>
        </div>
      </section>
    </>
  )
}
