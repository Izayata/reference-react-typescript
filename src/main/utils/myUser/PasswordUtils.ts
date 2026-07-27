import { containsWhitespace, isBlank } from '../CommonUtils'
import i18n from '../../i18n/i18n'

export const PASSWORD_VALUE_ALLOWED_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]+$/
export const PASSWORD_VALUE_MIN_LENGTH = 8
export const PASSWORD_VALUE_MAX_LENGTH = 24

export const ERR_MSG_PASSWORD_REQUIRED = i18n.t('errors.ERR_MSG_PASSWORD_REQUIRED')
export const ERR_MSG_CONFIRM_PASSWORD_REQUIRED = i18n.t('errors.ERR_MSG_CONFIRM_PASSWORD_REQUIRED')
export const ERR_MSG_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_PASSWORD_VALUE = i18n.t('errors.ERR_MSG_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_PASSWORD_VALUE')
export const ERR_MSG_PASSWORD_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_PASSWORD_VALUE_REQUIRED')
export const ERR_MSG_PASSWORD_VALUE_FORMAT = i18n.t('errors.ERR_MSG_PASSWORD_VALUE_FORMAT')
export const ERR_MSG_PASSWORD_VALUE_LENGTH = i18n.t('errors.ERR_MSG_PASSWORD_VALUE_LENGTH', { PASSWORD_VALUE_MIN_LENGTH, PASSWORD_VALUE_MAX_LENGTH })
export const ERR_MSG_PASSWORD_VALUE_COMMON = i18n.t('errors.ERR_MSG_PASSWORD_VALUE_COMMON')

export async function checkPasswordIsCommon(password: string): Promise<boolean> {
  const res = await fetch('/v1/registration/common-password',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password }),
    }
  )
  if (!res.ok) return false
  const data = await res.json()
  return data.isCommonPassword
}

export function validatePassword(password: string) {
  if (isBlank(password)) {
    throw new Error(ERR_MSG_PASSWORD_VALUE_REQUIRED)
  }
  if (containsWhitespace(password)) {
    throw new Error(ERR_MSG_PASSWORD_VALUE_FORMAT)
  }
  if (!PASSWORD_VALUE_ALLOWED_REGEX.test(password)) {
    throw new Error(ERR_MSG_PASSWORD_VALUE_FORMAT)
  }
  if (password.length < PASSWORD_VALUE_MIN_LENGTH || password.length > PASSWORD_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_PASSWORD_VALUE_LENGTH)
  }
}  
