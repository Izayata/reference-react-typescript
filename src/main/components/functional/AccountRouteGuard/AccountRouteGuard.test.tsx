import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AccountRouteGuard } from './AccountRouteGuard'

function renderGuard(isAuthenticated: boolean) {
  return render(
    <MemoryRouter initialEntries={['/account']}>
      <Routes>
        <Route
          path="/account"
          element={
            <AccountRouteGuard isAuthenticated={isAuthenticated}>
              <div>Protected account content</div>
            </AccountRouteGuard>
          }
        />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AccountRouteGuard', () => {
  it('renders children when authenticated', () => {
    renderGuard(true)

    expect(screen.getByText('Protected account content')).toBeInTheDocument()
  })

  it('redirects to /login and renders nothing when not authenticated', async () => {
    renderGuard(false)

    expect(screen.queryByText('Protected account content')).not.toBeInTheDocument()
    expect(await screen.findByText('Login page')).toBeInTheDocument()
  })
})
