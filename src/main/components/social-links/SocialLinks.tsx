import { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { useTranslation } from 'react-i18next'
import './SocialLinks.css'

interface SocialLink {
  name: string
  url: string
  icon: IconProp
  ariaLabelKey: string
}

const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Facebook', url: 'https://facebook.com', icon: faFacebook as IconProp, ariaLabelKey: 'header.facebookLinkAriaLabel' },
  { name: 'Instagram', url: 'https://instagram.com', icon: faInstagram as IconProp, ariaLabelKey: 'header.instagramLinkAriaLabel' },
  { name: 'TikTok', url: 'https://tiktok.com', icon: faTiktok as IconProp, ariaLabelKey: 'header.tiktokLinkAriaLabel' },
  { name: 'YouTube', url: 'https://www.youtube.com/watch?v=BBJa32lCaaY', icon: faYoutube as IconProp, ariaLabelKey: 'header.youtubeLinkAriaLabel' },
]

type SocialLinksVariant = 'icon-only' | 'icon-and-label'

interface SocialLinksProps {
  variant: SocialLinksVariant
}

export function SocialLinks({ variant }: SocialLinksProps) {
  const { t } = useTranslation()

  return (
    <>
      {SOCIAL_LINKS.map(link => (
        <Fragment key={link.name}>
          {variant === 'icon-only' ? (
            <>
              <span> &#9679; </span>
              <a href={link.url} className='social-media-link header-button-scale' aria-label={t(link.ariaLabelKey)}>
                <span><FontAwesomeIcon icon={link.icon} /></span>
              </a>
            </>
          ) : (
            <p>
              <a href={link.url} className='social-media-link header-button-scale'>
                <FontAwesomeIcon icon={link.icon} /> - {link.name}
              </a>
            </p>
          )}
        </Fragment>
      ))}
    </>
  )
}
