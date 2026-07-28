import i18n from '../../i18n/i18n'

export const ERR_MSG_CSRF_TOKEN_FETCH_FAILED = i18n.t('errors.ERR_MSG_CSRF_TOKEN_FETCH_FAILED')

/**
 * Fetches the CSRF token from the backend.
 * @returns The CSRF token string if successful, otherwise throws an error.
 */
export async function fetchCsrfToken(): Promise<string> {
  const csrfResponse = await fetch('/csrf-token', {
    credentials: 'include', // Include cookies for session-based authentication
  })

  if (!csrfResponse.ok) {
    throw new Error(ERR_MSG_CSRF_TOKEN_FETCH_FAILED)
  }

  const csrfData = await csrfResponse.json()
  const csrfToken = csrfData.csrfToken // Extract the CSRF token from the response

  return csrfToken
}