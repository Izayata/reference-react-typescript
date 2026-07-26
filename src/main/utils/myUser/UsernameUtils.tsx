import { isBlank, containsWhitespace } from '../CommonUtils'

export const USERNAME_VALUE_ALLOWED_REGEX = new RegExp('^[a-zA-Z0-9]+$')
export const USERNAME_VALUE_MIN_LENGTH = 3
export const USERNAME_VALUE_MAX_LENGTH = 25

export const ERR_MSG_USERNAME_REQUIRED = 'A felhasználónév megadása kötelező!'
export const ERR_MSG_USERNAME_VALUE_REQUIRED = 'A felhasználónév megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_USERNAME_VALUE_CONTAINS_SPACE = 'A felhasználónév nem tartalmazhat szóközt!'
export const ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER = 'A felhasználónév csak betűket és számokat tartalmazhat!'
export const ERR_MSG_USERNAME_VALUE_LENGTH = 'A felhasználónév legalább ' + USERNAME_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + USERNAME_VALUE_MAX_LENGTH + ' karakter!'
export const ERR_MSG_USERNAME_VALUE_EXISTS = 'A megadott felhasználónév foglalt!'

export async function checkUsernameExists(username: string): Promise<boolean> {
  const res = await fetch(`/v1/req/isUsernameExist/${encodeURIComponent(username)}`)
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
