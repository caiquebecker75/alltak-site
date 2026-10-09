import PageHeader from '../components/PageHeader'
import AmbienteStudio from '../components/AmbienteStudio'
import FurnitureStudio from '../components/FurnitureStudio'
import { useT } from '../i18n'

// Decor visualizer page: three fully interactive 3D rooms (kitchen, living
// room, bedroom) with clickable surfaces, plus a real 3D furniture re-skinner.
export default function DecorStudio() {
  const t = useT()
  return (
    <>
      <PageHeader eyebrow="Alltak Decor" title={t('decor.titulo')}>
        {t('decor.intro')}
      </PageHeader>

      {/* Ambientes 3D interativos */}
      <section className="bg-alltak-black pb-16 pt-4">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">{t('decor.ambEyebrow')}</p>
          <h2 className="mt-2 text-4xl text-white md:text-5xl">{t('decor.ambTitulo')}</h2>
          <p className="mt-3 max-w-2xl text-white/60">{t('decor.ambTexto')}</p>
          <div className="mt-8">
            <AmbienteStudio />
          </div>
        </div>
      </section>

      {/* Móvel 3D real */}
      <section className="border-t border-white/10 bg-alltak-black pb-24 pt-14">
        <div className="container-x">
          <p className="eyebrow text-alltak-blue">{t('decor.movelEyebrow')}</p>
          <h2 className="mt-2 text-4xl text-white md:text-5xl">{t('decor.movelTitulo')}</h2>
          <p className="mt-3 max-w-2xl text-white/60">{t('decor.movelTexto')}</p>
          <div className="mt-8">
            <FurnitureStudio />
          </div>
        </div>
      </section>
    </>
  )
}
