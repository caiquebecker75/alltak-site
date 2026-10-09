import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import subAcademy from '../brand/sub-academy.png'
import { useT } from '../i18n'

// cada curso usa as chaves cursos.<id>.nome / .nivel / .desc (dict-paginas.ts)
const CURSOS = ['academia', 'intermediario', 'avancado', 'decor', 'experience']

export default function Cursos() {
  const t = useT()
  return (
    <>
      <PageHeader eyebrow={t('cursos.eyebrow')} title={t('cursos.titulo')}>
        <img
          src={subAcademy}
          alt="Alltak Academy"
          className="mb-4 h-10 w-auto select-none md:h-12"
          draggable={false}
        />
        {t('cursos.headerSub')}
      </PageHeader>

      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CURSOS.map((c, i) => (
            <Reveal key={c} delay={i * 60}>
              <div className="flex h-full flex-col justify-between border border-black/10 bg-white p-7">
                <div>
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-alltak-blue">{t(`cursos.${c}.nivel`)}</span>
                  <h3 className="mt-2 text-2xl">{t(`cursos.${c}.nome`)}</h3>
                  <p className="mt-2 text-sm text-alltak-black/60">{t(`cursos.${c}.desc`)}</p>
                </div>
                <button className="btn-trapezoid btn-blue mt-6 self-start !py-2 !text-xs">{t('cursos.interesse')}</button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
