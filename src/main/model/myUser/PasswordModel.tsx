import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../myDecorators/NotBlank'
import { ERR_MSG_PASSWORD_VALUE_FORMAT, ERR_MSG_PASSWORD_VALUE_LENGTH, ERR_MSG_PASSWORD_VALUE_REQUIRED, PASSWORD_VALUE_ALLOWED_REGEX, PASSWORD_VALUE_MAX_LENGTH, PASSWORD_VALUE_MIN_LENGTH } from '../../utils/myUser/PasswordUtils'

export class PasswordModel {
  @NotBlank({ message: ERR_MSG_PASSWORD_VALUE_REQUIRED })
  @Matches(PASSWORD_VALUE_ALLOWED_REGEX, { message: ERR_MSG_PASSWORD_VALUE_FORMAT })
  @Length(PASSWORD_VALUE_MIN_LENGTH, PASSWORD_VALUE_MAX_LENGTH, { message: ERR_MSG_PASSWORD_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
