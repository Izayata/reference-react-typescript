import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../myDecorators/NotBlank'
import { EMAIL_VALUE_ALLOWED_REGEX, EMAIL_VALUE_MAX_LENGTH, ERR_MSG_EMAIL_VALUE_FORMAT, ERR_MSG_EMAIL_VALUE_LENGTH, ERR_MSG_EMAIL_VALUE_REQUIRED } from '../utils/EmailUtils'

export class EmailModel {
  @NotBlank({ message: ERR_MSG_EMAIL_VALUE_REQUIRED })
  @Matches(EMAIL_VALUE_ALLOWED_REGEX, { message: ERR_MSG_EMAIL_VALUE_FORMAT })
  @Length(1, EMAIL_VALUE_MAX_LENGTH, { message: ERR_MSG_EMAIL_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value != null && typeof value === 'string' ? value.toLowerCase() : value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}