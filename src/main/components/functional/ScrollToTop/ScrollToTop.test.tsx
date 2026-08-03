import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, NavLink, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './ScrollToTop'

function renderWithRoutes(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ScrollToTop />
      <NavLink to="/other">Go to other page</NavLink>
      <NavLink to="/page#section">Go to page with hash</NavLink>
      <NavLink to="/page?query=1">Go to page with query</NavLink>
      <Routes>
        <Route path="/page" element={<div>Page content</div>} />
        <Route path="/other" element={<div>Other content</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn()
  })

  it('scrolls to top on the initial pathname and again after navigating to a different pathname', async () => {
    const user = userEvent.setup()
    const { findByText } = renderWithRoutes('/page')

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    jest.clearAllMocks()

    await user.click(await findByText('Go to other page'))

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('does not scroll again for a hash-only change on the same pathname', async () => {
    const user = userEvent.setup()
    const { findByText } = renderWithRoutes('/page')

    jest.clearAllMocks()

    await user.click(await findByText('Go to page with hash'))

    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('does not scroll again for a query-only change on the same pathname', async () => {
    const user = userEvent.setup()
    const { findByText } = renderWithRoutes('/page')

    jest.clearAllMocks()

    await user.click(await findByText('Go to page with query'))

    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})
