import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../../myDecorators/NotBlank'
import { ZIP_CODE_VALUE_ALLOWED_REGEX, ERR_MSG_ZIP_CODE_VALUE_REQUIRED, ERR_MSG_ZIP_CODE_VALUE_FORMAT, ERR_MSG_ZIP_CODE_VALUE_LENGTH, ZIP_CODE_VALUE_LENGTH } from '../../../utils/customer/address/ZipCodeUtils'

export class ZipCodeModel {
  @NotBlank({ message: ERR_MSG_ZIP_CODE_VALUE_REQUIRED })
  @Matches(ZIP_CODE_VALUE_ALLOWED_REGEX, { message: ERR_MSG_ZIP_CODE_VALUE_FORMAT })
  @Length(ZIP_CODE_VALUE_LENGTH, ZIP_CODE_VALUE_LENGTH, { message: ERR_MSG_ZIP_CODE_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: ZipCodeModel): boolean {
    if (!other) return false
    return this.value === other.value
  }
}
