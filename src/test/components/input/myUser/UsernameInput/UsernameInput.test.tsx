import { render, screen, fireEvent } from '@testing-library/react'
import { UsernameInput } from '../../../../../main/components/input/myUser/UsernameInput/UsernameInput'

function renderUsernameInput() {
  let value = ''
  const onChange = jest.fn((e: React.ChangeEvent<HTMLInputElement>) => {
    value = e.target.value
  })
  const { rerender } = render(<UsernameInput value={value} onChange={onChange} />)

  return {
    changeValue: (newValue: string) => {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: newValue } })
      value = newValue
      rerender(<UsernameInput value={value} onChange={onChange} />)
    },
  }
}

function mockFetch(response: { ok: boolean, json?: () => Promise<unknown> }) {
  global.fetch = jest.fn(() => Promise.resolve(response)) as unknown as typeof fetch
}

describe('UsernameInput', () => {
  it('shows an available checkmark when the username is valid and not taken', async () => {
    mockFetch({ ok: true, json: async () => ({ exists: false }) })
    const { changeValue } = renderUsernameInput()

    changeValue('ValidUser123')

    expect(await screen.findByLabelText('Elérhető felhasználónév', {}, { timeout: 3000 })).toBeInTheDocument()
  })

  it('shows an unavailable mark and error when the username is already taken', async () => {
    mockFetch({ ok: true, json: async () => ({ exists: true }) })
    const { changeValue } = renderUsernameInput()

    changeValue('ValidUser123')

    expect(await screen.findByLabelText('Nem elérhető felhasználónév', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(await screen.findByText('A megadott felhasználónév foglalt!')).toBeInTheDocument()
  })

  it('surfaces an error instead of silently reporting "available" when the check itself fails', async () => {
    // Regression test for AUDIT-2.md §1.3: a non-ok response used to be treated
    // as "not taken" (checkUsernameExists returned false), showing a false
    // available checkmark. It now throws, and this component catches that
    // rejection (previously outside any reachable try/catch) and shows an error.
    mockFetch({ ok: false })
    const { changeValue } = renderUsernameInput()

    changeValue('ValidUser123')

    expect(await screen.findByText('Hiba történt a felhasználónév ellenőrzése során, próbálja újra!', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.queryByLabelText('Elérhető felhasználónév')).not.toBeInTheDocument()
  })
})
