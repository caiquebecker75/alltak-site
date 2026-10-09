// Rótulos da galeria vieram do nome do arquivo no WordPress
// ("FPP_GLOSS_ALLTAK", "KROMA_GRAFITE_SITE", "BANANA-YELLOW-18U21"):
// troca _ e - por espaço e tira sufixos de upload (SITE, LOJA VIRTUAL, 1080...)
export function limparRotulo(r: string): string {
  return r
    .replace(/\.(JPG|JPEG|PNG|WEBP)(\.WEBP)?/gi, '')
    .replace(/[_]+/g, ' ')
    .replace(/-{2,}/g, ' ')
    .replace(/(?<=[A-ZÀ-Ú])-(?=[A-ZÀ-Ú0-9])/g, ' ')
    .replace(/\b(SITE|ALLTAK|LOJA VIRTUAL|LOJA ONLINE|BOBINA|1080|ADESIVOS)\b/gi, ' ')
    .replace(/\s+\d(\s+\d)?$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
