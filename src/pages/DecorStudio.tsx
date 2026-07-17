import PageHeader from '../components/PageHeader'
import DecorVisualizer from '../components/DecorVisualizer'

// Decor visualizer page: pick an Alltak Decor pattern and see it applied in
// 3 room scenes (kitchen / living / bedroom).
export default function DecorStudio() {
  return (
    <>
      <PageHeader eyebrow="Alltak Decor" title="Visualizador de Ambientes">
        Escolha um padrão Alltak Decor e veja aplicado em 3 ambientes diferentes.
        Renove superfícies sem obra, mantendo o padrão do começo ao fim.
      </PageHeader>

      <section className="bg-alltak-black pb-24">
        <div className="container-x">
          <DecorVisualizer />
        </div>
      </section>
    </>
  )
}
