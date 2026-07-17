import PageHeader from '../components/PageHeader'
import ColorExplorer from '../components/ColorExplorer'
import { COLORS } from '../data/catalog'

export default function Cores() {
  return (
    <>
      <PageHeader eyebrow="Gama completa" title="Cores">
        {COLORS.length}+ cores das linhas Alltak Wraps, Decor e Signs, com foto do produto
        aplicado, acabamento e código. Clique em uma cor para ver os detalhes, o vídeo de
        aplicação e baixar o boletim técnico.
      </PageHeader>

      <section className="bg-alltak-black py-12 md:py-16">
        <div className="container-x">
          <ColorExplorer />
        </div>
      </section>
    </>
  )
}
