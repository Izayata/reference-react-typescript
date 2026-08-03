import { createContext, useContext, useState, ReactNode } from 'react'

interface ActiveMenuCategoryContextType {
  activeMenuCategory: string | null
  setActiveMenuCategory: (slug: string | null) => void
}

export const ActiveMenuCategoryContext = createContext<ActiveMenuCategoryContextType | undefined>(undefined)

export const ActiveMenuCategoryProvider = ({ children }: { children: ReactNode }) => {
  const [activeMenuCategory, setActiveMenuCategory] = useState<string | null>(null)

  return (
    <ActiveMenuCategoryContext.Provider value={{ activeMenuCategory, setActiveMenuCategory }}>
      {children}
    </ActiveMenuCategoryContext.Provider>
  )
}

export const useActiveMenuCategory = () => {
  const context = useContext(ActiveMenuCategoryContext)
  if (!context) {
    throw new Error('useActiveMenuCategory must be used within an ActiveMenuCategoryProvider')
  }
  return context
}
