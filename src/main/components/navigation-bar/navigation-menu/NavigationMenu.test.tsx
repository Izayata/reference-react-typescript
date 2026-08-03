import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ActiveMenuCategoryProvider } from '../../../context/ActiveMenuCategoryContext/ActiveMenuCategoryContext'
import { NavigationMenu } from './NavigationMenu'

function renderOpenMenu() {
  const setMenuOpen = jest.fn()
  render(
    <MemoryRouter>
      <ActiveMenuCategoryProvider>
        <NavigationMenu
          menuOpen={true}
          setMenuOpen={setMenuOpen}
          isAuthenticated={false}
          onLogout={jest.fn()}
        />
      </ActiveMenuCategoryProvider>
    </MemoryRouter>
  )
  return { setMenuOpen }
}

describe('NavigationMenu', () => {
  it('closes when Escape is pressed', () => {
    const { setMenuOpen } = renderOpenMenu()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(setMenuOpen).toHaveBeenCalledWith(false)
  })

  it('traps focus: Tab on the last link wraps back to the first', () => {
    // Regression test: the open mobile menu had no focus trap, so Tab past
    // the last link moved focus into visually-hidden background content
    // instead of cycling back inside the menu.
    renderOpenMenu()

    const links = screen.getAllByRole('link')
    const lastLink = links[links.length - 1]
    const firstLink = links[0]

    lastLink.focus()
    expect(lastLink).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab' })

    expect(firstLink).toHaveFocus()
  })

  it('traps focus: Shift+Tab on the first link wraps back to the last', () => {
    renderOpenMenu()

    const links = screen.getAllByRole('link')
    const firstLink = links[0]
    const lastLink = links[links.length - 1]

    firstLink.focus()
    expect(firstLink).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

    expect(lastLink).toHaveFocus()
  })
})
