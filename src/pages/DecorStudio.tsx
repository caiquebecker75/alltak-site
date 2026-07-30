import PageHeader from '../components/PageHeader'
import KitchenStudio from '../components/KitchenStudio'
import FurnitureStudio from '../components/FurnitureStudio'

// Decor visualizer page: fully interactive 3D kitchen (orbit/zoom, click a
// surface, apply a pattern) plus a real 3D furniture re-skinner.
export default function DecorStudio() {
  return (
    <>
      <PageHeader eyebrow="Alltak Decor" title="Simulador de Ambientes 3D">
        Gire a cozinha, dê zoom, clique numa superfície e aplique o padrão Alltak Decor na
        hora. Renove superfícies sem obra, mantendo o padrão do começo ao fim.
      </PageHeader>

      {/* Cozinha 3D interativa */}
      <section className="bg-alltak-black pb-16 pt-4">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">Cozinha 3D interativa</p>
          <h2 className="mt-2 text-4xl text-white md:text-5xl">Monte a sua cozinha</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Uma cozinha 3D completa: arraste para girar, role para dar zoom e clique em
            armários, bancada, revestimento, parede ou piso para revestir cada um com um
            padrão diferente.
          </p>
          <div className="mt-8">
            <KitchenStudio />
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
