import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AddressInput } from './AddressInput'

const EMPTY_FORM = { zip: '', city: '', street: '', streetNumber: '', floorDoor: '' }

function renderAddressInput() {
  let formData = EMPTY_FORM
  const onChange = jest.fn((e: React.ChangeEvent<HTMLInputElement>) => {
    formData = { ...formData, [e.target.name]: e.target.value }
    rerender()
  })

  function rerender() {
    result.rerender(
      <MemoryRouter>
        <AddressInput formData={formData} onChange={onChange} />
      </MemoryRouter>
    )
  }

  const result = render(
    <MemoryRouter>
      <AddressInput formData={formData} onChange={onChange} />
    </MemoryRouter>
  )

  return {
    changeZip: (value: string) => {
      fireEvent.change(screen.getByLabelText(/Irányítószám/), { target: { value, name: 'zip' } })
    },
    onChange,
  }
}

function mockFetch(response: { ok: boolean, status?: number, json?: () => Promise<unknown> }) {
  global.fetch = jest.fn(() => Promise.resolve(response)) as unknown as typeof fetch
}

describe('AddressInput', () => {
  it('auto-fills the city after a valid zip code resolves to one', async () => {
    mockFetch({ ok: true, json: async () => ({ zipCode: '1011', city: 'Budapest' }) })
    const { changeZip, onChange } = renderAddressInput()

    changeZip('1011')

    await screen.findByDisplayValue('Budapest', {}, { timeout: 3000 })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: { name: 'city', value: 'Budapest' } }))
  })

  it('leaves the city untouched when the zip code has no match (404)', async () => {
    mockFetch({ ok: false, status: 404 })
    const { changeZip } = renderAddressInput()

    changeZip('9999')

    await new Promise(resolve => setTimeout(resolve, 700))
    expect(screen.getByLabelText(/Város/)).toHaveValue('')
  })

  it('does not call the lookup endpoint for an incomplete zip code', async () => {
    mockFetch({ ok: true, json: async () => ({ zipCode: '1011', city: 'Budapest' }) })
    const { changeZip } = renderAddressInput()

    changeZip('10')

    await new Promise(resolve => setTimeout(resolve, 700))
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
