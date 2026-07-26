import { useEffect } from 'react'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './css/hamburger-menu.css'
import './css/hamburger-menu-separator.css'

interface HamburgerMenuButtonProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function HamburgerMenuButton({ menuOpen, setMenuOpen }: HamburgerMenuButtonProps) {
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
        aria-expanded={menuOpen}
        aria-controls="menu"
        focusable="true"
        aria-hidden="false"
      />
    </>
  )
}