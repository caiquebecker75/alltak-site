import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ColorExplorer from '../components/ColorExplorer'
import { COLORS } from '../data/catalog'
import { useT } from '../i18n'

export default function Cores() {
  // navegação direta: /cores?linha=wraps|decor|signs[&familia=Kroma] abre já filtrado
  const [sp] = useSearchParams()
  const t = useT()
  const linha = sp.get('linha') ?? 'all'
  const familia = sp.get('familia') ?? 'all'
  return (
    <>
      <PageHeader eyebrow={t('cores.eyebrow')} title={t('nav.cores')}>
        {COLORS.length}+ {t('cores.headerSub')}
      </PageHeader>

      <section className="bg-alltak-black py-12 md:py-16">
        <div className="container-x">
          <ColorExplorer key={`${linha}-${familia}`} initialLine={linha} initialFamily={familia} />
        </div>
      </section>
    </>
  )
}
