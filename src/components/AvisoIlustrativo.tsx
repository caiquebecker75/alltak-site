import { useT } from '../i18n'

// "Imagens meramente ilustrativas": aviso discreto nas páginas com fotos de
// produtos (cartela, linhas, segmentos, Home). claro = fundo claro (creme).
export default function AvisoIlustrativo({ claro = false, className = '' }: { claro?: boolean; className?: string }) {
  const t = useT()
  return (
    <p className={`text-sm ${claro ? 'text-alltak-black/45' : 'text-white/40'} ${className}`}>
      {t('comum.ilustrativas')}
    </p>
  )
}
