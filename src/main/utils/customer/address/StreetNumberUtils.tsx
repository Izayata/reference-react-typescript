import { containsWhitespace, isBlank } from '../../CommonUtils'

export const STREET_NUMBER_VALUE_MIN_LENGTH = 1
export const STREET_NUMBER_VALUE_MAX_LENGTH = 8
export const STREET_NUMBER_VALUE_ALLOWED_REGEX = new RegExp('^\\d+[A-Za-z]?(/(\\d+[A-Za-z]?|[A-Za-z]))?$')

export const ERR_MSG_STREET_NUMBER_VALUE_REQUIRED = 'A házszám megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_STREET_NUMBER_VALUE_FORMAT = 'A házszám nem tertalmazhat szóközt, valamint csak a következő formákban elfogadott: "1", "1/a", "1/A", "1/2", "1a" vagy "1A"!'
export const ERR_MSG_STREET_NUMBER_VALUE_LENGTH = 'A házszám legalább ' + STREET_NUMBER_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + STREET_NUMBER_VALUE_MAX_LENGTH + ' karakter!'
export const ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN = 'A házszám nem lehet "0" karakterrel vagy kezdődhet "0/" kifejezéssel!'

export function validateStreetNumber(streetNumber: string) {
  if (isBlank(streetNumber)) {
    throw new Error(ERR_MSG_STREET_NUMBER_VALUE_REQUIRED)
  }
  if (containsWhitespace(streetNumber)) {
    throw new Error(ERR_MSG_STREET_NUMBER_VALUE_FORMAT)
  }
  if (!STREET_NUMBER_VALUE_ALLOWED_REGEX.test(streetNumber)) {
    throw new Error(ERR_MSG_STREET_NUMBER_VALUE_FORMAT)
  }
  if (streetNumber.length < STREET_NUMBER_VALUE_MIN_LENGTH || streetNumber.length > STREET_NUMBER_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_STREET_NUMBER_VALUE_LENGTH)
  }
  if (streetNumber === '0' || streetNumber.startsWith('0/')) {
    throw new Error(ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN)
  }
}
