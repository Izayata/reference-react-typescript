import { useTranslation } from 'react-i18next'
import { LoadingIcon } from '../LoadingSpinnerIcon/LoadingIcon'

const visuallyHiddenStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export function LoadingOverlay() {
  const { t } = useTranslation()

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
        role="status"
        aria-live="polite"
        aria-busy="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          zIndex: 10000,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <LoadingIcon />
        <span style={visuallyHiddenStyle}>{t('common.loading')}</span>
      </div>
    </>
  )
}
