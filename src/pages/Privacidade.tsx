import PageHeader from '../components/PageHeader'

export default function Privacidade() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Política de Privacidade" />
      <section className="bg-alltak-cream py-16 text-alltak-black md:py-24">
        <div className="container-x max-w-3xl space-y-6 text-sm leading-relaxed text-alltak-black/75">
          <p>
            Esta página descreve como a Alltak trata os dados coletados neste site.
            Conteúdo de demonstração. Substituir pelo texto jurídico oficial.
          </p>
          <div>
            <h3 className="text-2xl text-alltak-black">Uso de dados</h3>
            <p className="mt-2">Os dados informados em formulários são utilizados exclusivamente para contato e atendimento.</p>
          </div>
          <div>
            <h3 className="text-2xl text-alltak-black">Cookies</h3>
            <p className="mt-2">Utilizamos cookies para melhorar a navegação e entender o uso do site.</p>
          </div>
          <div>
            <h3 className="text-2xl text-alltak-black">Formulários</h3>
            <p className="mt-2">As informações enviadas são armazenadas de forma segura e não compartilhadas com terceiros sem consentimento.</p>
          </div>
          <div>
            <h3 className="text-2xl text-alltak-black">Direitos do usuário</h3>
            <p className="mt-2">Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.</p>
          </div>
          <div>
            <h3 className="text-2xl text-alltak-black">Contato</h3>
            <p className="mt-2">Dúvidas sobre privacidade: contato@alltak.com.br.</p>
          </div>
        </div>
      </section>
    </>
  )
}
