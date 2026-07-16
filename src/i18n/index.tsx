import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { DICT } from './dict'

export type Lang = 'pt' | 'en' | 'es'
export const LANGS: { code: Lang; label: string }[] = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string }
const I18nCtx = createContext<Ctx>({ lang: 'pt', setLang: () => {}, t: (k) => k })

export const useI18n = () => useContext(I18nCtx)
export const useT = () => useContext(I18nCtx).t

function detect(): Lang {
  const saved = localStorage.getItem('alltak_lang') as Lang | null
  if (saved && ['pt', 'en', 'es'].includes(saved)) return saved
  const nav = navigator.language.slice(0, 2)
  if (nav === 'en') return 'en'
  if (nav === 'es') return 'es'
  return 'pt'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt')

  useEffect(() => {
    const l = detect()
    setLangState(l)
    document.documentElement.lang = l
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('alltak_lang', l)
    document.documentElement.lang = l
  }, [])

  const t = useCallback(
    (key: string) => {
      const e = DICT[key]
      if (!e) return key
      return e[lang] ?? e.pt ?? key
    },
    [lang],
  )

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>
}
