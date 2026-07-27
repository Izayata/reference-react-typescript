import { hasLeadingOrTrailingWhitespace, isBlank } from '../CommonUtils'
import i18n from '../../i18n/i18n'

export const LASTNAME_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\\-\'.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\\-\'.]+)*$')
export const LASTNAME_VALUE_MIN_LENGTH = 2
export const LASTNAME_VALUE_MAX_LENGTH = 25

export const ERR_MSG_LASTNAME_REQUIRED = i18n.t('errors.ERR_MSG_LASTNAME_REQUIRED')
export const ERR_MSG_LASTNAME_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_LASTNAME_VALUE_REQUIRED')
export const ERR_MSG_LASTNAME_VALUE_LEADING_OR_TRAILING_SPACE = i18n.t('errors.ERR_MSG_LASTNAME_VALUE_LEADING_OR_TRAILING_SPACE')
export const ERR_MSG_LASTNAME_VALUE_LENGTH = i18n.t('errors.ERR_MSG_LASTNAME_VALUE_LENGTH', { LASTNAME_VALUE_MIN_LENGTH, LASTNAME_VALUE_MAX_LENGTH })
export const ERR_MSG_LASTNAME_VALUE_FORMAT = i18n.t('errors.ERR_MSG_LASTNAME_VALUE_FORMAT')

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