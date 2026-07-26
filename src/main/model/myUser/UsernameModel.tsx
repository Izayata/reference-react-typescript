import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../myDecorators/NotBlank'
import { ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER, ERR_MSG_USERNAME_VALUE_LENGTH, ERR_MSG_USERNAME_VALUE_REQUIRED, USERNAME_VALUE_ALLOWED_REGEX, USERNAME_VALUE_MAX_LENGTH, USERNAME_VALUE_MIN_LENGTH } from '../../utils/myUser/UsernameUtils'

export class UsernameModel {
  @NotBlank({ message: ERR_MSG_USERNAME_VALUE_REQUIRED })
  @Matches(USERNAME_VALUE_ALLOWED_REGEX, { message: ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER })
  @Length(USERNAME_VALUE_MIN_LENGTH, USERNAME_VALUE_MAX_LENGTH, { message: ERR_MSG_USERNAME_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
