import { useEffect } from 'react'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import './HamburgerMenuButton.css'

interface HamburgerMenuButtonProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function HamburgerMenuButton({ menuOpen, setMenuOpen }: HamburgerMenuButtonProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      document.querySelector('.shopping-bag-icon')?.classList.add('no-display')
      
    } else {
      document.body.style.overflow = ''
      document.querySelector('.shopping-bag-icon')?.classList.remove('no-display')
    }

  }, [menuOpen])

  return(
    <>
      <div className='hamburger-menu-separator' />
      <FontAwesomeIcon
        icon={faBars}
        onClick={() => setMenuOpen(true)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setMenuOpen(true)
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={menuOpen}
        aria-controls="menu"
        aria-label={t('nav.openMenuAriaLabel')}
        aria-hidden="false"
        focusable="true"
      />
    </>
  )
}