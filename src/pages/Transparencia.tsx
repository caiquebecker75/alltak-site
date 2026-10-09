import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { useI18n } from '../i18n'

// Página migrada do site antigo (/transparencia-salarial/): Relatório de
// Transparência Salarial exigido pela Lei 14.611/2023, atualizado por semestre.
// Documento legal brasileiro: em EN/ES traduz títulos e rótulos, mantém o texto
// do relatório em português e mostra um aviso.
const PDF_ATUAL =
  'https://alltak.com.br/wp-content/uploads/2026/10/Relatorio-Transparencia-Salarial-2o-Semestre.pdf'

export default function Transparencia() {
  const { lang, t } = useI18n()
  return (
    <>
      <PageHeader eyebrow={t('transp.eyebrow')} title={t('transp.titulo')}>
        {t('transp.headerSub')}
      </PageHeader>

      <section className="bg-alltak-black py-14 md:py-20">
        <div className="container-x grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-white/75">
              {lang !== 'pt' && (
                <p className="border-l-4 border-alltak-blue pl-4 text-sm text-white/60">{t('transp.aviso')}</p>
              )}
              <p>
                Na Alltak, acreditamos que um ambiente de trabalho transparente e justo é
                essencial para o crescimento de todos. Por isso, em conformidade com a
                Lei 14.611/2023, disponibilizamos o Relatório de Transparência Salarial (RTS),
                reforçando nosso compromisso com a equidade de gênero e a valorização
                profissional.
              </p>
              <p>
                Aqui, reconhecemos e incentivamos o brilho de cada colaborador. Acreditamos na
                força da nossa cultura, onde a transparência e o respeito são pilares
                fundamentais. Nosso valor Caveira simboliza igualdade e diversidade: aqui,
                somos todos iguais! Por isso, promovemos um espaço onde a dedicação e o talento
                são sempre valorizados, garantindo oportunidades justas para todos.
              </p>
              <p>
                Sabemos que sempre há espaço para evolução e estamos constantemente buscando
                melhorias. Afinal, nosso propósito é seguir comprometidos em criar um ambiente
                autêntico, dinâmico e inovador, onde cada profissional tenha a liberdade de
                crescer e se desenvolver plenamente.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="border border-white/10 bg-alltak-coal p-8">
              <p className="eyebrow text-alltak-blue">{t('transp.vigente')}</p>
              <h2 className="mt-2 text-3xl text-white">{t('transp.semestre')}</h2>
              <p className="mt-3 text-sm text-white/55">{t('transp.docOficial')}</p>
              <a href={PDF_ATUAL} target="_blank" rel="noreferrer" className="btn-trapezoid btn-blue mt-6">
                {t('transp.baixar')}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
