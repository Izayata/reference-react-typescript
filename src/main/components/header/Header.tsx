import { useTranslation } from 'react-i18next'
import { SocialLinks } from '../social-links/SocialLinks'
import './Header.css'
import '../../css/shared/visible-from-mobile-landscape.css'
import '../../css/shared/visible-from-tablet-profile.css'

export function Header() {
  const { t } = useTranslation()

  return (
    <header
      className='header-container'>
      <div className="header">
        <span>ImagineBar</span>
        <span className='visible-from-mobile-landscape'> &#9679; {t('header.tagline')}</span>
        <div className='visible-from-tablet-profile'>
          <SocialLinks variant='icon-only' />
        </div>
      </div>
    </header>
  )
}