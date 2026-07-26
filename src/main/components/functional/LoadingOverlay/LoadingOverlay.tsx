import { LoadingIcon } from '../LoadingSpinnerIcon/LoadingIcon'

export function LoadingOverlay() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          cursor: 'not-allowed'
        }}
        tabIndex={-1}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          zIndex: 10000,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <LoadingIcon />
      </div>
    </>
  )
}
