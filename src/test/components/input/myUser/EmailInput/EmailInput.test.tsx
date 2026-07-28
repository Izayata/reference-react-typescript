import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { EmailInput } from '../../../../../main/components/input/myUser/EmailInput/EmailInput'

function renderEmailInput() {
  let value = ''
  const onChange = jest.fn((e: React.ChangeEvent<HTMLInputElement>) => {
    value = e.target.value
  })
  const { rerender } = render(
    <MemoryRouter>
      <EmailInput value={value} onChange={onChange} />
    </MemoryRouter>
  )

  return {
    changeValue: (newValue: string) => {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: newValue } })
      value = newValue
      rerender(
        <MemoryRouter>
          <EmailInput value={value} onChange={onChange} />
        </MemoryRouter>
      )
    },
  }
}

function mockFetch(response: { ok: boolean, json?: () => Promise<unknown> }) {
  global.fetch = jest.fn(() => Promise.resolve(response)) as unknown as typeof fetch
}

describe('EmailInput', () => {
  it('shows an available checkmark when the email is valid and not taken', async () => {
    mockFetch({ ok: true, json: async () => ({ exists: false }) })
    const { changeValue } = renderEmailInput()

    changeValue('test@example.com')

    expect(await screen.findByLabelText('Elérhető e-mail cím', {}, { timeout: 3000 })).toBeInTheDocument()
  })

  it('shows an unavailable mark and error when the email is already taken', async () => {
    mockFetch({ ok: true, json: async () => ({ exists: true }) })
    const { changeValue } = renderEmailInput()

    changeValue('test@example.com')

    expect(await screen.findByLabelText('Nem elérhető e-mail cím', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(await screen.findByText('A megadott email cím foglalt!')).toBeInTheDocument()
  })

  it('surfaces an error instead of silently reporting "available" when the check itself fails', async () => {
    // Regression test for AUDIT-2.md §1.3 — see UsernameInput.test.tsx for the
    // full explanation; EmailInput had the identical bug/fix in checkEmailExists.
    mockFetch({ ok: false })
    const { changeValue } = renderEmailInput()

    changeValue('test@example.com')

    expect(await screen.findByText('Hiba történt az e-mail cím ellenőrzése során, próbálja újra!', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.queryByLabelText('Elérhető e-mail cím')).not.toBeInTheDocument()
  })
})
