/**
 * Fetches the CSRF token from the backend.
 * @returns The CSRF token string if successful, otherwise throws an error.
 */
export async function fetchCsrfToken(): Promise<string> {
  const csrfResponse = await fetch('/csrf-token', {
    credentials: 'include', // Include cookies for session-based authentication
  })

  if (!csrfResponse.ok) {
    console.error('Failed to fetch CSRF token')
    throw new Error('Failed to fetch CSRF token')
  }

  const csrfData = await csrfResponse.json()
  // console.log('csrfData:', csrfData)
  const csrfToken = csrfData.csrfToken // Extract the CSRF token from the response
  // console.log('csrfToken:', csrfToken)

  return csrfToken
}