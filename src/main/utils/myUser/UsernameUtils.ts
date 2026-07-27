import { isBlank, containsWhitespace } from '../CommonUtils'
import i18n from '../../i18n/i18n'

export const USERNAME_VALUE_ALLOWED_REGEX = new RegExp('^[a-zA-Z0-9]+$')
export const USERNAME_VALUE_MIN_LENGTH = 3
export const USERNAME_VALUE_MAX_LENGTH = 25

export const ERR_MSG_USERNAME_REQUIRED = i18n.t('errors.ERR_MSG_USERNAME_REQUIRED')
export const ERR_MSG_USERNAME_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_USERNAME_VALUE_REQUIRED')
export const ERR_MSG_USERNAME_VALUE_CONTAINS_SPACE = i18n.t('errors.ERR_MSG_USERNAME_VALUE_CONTAINS_SPACE')
export const ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER = i18n.t('errors.ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER')
export const ERR_MSG_USERNAME_VALUE_LENGTH = i18n.t('errors.ERR_MSG_USERNAME_VALUE_LENGTH', { USERNAME_VALUE_MIN_LENGTH, USERNAME_VALUE_MAX_LENGTH })
export const ERR_MSG_USERNAME_VALUE_EXISTS = i18n.t('errors.ERR_MSG_USERNAME_VALUE_EXISTS')

export async function checkUsernameExists(username: string): Promise<boolean> {
  const res = await fetch(`/v1/registration/username/${encodeURIComponent(username)}/exists`)
  if (!res.ok) return false
  const data = await res.json()
  return data.exists
}

export function validateUsername(username: string) {
  if (isBlank(username)) {
    throw new Error(ERR_MSG_USERNAME_VALUE_REQUIRED)
  }
  if (containsWhitespace(username)) {
    throw new Error(ERR_MSG_USERNAME_VALUE_CONTAINS_SPACE)
  }
  if (!USERNAME_VALUE_ALLOWED_REGEX.test(username)) {
    throw new Error(ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER)
  }
  if (username.length < USERNAME_VALUE_MIN_LENGTH || username.length > USERNAME_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_USERNAME_VALUE_LENGTH)
  }
}
