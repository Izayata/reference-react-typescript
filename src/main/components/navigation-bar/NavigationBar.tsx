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
import '../../css/shared/hidden-from-desktop-landscape.css'
import { ProfileButton } from './components/profile-button/ProfileButton'
import { WelcomeGreeting } from './components/welcome-greeting/WelcomeGreeting'

export function Nav(
  {isAuthenticated, username, onLogout}:
  {isAuthenticated: boolean, username: string | null, onLogout: () => void}
) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [shoppingBagOpen, setShoppingBagOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <nav className = 'nav-bar-container'>
      <div className={`nav-bar-upper-row-container${isAuthenticated && username ? ' has-mobile-greeting' : ''}`}>
        <span className='visible-from-desktop-landscape'>
          <NavLink to={'/'} className = 'restaurant-name'>
              ImagineBar
          </NavLink>
        </span>
        {isAuthenticated && username && (
          <span className='hidden-from-desktop-landscape nav-bar-mobile-greeting'>
            <WelcomeGreeting username={username} />
          </span>
        )}
        <span className='menu-button-container'>
          {isAuthenticated && (
            <>
              {username && (
                <span className='visible-from-desktop-landscape'>
                  <WelcomeGreeting username={username} />
                </span>
              )}
              <span className='visible-from-desktop-landscape'>
                <div className='menu-button-separator' />
                <ProfileButton/>
                <div className='menu-button-separator' />
              </span>
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
            <span className='visible-from-desktop-landscape'>
              <LogoutButton
                onLogout={onLogout}
              />
            </span>
          )}
          {/* HamburgerMenuButton handles it's own separator */}
          <HamburgerMenuButton
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        </span>
      </div>
      <div className='navigation-bar-separator' />
      <NavigationMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
      />
    </nav>
  )
}
