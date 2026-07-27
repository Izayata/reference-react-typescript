import { hasLeadingOrTrailingWhitespace, isBlank } from '../../CommonUtils'
import i18n from '../../../i18n/i18n'

export const STREET_VALUE_MIN_LENGTH = 2
export const STREET_VALUE_MAX_LENGTH = 50
export const STREET_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+)*$')

export const ERR_MSG_STREET_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_STREET_VALUE_REQUIRED')
export const ERR_MSG_STREET_VALUE_FORMAT = i18n.t('errors.ERR_MSG_STREET_VALUE_FORMAT')
export const ERR_MSG_STREET_VALUE_LENGTH = i18n.t('errors.ERR_MSG_STREET_VALUE_LENGTH', { STREET_VALUE_MIN_LENGTH, STREET_VALUE_MAX_LENGTH })

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
