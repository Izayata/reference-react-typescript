import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import './css//header.css'
import './css//header-container.css'
import './css/social-media-link.css'
import '../../css/shared/visible-from-mobile-landscape.css'
import '../../css/shared/visible-from-tablet-profile.css'

// npm install @fortawesome/free-brands-svg-icons @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome --legacy-peer-deps

export function Header() {
  return (
    <header 
      className='header-container'>
      <div className="header">
        <span>ImagineBar</span>
        <span className='visible-from-mobile-landscape'> &#9679; Ahol álmaid étele vár</span>
        <div className='visible-from-tablet-profile'>
          <span> &#9679; </span>
          <a href="https://facebook.com" className='social-media-link header-button-scale'>
            <span><FontAwesomeIcon icon={faFacebook as IconProp} /></span>
          </a>
          <span> &#9679; </span>
          <a href="https://instagram.com" className='social-media-link header-button-scale'>
            <span><FontAwesomeIcon icon={faInstagram as IconProp} /></span>
          </a>
          <span> &#9679; </span>
          <a href="https://tiktok.com" className='social-media-link header-button-scale'>
            <span><FontAwesomeIcon icon={faTiktok as IconProp} /></span>
          </a>
          <span> &#9679; </span>
          <a href="https://www.youtube.com/watch?v=BBJa32lCaaY" className='social-media-link header-button-scale'>
            <span><FontAwesomeIcon icon={faYoutube as IconProp} /></span>
          </a>
        </div>
      </div>
    </header>
  )
}