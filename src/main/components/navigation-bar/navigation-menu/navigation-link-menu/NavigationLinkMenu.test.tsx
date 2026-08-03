import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ActiveMenuCategoryProvider, ActiveMenuCategoryContext } from '../../../../context/ActiveMenuCategoryContext/ActiveMenuCategoryContext'
import { NavigationLinkMenu } from './NavigationLinkMenu'

function renderMenu() {
  render(
    <MemoryRouter>
      <ActiveMenuCategoryProvider>
        <NavigationLinkMenu />
      </ActiveMenuCategoryProvider>
    </MemoryRouter>
  )
}

function renderMenuWithActiveCategory(activeMenuCategory: string) {
  render(
    <MemoryRouter>
      <ActiveMenuCategoryContext.Provider value={{ activeMenuCategory, setActiveMenuCategory: jest.fn() }}>
        <NavigationLinkMenu />
      </ActiveMenuCategoryContext.Provider>
    </MemoryRouter>
  )
}

describe('NavigationLinkMenu', () => {
  it('renders the menu category links pointing at the matching menu page section', () => {
    renderMenu()

    expect(screen.getByRole('link', { name: 'Levesek' })).toHaveAttribute('href', '/menu_page?category=soups')
    expect(screen.getByRole('link', { name: 'Egytélételek' })).toHaveAttribute('href', '/menu_page?category=main-dishes')
    expect(screen.getByRole('link', { name: 'Italok' })).toHaveAttribute('href', '/menu_page?category=drinks')
    expect(screen.getByRole('link', { name: 'Desszertek' })).toHaveAttribute('href', '/menu_page?category=desserts')
  })

  it('still renders the pre-existing nav items', () => {
    renderMenu()

    expect(screen.getByRole('link', { name: 'Allergének' })).toHaveAttribute('href', '/allergens')
    expect(screen.getByRole('link', { name: 'Galéria' })).toHaveAttribute('href', '/gallery')
    expect(screen.getByRole('link', { name: 'Kapcsolat' })).toHaveAttribute('href', '#contact')
  })

  it('does not render an "Étlap" nav item', () => {
    renderMenu()

    expect(screen.queryByRole('link', { name: 'Étlap' })).not.toBeInTheDocument()
  })

  it('highlights only the currently active category', () => {
    renderMenuWithActiveCategory('drinks')

    expect(screen.getByRole('link', { name: 'Italok' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Italok' })).toHaveAttribute('aria-current', 'page')

    expect(screen.getByRole('link', { name: 'Levesek' })).not.toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Levesek' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Egytélételek' })).not.toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Desszertek' })).not.toHaveClass('active')
  })
})
