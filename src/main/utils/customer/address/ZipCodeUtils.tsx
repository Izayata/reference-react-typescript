import { containsWhitespace, isBlank } from '../../CommonUtils'

export const ZIP_CODE_VALUE_LENGTH = 4
export const ZIP_CODE_VALUE_ALLOWED_REGEX = new RegExp(`^\\d{${ZIP_CODE_VALUE_LENGTH}}$`)

export const ERR_MSG_ZIP_CODE_VALUE_REQUIRED = 'A irányítószám megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_ZIP_CODE_VALUE_FORMAT = `Az irányítószám csak ${ZIP_CODE_VALUE_LENGTH} számjegyből állhat!`
export const ERR_MSG_ZIP_CODE_VALUE_LENGTH = `Az irányítószám pontosan ${ZIP_CODE_VALUE_LENGTH} számjegy hosszú kell legyen!`

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
