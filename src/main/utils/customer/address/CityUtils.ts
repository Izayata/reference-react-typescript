import { hasLeadingOrTrailingWhitespace, isBlank } from '../../CommonUtils'
import i18n from '../../../i18n/i18n'

export const CITY_VALUE_MIN_LENGTH = 2
export const CITY_VALUE_MAX_LENGTH = 25
export const CITY_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+)*$')

export const ERR_MSG_CITY_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_CITY_VALUE_REQUIRED')
export const ERR_MSG_CITY_VALUE_LEADING_OR_TRAILING_SPACE = i18n.t('errors.ERR_MSG_CITY_VALUE_LEADING_OR_TRAILING_SPACE')
export const ERR_MSG_CITY_VALUE_FORMAT = i18n.t('errors.ERR_MSG_CITY_VALUE_FORMAT')
export const ERR_MSG_CITY_VALUE_LENGTH = i18n.t('errors.ERR_MSG_CITY_VALUE_LENGTH', { CITY_VALUE_MIN_LENGTH, CITY_VALUE_MAX_LENGTH })

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
