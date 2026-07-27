import i18n from '../../../i18n/i18n'

export async function fetchAuthenticatedUserDetails() {
  const res = await fetch('/v1/account/me', {
    credentials: 'include'
  })
  if (!res.ok) throw new Error(i18n.t('errors.ERR_MSG_ACCOUNT_FETCH_FAILED'))
  return res.json()
}
