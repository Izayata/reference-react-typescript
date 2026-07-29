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
    // Regression test: a non-ok response used to be treated as "not taken"
    // (checkUsernameExists returned false), showing a false available
    // checkmark. It now throws, and this component catches that rejection
    // (previously outside any reachable try/catch) and shows an error.
    mockFetch({ ok: false })
    const { changeValue } = renderUsernameInput()

    changeValue('ValidUser123')

    expect(await screen.findByText('Hiba történt a felhasználónév ellenőrzése során, próbálja újra!', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.queryByLabelText('Elérhető felhasználónév')).not.toBeInTheDocument()
  })

  it('ignores a stale availability-check response that resolves after the value has already changed', async () => {
    // Regression test: the availability-check setTimeout's cleanup was never
    // actually registered as a real effect cleanup (it was returned from
    // inside the outer setTimeout callback, which setTimeout discards), so a
    // still-in-flight check for a stale value could overwrite the UI state
    // for whatever the user has since typed.
    let resolveStaleCheck!: (value: { ok: boolean, json: () => Promise<unknown> }) => void
    const staleCheckPromise = new Promise<{ ok: boolean, json: () => Promise<unknown> }>(resolve => {
      resolveStaleCheck = resolve
    })

    global.fetch = jest.fn((url: string) => {
      if (url.includes('StaleUserA')) return staleCheckPromise
      return Promise.resolve({ ok: true, json: async () => ({ exists: false }) })
    }) as unknown as typeof fetch

    const { changeValue } = renderUsernameInput()
    changeValue('StaleUserA')

    // Wait past the 1000ms validation debounce + 150ms availability delay so the
    // stale check has actually started (not merely been scheduled).
    await new Promise(resolve => setTimeout(resolve, 1300))

    changeValue('FreshUserB')

    expect(await screen.findByLabelText('Elérhető felhasználónév', {}, { timeout: 3000 })).toBeInTheDocument()

    // Now resolve the abandoned StaleUserA check as "taken" - without the fix this
    // would incorrectly flip the UI back to unavailable/error for FreshUserB.
    resolveStaleCheck({ ok: true, json: async () => ({ exists: true }) })
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(screen.getByLabelText('Elérhető felhasználónév')).toBeInTheDocument()
    expect(screen.queryByText('A megadott felhasználónév foglalt!')).not.toBeInTheDocument()
  }, 10000)
})
