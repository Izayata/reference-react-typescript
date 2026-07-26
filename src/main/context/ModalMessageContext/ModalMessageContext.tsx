import { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextType {
  modalMessage: string | null
  setModalMessage: (message: string | null) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalMessage, setModalMessage] = useState<string | null>(null)

  return (
    <ModalContext.Provider value={{ modalMessage, setModalMessage }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
