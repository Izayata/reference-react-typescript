import { Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../myDecorators/NotBlank'
import { ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER, ERR_MSG_PRICE_AMOUNT_REQUIRED, ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER, ERR_MSG_PRICE_CURRENCY_REQUIRED, PRICE_AMOUNT_ALLOWED_REGEX, PRICE_CURRENCY_ALLOWED_REGEX } from '../../utils/food/PriceUtils'

export class PriceModel {
  @NotBlank({ message: ERR_MSG_PRICE_AMOUNT_REQUIRED })
  @Matches(PRICE_AMOUNT_ALLOWED_REGEX, { message: ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER })
    amount: string

  @NotBlank({ message: ERR_MSG_PRICE_CURRENCY_REQUIRED })
  @Matches(PRICE_CURRENCY_ALLOWED_REGEX, { message: ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER })
    currency: string

  constructor(amount: string, currency: string) {
    this.amount = amount
    this.currency = currency
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
