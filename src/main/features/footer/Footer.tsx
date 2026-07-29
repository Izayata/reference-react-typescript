import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import './Footer.css'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faFacebook, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons'

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

        </div>
      </section>
      <div
        style={{
          border: '1px solid',
          borderRadius: '5px',
          borderColor: '#00000077',
        }}
      />
      <section>
        <h3>{t('footer.brandTitle')}</h3>
        <div>
          <p>{t('footer.founded')}</p>
          <p>{t('footer.termsPlaceholder')}</p>
          <p>{t('footer.legalPlaceholder')}</p>
        </div>
      </section>
      <div
        style={{
          border: '1px solid',
          borderRadius: '5px',
          borderColor: '#00000077',
        }}
      />
      <section>
        <h3>Credits</h3>
        <div>
          <p>Designed and Developed by Martin Juracskó</p>
          <p>© 2024 ImagineBar. All rights reserved.</p>
        </div>
      </section>
      <div
        style={{
          border: '1px solid',
          borderRadius: '5px',
          borderColor: '#00000077',
        }}
      />
      <section>
        <h3>{t('footer.platformsTitle')}</h3>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <p>
            <a href="https://facebook.com" className='social-media-link header-button-scale'>
              <FontAwesomeIcon icon={faFacebook as IconProp} /> - Facebook
            </a>
          </p>
          <p>
            <a href="https://instagram.com" className='social-media-link header-button-scale'>
              <FontAwesomeIcon icon={faInstagram as IconProp} /> - Instagram
            </a>
          </p>
          <p>
            <a href="https://tiktok.com" className='social-media-link header-button-scale'>
              <FontAwesomeIcon icon={faTiktok as IconProp} /> - Tiktok
            </a>
          </p>
          <p>
            <a href="https://www.youtube.com/watch?v=BBJa32lCaaY" className='social-media-link header-button-scale'>
              <FontAwesomeIcon icon={faYoutube as IconProp} /> - Youtube
            </a>
          </p>
        </div>
      </section>
      
    </footer>
  )
}