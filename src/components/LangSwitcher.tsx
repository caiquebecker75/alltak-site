import { LANGS, useI18n } from '../i18n'

// PT / EN / ES language switcher.
export default function LangSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n()
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`font-display text-xs font-bold uppercase tracking-wide px-2 py-1 transition ${
            lang === l.code ? 'text-alltak-blue' : 'text-white/50 hover:text-white'
          }`}
          aria-pressed={lang === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
