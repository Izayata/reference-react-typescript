import { containsWhitespace, isBlank } from './CommonUtils'

// export const EMAIL_VALUE_ALLOWED_REGEX = new RegExp('^[a-zA-Z0-9_!#$%&\'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$')
//regex is from https://www.baeldung.com/java-email-validation-regex
export const EMAIL_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-z0-9_\\-]+(\\.[A-Za-z0-9_\\-]+)*@[^\\-][A-Za-z0-9\\-]+(\\.[A-Za-z0-9\\-]+)*(\\.[A-Za-z]{2,})$')
export const EMAIL_VALUE_MAX_LENGTH = 73

export const ERR_MSG_EMAIL_REQUIRED = 'Az email cím megadása kötelező!'
export const ERR_MSG_EMAIL_VALUE_REQUIRED = 'Az email cím megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_EMAIL_VALUE_CONTAINS_SPACE = 'Az email cím nem tartalmazhat szóközt!'
export const ERR_MSG_EMAIL_VALUE_FORMAT = 'Érvénytelen email cím formátum!'
export const ERR_MSG_EMAIL_VALUE_LENGTH = 'Az email cím legfeljebb ' + EMAIL_VALUE_MAX_LENGTH + ' karakter hosszú lehet!'
export const ERR_MSG_EMAIL_VALUE_EXISTS = 'A megadott email cím foglalt!'

export async function checkEmailExists(email: string): Promise<boolean> {
  const res = await fetch(`/v1/req/isEmailExist/${encodeURIComponent(email)}`)
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
