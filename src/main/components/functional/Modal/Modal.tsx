import { useEffect, useRef } from 'react'
import './Modal.css'

interface ModalProps {
  message: string
  onClose: () => void
}

export function Modal({ message, onClose }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement | null

    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Tab') {
        // The OK button is the only focusable element in this modal, so trapping
        // focus here just means keeping it there on every Tab press.
        e.preventDefault()
        closeButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedElement?.focus()
    }
  }, [onClose])

  return (
    <div className="modal-overlay">
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-message">
        <p
          id="modal-message"
          className="modal-message"
          style={{textAlign: `${message.includes('\n') ? 'left' : 'center'}`, whiteSpace: 'pre-line' }}
        >
          {message}
        </p>
        <button ref={closeButtonRef} className="application-button-style modal-ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  )
}
