// O site é estático (GitHub Pages), sem servidor para receber formulários: o
// envio abre o e-mail do visitante com a mensagem pronta para a Alltak.
// e-mails por setor informados pela Alltak (nov/2026); o SAC recebe o geral
export const EMAILS = {
  sac: 'sac@alltak.com.br',
  marketing: 'talita.santos@alltak.com.br',
  comercial: 'sandra@alltak.com.br',
  compras: 'debora.guimaraes@alltak.com.br',
  rh: 'rh@alltak.com.br',
}

export function enviarPorEmail(assunto: string, campos: [rotulo: string, valor: string][], para = EMAILS.sac): void {
  const corpo = campos.filter(([, v]) => v.trim()).map(([r, v]) => `${r}: ${v.trim()}`).join('\n')
  window.location.href = `mailto:${para}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`
}
