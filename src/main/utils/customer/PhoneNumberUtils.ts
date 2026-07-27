import { isValidPhoneNumber } from 'libphonenumber-js'
import { containsWhitespace, isBlank } from '../CommonUtils'
import i18n from '../../i18n/i18n'

export const PHONE_NUMBER_VALUE_ALLOWED_REGEX = new RegExp('^\\+?\\d+$')

export const ERR_MSG_PHONE_NUMBER_REQUIRED = i18n.t('errors.ERR_MSG_PHONE_NUMBER_REQUIRED')
export const ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED')
export const ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS = i18n.t('errors.ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS')
export const ERR_MSG_PHONE_NUMBER_VALUE_INVALID = i18n.t('errors.ERR_MSG_PHONE_NUMBER_VALUE_INVALID')

export const countryLocalization = i18n.t('phoneCountryNames', { returnObjects: true }) as Record<string, string>

export function validatePhoneNumber(phoneNumber: string) {
  phoneNumber[0] === '+' && (phoneNumber = phoneNumber.substring(1))
  if (isBlank(phoneNumber)) {
    throw new Error(ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED)
  }
  if (containsWhitespace(phoneNumber)) {
    throw new Error(ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED)
  }
  if(!isValidPhoneNumber('+' + phoneNumber)) {
    throw new Error(ERR_MSG_PHONE_NUMBER_VALUE_INVALID)
  }
}
