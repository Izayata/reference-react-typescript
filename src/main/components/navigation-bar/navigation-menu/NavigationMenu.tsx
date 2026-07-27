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

  useEffect(() => {
    if (!menuOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen, setMenuOpen])

  return (
    // This is a full-viewport backdrop, not a control: keyboard users dismiss it via
    // Escape (handled above), not by tabbing to it, so it's intentionally not focusable.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className='menu-container' onClick={() => setMenuOpen(false)}>
      <NavigationLinkMenu />
    </div>
  )
}