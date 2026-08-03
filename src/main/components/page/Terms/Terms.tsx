import { useTranslation } from 'react-i18next'

export function Terms() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className='page-title'>{t('terms.pageTitle')}</h1>
      <p>{t('terms.placeholder')}</p>
    </div>
  )
}
