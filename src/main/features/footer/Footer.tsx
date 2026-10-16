import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './Footer.css'
import { SocialLinks } from '../../components/social-links/SocialLinks'
import '../../css/shared/separator-hr.css'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <section id='contact'>
        <h3>{t('footer.contactTitle')}</h3>
        <div>
          <p>{t('footer.email')}</p>
          <p>{t('footer.phone')}</p>
          <p>{t('footer.address')}</p>
          <p>{t('footer.companyRegistry')}</p>
        </div>
      </section>
      <div className='content-separator footer-separator' />
      <section>
        <h3>{t('footer.brandTitle')}</h3>
        <div>
          <p>{t('footer.founded')}</p>
          <p><Link to='/terms'>{t('footer.termsLinkLabel')}</Link></p>
          <p>{t('footer.legalPlaceholder')}</p>
        </div>
      </section>
      <div className='content-separator footer-separator' />
      <section>
        <h3>Credits</h3>
        <div>
          <p>Designed and Developed by Martin Juracskó</p>
          <p>© 2024 ImagineBar. All rights reserved.</p>
        </div>
      </section>
      <div className='content-separator footer-separator' />
      <section>
        <h3>{t('footer.platformsTitle')}</h3>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <SocialLinks variant='icon-and-label' />
        </div>
      </section>
      
    </footer>
  )
}