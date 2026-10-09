import PageHeader from '../components/PageHeader'
import { useT } from '../i18n'

// seções da política: chaves priv.<id>Titulo / priv.<id>Texto (dict-paginas.ts)
const SECOES = ['uso', 'cookies', 'form', 'direitos', 'contato']

export default function Privacidade() {
  const t = useT()
  return (
    <>
      <PageHeader eyebrow={t('priv.eyebrow')} title={t('priv.titulo')} />
      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x max-w-3xl space-y-6 text-sm leading-relaxed text-alltak-black/75">
          <p>{t('priv.intro')}</p>
          {SECOES.map((s) => (
            <div key={s}>
              <h3 className="text-2xl text-alltak-black">{t(`priv.${s}Titulo`)}</h3>
              <p className="mt-2">{t(`priv.${s}Texto`)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
