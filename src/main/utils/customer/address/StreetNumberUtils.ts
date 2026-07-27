import { containsWhitespace, isBlank } from '../../CommonUtils'
import i18n from '../../../i18n/i18n'

export const STREET_NUMBER_VALUE_MIN_LENGTH = 1
export const STREET_NUMBER_VALUE_MAX_LENGTH = 8
export const STREET_NUMBER_VALUE_ALLOWED_REGEX = new RegExp('^\\d+[A-Za-z]?(/(\\d+[A-Za-z]?|[A-Za-z]))?$')

export const ERR_MSG_STREET_NUMBER_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_STREET_NUMBER_VALUE_REQUIRED')
export const ERR_MSG_STREET_NUMBER_VALUE_FORMAT = i18n.t('errors.ERR_MSG_STREET_NUMBER_VALUE_FORMAT')
export const ERR_MSG_STREET_NUMBER_VALUE_LENGTH = i18n.t('errors.ERR_MSG_STREET_NUMBER_VALUE_LENGTH', { STREET_NUMBER_VALUE_MIN_LENGTH, STREET_NUMBER_VALUE_MAX_LENGTH })
export const ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN = i18n.t('errors.ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN')

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
