import { hasLeadingOrTrailingWhitespace, isBlank } from '../CommonUtils'
import i18n from '../../i18n/i18n'

export const FIRSTNAME_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\\-\'.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\\-\'.]+)*$')
export const FIRSTNAME_VALUE_MIN_LENGTH = 2
export const FIRSTNAME_VALUE_MAX_LENGTH = 25

export const ERR_MSG_FIRSTNAME_REQUIRED = i18n.t('errors.ERR_MSG_FIRSTNAME_REQUIRED')
export const ERR_MSG_FIRSTNAME_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_FIRSTNAME_VALUE_REQUIRED')
export const ERR_MSG_FIRSTNAME_VALUE_FORMAT = i18n.t('errors.ERR_MSG_FIRSTNAME_VALUE_FORMAT')
export const ERR_MSG_FIRSTNAME_VALUE_LENGTH = i18n.t('errors.ERR_MSG_FIRSTNAME_VALUE_LENGTH', { FIRSTNAME_VALUE_MIN_LENGTH, FIRSTNAME_VALUE_MAX_LENGTH })

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
