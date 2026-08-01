import { useEffect, useRef } from 'react'
import { NavigationLinkMenu } from './navigation-link-menu/NavigationLinkMenu'
import './NavigationMenu.css'

interface OpenedHamburgerMenuContainerProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const FOCUSABLE_SELECTOR = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function NavigationMenu({ menuOpen, setMenuOpen }: OpenedHamburgerMenuContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        return
      }

      if (e.key !== 'Tab' || !containerRef.current) return

      const focusable = Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen, setMenuOpen])

  return (
    // This is a full-viewport backdrop, not a control: keyboard users dismiss it via
    // Escape (handled above), not by tabbing to it, so it's intentionally not focusable.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className='menu-container' onClick={() => setMenuOpen(false)} ref={containerRef}>
      <NavigationLinkMenu />
    </div>
  )
}
