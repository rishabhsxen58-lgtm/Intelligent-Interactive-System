import { createContext, useContext, useState } from 'react'

const UICtx = createContext(null)

export function UIProvider({ children }) {
  const [dark, setDark] = useState(false)
  const [largeFont, setLargeFont] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  return <UICtx.Provider value={{ dark, setDark, largeFont, setLargeFont, highContrast, setHighContrast }}>{children}</UICtx.Provider>
}

export const useUI = () => useContext(UICtx)
