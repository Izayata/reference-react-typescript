import { hasLeadingOrTrailingWhitespace, isBlank } from '../CommonUtils'

export const FIRSTNAME_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\\-\'.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\\-\'.]+)*$')
export const FIRSTNAME_VALUE_MIN_LENGTH = 2
export const FIRSTNAME_VALUE_MAX_LENGTH = 25

export const ERR_MSG_FIRSTNAME_REQUIRED = 'A keresztnév megadása kötelező!'
export const ERR_MSG_FIRSTNAME_VALUE_REQUIRED = 'A keresztnév megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_FIRSTNAME_VALUE_FORMAT = 'A keresztnév csak betűket, szóközt, kötőjelet, pontot vagy aposztrófot tartalmazhat, de nem kezdődhet vagy végződhet szóközzel!'
export const ERR_MSG_FIRSTNAME_VALUE_LENGTH = 'A keresztnév legalább ' + FIRSTNAME_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + FIRSTNAME_VALUE_MAX_LENGTH + ' karakter!'

export function validateFirstname(firstname: string) {
  if (isBlank(firstname)) {
    throw new Error(ERR_MSG_FIRSTNAME_VALUE_REQUIRED)
  }
  if (hasLeadingOrTrailingWhitespace(firstname)) {
    throw new Error(ERR_MSG_FIRSTNAME_VALUE_FORMAT)
  }
  if (!FIRSTNAME_VALUE_ALLOWED_REGEX.test(firstname)) {
    throw new Error(ERR_MSG_FIRSTNAME_VALUE_FORMAT)
  }
  if (firstname.length < FIRSTNAME_VALUE_MIN_LENGTH || firstname.length > FIRSTNAME_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_FIRSTNAME_VALUE_LENGTH)
  }
}
