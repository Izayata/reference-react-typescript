import { hasLeadingOrTrailingWhitespace, isBlank } from '../CommonUtils'

export const LASTNAME_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\\-\'.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\\-\'.]+)*$')
export const LASTNAME_VALUE_MIN_LENGTH = 2
export const LASTNAME_VALUE_MAX_LENGTH = 25

export const ERR_MSG_LASTNAME_REQUIRED = 'A vezetéknév megadása kötelező!'
export const ERR_MSG_LASTNAME_VALUE_REQUIRED = 'A vezetéknév megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_LASTNAME_VALUE_LEADING_OR_TRAILING_SPACE = 'A vezetéknév nem kezdődhet vagy végződhet szóközzel!'
export const ERR_MSG_LASTNAME_VALUE_LENGTH = 'A vezetéknév legalább ' + LASTNAME_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + LASTNAME_VALUE_MAX_LENGTH + ' karakter!'
export const ERR_MSG_LASTNAME_VALUE_FORMAT = 'A vezetéknév csak betűket, szóközt, kötőjelet, pontot vagy aposztrófot tartalmazhat!'

export function validateLastname(lastname: string) {
  if (isBlank(lastname)) {
    throw new Error(ERR_MSG_LASTNAME_VALUE_REQUIRED)
  }
  if (hasLeadingOrTrailingWhitespace(lastname)) {
    throw new Error(ERR_MSG_LASTNAME_VALUE_LEADING_OR_TRAILING_SPACE)
  }
  if (!LASTNAME_VALUE_ALLOWED_REGEX.test(lastname)) {
    throw new Error(ERR_MSG_LASTNAME_VALUE_FORMAT)
  }
  if (lastname.length < LASTNAME_VALUE_MIN_LENGTH || lastname.length > LASTNAME_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_LASTNAME_VALUE_LENGTH)
  }
}