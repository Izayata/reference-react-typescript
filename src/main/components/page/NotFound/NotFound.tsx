import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../../../css/shared/button/application-button-style.css'

export function NotFound() {
  const { t } = useTranslation()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <h1 className='page-title'>{t('notFound.title')}</h1>
      <p>{t('notFound.message')}</p>
      <NavLink to='/' className='application-button-style animated' style={{ textDecoration: 'none' }}>
        {t('notFound.backToHome')}
      </NavLink>
    </div>
  )
}
