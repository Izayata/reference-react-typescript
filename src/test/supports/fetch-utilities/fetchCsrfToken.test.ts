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

  it('throws instead of returning undefined when a 200 response has no csrfToken field', async () => {
    // Regression test: an ok response whose body doesn't actually contain a
    // csrfToken used to be returned as-is (undefined), which every caller
    // then sent as a literal 'X-CSRF-TOKEN: undefined' header instead of
    // surfacing a real error.
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({}) })
    ) as unknown as typeof fetch

    await expect(fetchCsrfToken()).rejects.toThrow('Hiba történt a biztonsági token lekérése során, próbálja újra!')
  })
})
