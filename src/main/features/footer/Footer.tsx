import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Footer.css'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faFacebook, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons'

export function Footer() {
  return (
    <footer className="footer">
      <section>
        <h3>Elérhetőségek</h3>
        <div>
          <p>Email: imagine@bar.com</p>
          <p>Telefon: +36/7777/9999/33/777/33/8/33/8</p>
          <p>Cím: 4032 Debrecen, Képzelet tér 42</p>

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
        <h3>ImagineBar &#9679; Ahol álmaid étele vár</h3>
        <div>
          <p>Alapítva az álmaimban (Valamikor pedig a valóságban is)</p>
          <p>ÁSZF placeholder</p>
          <p>Jogi nyilatkozat placeholder</p>
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
          <p>© 2024 Thes. All rights reserved.</p>
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
        <h3>Platformok</h3>
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