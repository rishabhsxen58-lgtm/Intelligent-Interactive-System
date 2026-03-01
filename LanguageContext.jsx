import { createContext, useContext, useState } from 'react'

const strings = {
  en: {
    title: 'Government Grievance System',
    login: 'Login',
    register: 'Register',
    logout: 'Logout'
  },
  hi: {
    title: 'सरकारी शिकायत प्रणाली',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट'
  }
}

const LangCtx = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = strings[lang]
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)
