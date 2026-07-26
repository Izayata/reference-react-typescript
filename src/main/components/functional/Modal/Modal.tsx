import './Modal.css'

interface ModalProps {
  message: string
  onClose: () => void
}

export function Modal({ message, onClose }: ModalProps) {
  const isSuccess = message.toLowerCase().includes('siker')

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p className={`modal-message${isSuccess ? ' modal-message-success' : ''}`} style={{textAlign: `${message.includes('\n') ? 'left' : 'center'}`, whiteSpace: 'pre-line' }}>{message}</p>
        <button className="application-button-style" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  )
}