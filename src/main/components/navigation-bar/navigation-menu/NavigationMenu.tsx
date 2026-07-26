import { useEffect } from 'react'
import { NavigationLinkMenu } from './navigation-link-menu/NavigationLinkMenu'
import './css/menu-container.css'

interface OpenedHamburgerMenuContainerProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function NavigationMenu({ menuOpen, setMenuOpen }: OpenedHamburgerMenuContainerProps) {
  useEffect(() => {
    menuOpen
      ? (
        document.querySelector('.menu-container')?.classList.add('open'),
        document.querySelector('.navigation-link-menu')?.classList.add('open')
      )
      : (
        document.querySelector('.menu-container')?.classList.remove('open'),
        document.querySelector('.navigation-link-menu')?.classList.remove('open')
      )
  }, [menuOpen])

  return (
    <div className='menu-container' onClick={() => setMenuOpen(false)}>
      <NavigationLinkMenu />
    </div>
  )
}