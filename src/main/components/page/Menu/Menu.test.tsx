import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider } from '../../../context/ModalMessageContext/ModalMessageContext'
import { ActiveMenuCategoryProvider } from '../../../context/ActiveMenuCategoryContext/ActiveMenuCategoryContext'
import { Menu } from './Menu'

const menuItemsFixture = [
  {
    foodId: 1,
    foodName: { value: 'Gulyásleves' },
    price: { amount: '1500', currency: 'HUF' },
    category: 'SOUPS',
    allergens: [],
    imageUrl: { value: '/soup.jpg' },
  },
  {
    foodId: 2,
    foodName: { value: 'Kóla' },
    price: { amount: '600', currency: 'HUF' },
    category: 'DRINKS',
    allergens: [],
    imageUrl: { value: '/cola.jpg' },
  },
]

function mockFetchOk() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(menuItemsFixture),
  }) as jest.Mock
}

function renderMenu(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ModalProvider>
        <ActiveMenuCategoryProvider>
          <Menu url="/v1/foods/menu/RESTAURANT" />
        </ActiveMenuCategoryProvider>
      </ModalProvider>
    </MemoryRouter>
  )
}

describe('Menu', () => {
  beforeEach(() => {
    mockFetchOk()
    Element.prototype.scrollIntoView = jest.fn()
  })

  it('renders each category section with a stable id, even when a category has no items', async () => {
    const { findByText } = renderMenu('/menu_page')

    await findByText('Gulyásleves')

    expect(document.getElementById('menu-category-soups')).not.toBeNull()
    expect(document.getElementById('menu-category-main-dishes')).not.toBeNull()
    expect(document.getElementById('menu-category-drinks')).not.toBeNull()
    expect(document.getElementById('menu-category-desserts')).not.toBeNull()
  })

  it('scrolls the matching section into view when ?category= is present', async () => {
    const { findByText } = renderMenu('/menu_page?category=drinks')

    const heading = await findByText('Italok')
    expect(heading.id).toBe('menu-category-drinks')

    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled())
  })

  it('does not scroll when no ?category= is present', async () => {
    const { findByText } = renderMenu('/menu_page')

    await findByText('Gulyásleves')

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
  })

  it('does not scroll when ?category= does not match a known category', async () => {
    const { findByText } = renderMenu('/menu_page?category=bogus')

    await findByText('Gulyásleves')

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
  })
})
