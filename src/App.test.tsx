import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: false })
  })

  it('renders the app shell once the auth check resolves', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    const matches = await screen.findAllByText('ImagineBar', {}, { timeout: 3000 })
    expect(matches.length).toBeGreaterThan(0)
  })
})
