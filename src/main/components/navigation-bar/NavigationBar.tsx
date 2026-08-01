import { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { HamburgerMenuButton } from './components/hamburger-menu/button/HamburgerMenuButton'
import { NavigationMenu } from './navigation-menu/NavigationMenu'
import { ShoppingBagContainer } from './components/shopping-bag/container/ShoppingBagContainer'
import { LoginButton } from './components/login-button/LoginButton'
import { LogoutButton } from './components/logout-button/LogoutButton'
import './NavigationBar.css'
import '../../css/shared/no-display.css'
import '../../css/shared/visible-from-desktop-landscape.css'
import { ProfileButton } from './components/profile-button/ProfileButton'

export function Nav({isAuthenticated, onLogout}: {isAuthenticated: boolean, onLogout: () => void}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [shoppingBagOpen, setShoppingBagOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <nav className = 'nav-bar-container'>
      <div className='nav-bar-upper-row-container'>
        <NavLink to={'/'} className = 'restaurant-name'>
            ImagineBar
        </NavLink>
        <span className='menu-button-container'>
          {isAuthenticated && (
            <>
              <ProfileButton/>
              <div className='menu-button-separator' />
            </>
          )}
          <ShoppingBagContainer
            shoppingBagOpen={shoppingBagOpen}
            setShoppingBagOpen={setShoppingBagOpen}
            dropdownRef={dropdownRef}
          />
          <div className='menu-button-separator visible-from-desktop-landscape'></div>
          {!isAuthenticated && (
            <LoginButton/>
          )}
          {isAuthenticated && (
            <LogoutButton
              onLogout={onLogout}
            />
          )}
          {/* HamburgerMenuButton handles it's own separator */}
          <HamburgerMenuButton
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        </span>
      </div>
      <div className='navigation-bar-separator' />
      <NavigationMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </nav>
  )
}
