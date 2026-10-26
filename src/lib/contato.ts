// O site é estático (GitHub Pages), sem servidor para receber formulários: o
// envio abre o e-mail do visitante com a mensagem pronta para a Alltak.
export const EMAIL_ALLTAK = 'alltak@alltak.com.br'

export function enviarPorEmail(assunto: string, campos: [rotulo: string, valor: string][]): void {
  const corpo = campos.filter(([, v]) => v.trim()).map(([r, v]) => `${r}: ${v.trim()}`).join('\n')
  window.location.href = `mailto:${EMAIL_ALLTAK}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`
}
