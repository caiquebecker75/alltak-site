import PageHeader from '../components/PageHeader'
import KitchenSimulator from '../components/KitchenSimulator'
import FurnitureStudio from '../components/FurnitureStudio'

// Decor visualizer page: a photo-based kitchen simulator (click a surface,
// apply an Alltak Decor pattern) plus a real 3D furniture re-skinner.
export default function DecorStudio() {
  return (
    <>
      <PageHeader eyebrow="Alltak Decor" title="Simulador de Ambientes">
        Clique numa superfície da cozinha, escolha um padrão Alltak Decor e veja aplicado na
        hora. Renove superfícies sem obra, mantendo o padrão do começo ao fim.
      </PageHeader>

      {/* Simulador fotográfico de cozinha */}
      <section className="bg-alltak-black pb-16 pt-4">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">Simulador de cozinha</p>
          <h2 className="mt-2 text-4xl text-white md:text-5xl">Monte a sua cozinha</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Escolha a superfície (armários de cima, revestimento, armários de baixo) e revista
            cada uma com um padrão diferente.
          </p>
          <div className="mt-8">
            <KitchenSimulator />
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
