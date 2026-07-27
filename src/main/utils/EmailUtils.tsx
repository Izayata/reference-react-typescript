import { containsWhitespace, isBlank } from './CommonUtils'
import i18n from '../i18n/i18n'

// export const EMAIL_VALUE_ALLOWED_REGEX = new RegExp('^[a-zA-Z0-9_!#$%&\'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$')
//regex is from https://www.baeldung.com/java-email-validation-regex
export const EMAIL_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-z0-9_\\-]+(\\.[A-Za-z0-9_\\-]+)*@[^\\-][A-Za-z0-9\\-]+(\\.[A-Za-z0-9\\-]+)*(\\.[A-Za-z]{2,})$')
export const EMAIL_VALUE_MAX_LENGTH = 73

export const ERR_MSG_EMAIL_REQUIRED = i18n.t('errors.ERR_MSG_EMAIL_REQUIRED')
export const ERR_MSG_EMAIL_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_EMAIL_VALUE_REQUIRED')
export const ERR_MSG_EMAIL_VALUE_CONTAINS_SPACE = i18n.t('errors.ERR_MSG_EMAIL_VALUE_CONTAINS_SPACE')
export const ERR_MSG_EMAIL_VALUE_FORMAT = i18n.t('errors.ERR_MSG_EMAIL_VALUE_FORMAT')
export const ERR_MSG_EMAIL_VALUE_LENGTH = i18n.t('errors.ERR_MSG_EMAIL_VALUE_LENGTH', { EMAIL_VALUE_MAX_LENGTH })
export const ERR_MSG_EMAIL_VALUE_EXISTS = i18n.t('errors.ERR_MSG_EMAIL_VALUE_EXISTS')

export async function checkEmailExists(email: string): Promise<boolean> {
  const res = await fetch(`/v1/registration/email/${encodeURIComponent(email)}/exists`)
  if (!res.ok) return false
  const data = await res.json()
  return data.exists
}

export function validateEmail(email:string) {
  if (isBlank(email)) {
    throw new Error(ERR_MSG_EMAIL_VALUE_REQUIRED)
  }
  if (containsWhitespace(email)) {
    throw new Error(ERR_MSG_EMAIL_VALUE_CONTAINS_SPACE)
  }
  if (email.length > EMAIL_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_EMAIL_VALUE_LENGTH)
  }
  if (!EMAIL_VALUE_ALLOWED_REGEX.test(email)) {
    throw new Error(ERR_MSG_EMAIL_VALUE_FORMAT)
  }
}
