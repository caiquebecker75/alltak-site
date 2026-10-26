// Modo prévia: páginas que ainda não estão públicas (Visualizador "Pinte o carro
// sem tinta" e Simule agora) só abrem para quem tem o link com a chave
// (#/visualizador?previa=alltak75). A chave fica guardada no navegador; para
// sair, abra #/visualizador?previa=sair.
const CHAVE = 'alltak75'
const ARMAZEM = 'alltak-previa'

export function previaAtiva(): boolean {
  try {
    const q = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
    const p = q.get('previa')
    if (p === CHAVE) localStorage.setItem(ARMAZEM, '1')
    if (p === 'sair') localStorage.removeItem(ARMAZEM)
    return localStorage.getItem(ARMAZEM) === '1'
  } catch {
    return false
  }
}
