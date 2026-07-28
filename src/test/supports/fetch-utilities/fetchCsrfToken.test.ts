import { fetchCsrfToken } from '../../../main/supports/fetch-utilities/fetchCsrfToken'

describe('fetchCsrfToken', () => {
  it('requests /csrf-token with credentials included and returns the token', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({ csrfToken: 'test-token' }) })
    ) as unknown as typeof fetch

    const token = await fetchCsrfToken()

    expect(token).toBe('test-token')
    expect(global.fetch).toHaveBeenCalledWith('/csrf-token', { credentials: 'include' })
  })

  it('throws when the response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: async () => ({}) })
    ) as unknown as typeof fetch

    await expect(fetchCsrfToken()).rejects.toThrow('Hiba történt a biztonsági token lekérése során, próbálja újra!')
  })
})
