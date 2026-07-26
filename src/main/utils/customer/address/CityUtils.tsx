import { hasLeadingOrTrailingWhitespace, isBlank } from '../../CommonUtils'

export const CITY_VALUE_MIN_LENGTH = 2
export const CITY_VALUE_MAX_LENGTH = 25
export const CITY_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+)*$')

export const ERR_MSG_CITY_VALUE_REQUIRED = 'A városnév megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_CITY_VALUE_LEADING_OR_TRAILING_SPACE = 'A város nem kezdődhet vagy végződhet szóközzel!'
export const ERR_MSG_CITY_VALUE_FORMAT = 'A város csak betűket, szóközt, kötőjelet, pontot vagy aposztrófot tartalmazhat!'
export const ERR_MSG_CITY_VALUE_LENGTH = 'A város legalább ' + CITY_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + CITY_VALUE_MAX_LENGTH + ' karakter!'

export function validateCity(city: string) {
  if (isBlank(city)) {
    throw new Error(ERR_MSG_CITY_VALUE_REQUIRED)
  }
  if (hasLeadingOrTrailingWhitespace(city)) {
    throw new Error(ERR_MSG_CITY_VALUE_LEADING_OR_TRAILING_SPACE)
  }
  if (!CITY_VALUE_ALLOWED_REGEX.test(city)) {
    throw new Error(ERR_MSG_CITY_VALUE_FORMAT)
  }
  if (city.length < CITY_VALUE_MIN_LENGTH || city.length > CITY_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_CITY_VALUE_LENGTH)
  }
}
