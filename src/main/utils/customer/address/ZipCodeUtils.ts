import { containsWhitespace, isBlank } from '../../CommonUtils'
import i18n from '../../../i18n/i18n'

export const ZIP_CODE_VALUE_LENGTH = 4
export const ZIP_CODE_VALUE_ALLOWED_REGEX = new RegExp(`^\\d{${ZIP_CODE_VALUE_LENGTH}}$`)

export const ERR_MSG_ZIP_CODE_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_ZIP_CODE_VALUE_REQUIRED')
export const ERR_MSG_ZIP_CODE_VALUE_FORMAT = i18n.t('errors.ERR_MSG_ZIP_CODE_VALUE_FORMAT', { ZIP_CODE_VALUE_LENGTH })
export const ERR_MSG_ZIP_CODE_VALUE_LENGTH = i18n.t('errors.ERR_MSG_ZIP_CODE_VALUE_LENGTH', { ZIP_CODE_VALUE_LENGTH })

export function validateZipCode(zipCode: string) {
  if (isBlank(zipCode)) {
    throw new Error(ERR_MSG_ZIP_CODE_VALUE_REQUIRED)
  }
  if (containsWhitespace(zipCode)) {
    throw new Error(ERR_MSG_ZIP_CODE_VALUE_FORMAT)
  }
  if (!ZIP_CODE_VALUE_ALLOWED_REGEX.test(zipCode)) {
    throw new Error(ERR_MSG_ZIP_CODE_VALUE_FORMAT)
  }
  if (zipCode.length !== ZIP_CODE_VALUE_LENGTH) {
    throw new Error(ERR_MSG_ZIP_CODE_VALUE_LENGTH)
  }
}
