import { hasLeadingOrTrailingWhitespace, isBlank } from '../../CommonUtils'

export const STREET_VALUE_MIN_LENGTH = 2
export const STREET_VALUE_MAX_LENGTH = 50
export const STREET_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+)*$')

export const ERR_MSG_STREET_VALUE_REQUIRED = 'Az utcanév megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_STREET_VALUE_FORMAT = 'Az utca csak betűket, számokat, szóközt, kötőjelet, pontot vagy aposztrófot tartalmazhat, valamint nem kezdődhet vagy végződhet szóközzel!'
export const ERR_MSG_STREET_VALUE_LENGTH = 'Az utca legalább ' + STREET_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + STREET_VALUE_MAX_LENGTH + ' karakter!'

export function validateStreet(street: string) {
  if (isBlank(street)) {
    throw new Error(ERR_MSG_STREET_VALUE_REQUIRED)
  }
  if (hasLeadingOrTrailingWhitespace(street)) {
    throw new Error(ERR_MSG_STREET_VALUE_FORMAT)
  }
  if (!STREET_VALUE_ALLOWED_REGEX.test(street)) {
    throw new Error(ERR_MSG_STREET_VALUE_FORMAT)
  }
  if (street.length < STREET_VALUE_MIN_LENGTH || street.length > STREET_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_STREET_VALUE_LENGTH)
  }
}
