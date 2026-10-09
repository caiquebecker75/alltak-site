import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { DICT as DICT_BASE, VALUES as VALUES_BASE } from './dict'
import { DICT_HOME, VALUES_HOME } from './dict-home'
import { DICT_ESTUDIOS, VALUES_ESTUDIOS } from './dict-estudios'
import { DICT_PAGINAS, VALUES_PAGINAS } from './dict-paginas'

// dicionário principal + um arquivo por área do site (home, estúdios 3D, páginas)
const DICT = { ...DICT_BASE, ...DICT_HOME, ...DICT_ESTUDIOS, ...DICT_PAGINAS }
const VALUES = { ...VALUES_BASE, ...VALUES_HOME, ...VALUES_ESTUDIOS, ...VALUES_PAGINAS }

export type Lang = 'pt' | 'en' | 'es'

// título da aba do navegador em cada idioma (o de PT é o do index.html)
const TITULO: Record<Lang, string> = {
  pt: 'Alltak | Envelopamento, Decoração e Comunicação Visual',
  en: 'Alltak | Vehicle Wrapping, Decor and Visual Communication',
  es: 'Alltak | Rotulación, Decoración y Comunicación Visual',
}
const aplicarIdioma = (l: Lang) => {
  document.documentElement.lang = l
  document.title = TITULO[l]
}
export const LANGS: { code: Lang; label: string }[] = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  // tv traduz VALORES de dados (acabamento, família, categoria); sem tradução, devolve o original
  tv: (value: string) => string
}
const I18nCtx = createContext<Ctx>({ lang: 'pt', setLang: () => {}, t: (k) => k, tv: (v) => v })

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
    aplicarIdioma(l)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('alltak_lang', l)
    aplicarIdioma(l)
  }, [])

  const t = useCallback(
    (key: string) => {
      const e = DICT[key]
      if (!e) return key
      return e[lang] ?? e.pt ?? key
    },
    [lang],
  )

  const tv = useCallback(
    (value: string) => (lang === 'pt' ? value : VALUES[value]?.[lang] ?? value),
    [lang],
  )

  return <I18nCtx.Provider value={{ lang, setLang, t, tv }}>{children}</I18nCtx.Provider>
}
