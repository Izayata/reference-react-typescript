import { PriceModel } from './PriceModel'
import {
  PRICE_AMOUNT_ALLOWED_REGEX,
  PRICE_CURRENCY_ALLOWED_REGEX,
  ERR_MSG_PRICE_AMOUNT_REQUIRED,
  ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER,
  ERR_MSG_PRICE_CURRENCY_REQUIRED,
  ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER
} from '../../utils/food/PriceUtils'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_PRICE_MODEL_UNDEFINED = () => new PriceModel(undefined as any, undefined as any)
const ERR_PRICE_MODEL_NULL = () => new PriceModel(null as any, null as any)
const ERR_PRICE_MODEL_EMPTY = () => new PriceModel('', '')
const ERR_PRICE_MODEL_AMOUNT_ONLY = () => new PriceModel('1234', undefined as any)
const ERR_PRICE_MODEL_CURRENCY_ONLY = () => new PriceModel(undefined as any, 'USD')
const ERR_PRICE_MODEL_AMOUNT_BLANK = () => new PriceModel('   ', 'USD')
const ERR_PRICE_MODEL_CURRENCY_BLANK = () => new PriceModel('1234', '   ')
const ERR_PRICE_MODEL_AMOUNT_INVALID_CHAR = () => new PriceModel('12.34.56', 'USD')
const ERR_PRICE_MODEL_AMOUNT_INVALID_LETTER = () => new PriceModel('12a34', 'USD')
const ERR_PRICE_MODEL_CURRENCY_INVALID_CHAR = () => new PriceModel('1234', 'US$')
const ERR_PRICE_MODEL_CURRENCY_INVALID_NUMBER = () => new PriceModel('1234', 'US1')

// Valid cases
const VALID_PRICE_MODEL_INT = () => new PriceModel('1234', 'USD')
const VALID_PRICE_MODEL_FLOAT = () => new PriceModel('1234.56', 'USD')
const VALID_PRICE_MODEL_HUF = () => new PriceModel('999', 'HUF')
const VALID_PRICE_MODEL_HUN_CURRENCY = () => new PriceModel('1234', 'Forint')
const VALID_PRICE_MODEL_HUN_ACCENTED = () => new PriceModel('1234', 'Árvíz')

describe('PriceModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required errors for undefined', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_UNDEFINED,
      [ERR_MSG_PRICE_AMOUNT_REQUIRED, ERR_MSG_PRICE_CURRENCY_REQUIRED, ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER, ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER],
      4
    )
  })

  it('should throw required errors for null', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_NULL,
      [ERR_MSG_PRICE_AMOUNT_REQUIRED, ERR_MSG_PRICE_CURRENCY_REQUIRED, ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER, ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER],
      4
    )
  })

  it('should throw required errors for empty string', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_EMPTY,
      [ERR_MSG_PRICE_AMOUNT_REQUIRED, ERR_MSG_PRICE_CURRENCY_REQUIRED, ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER, ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER],
      4
    )
  })

  it('should throw required error for missing currency', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_AMOUNT_ONLY,
      [ERR_MSG_PRICE_CURRENCY_REQUIRED, ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER],
      2
    )
  })

  it('should throw required error for missing amount', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_CURRENCY_ONLY,
      [ERR_MSG_PRICE_AMOUNT_REQUIRED, ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER],
      2
    )
  })

  it('should throw required error for blank amount', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_AMOUNT_BLANK,
      [ERR_MSG_PRICE_AMOUNT_REQUIRED, ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER],
      2
    )
  })

  it('should throw required error for blank currency', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_CURRENCY_BLANK,
      [ERR_MSG_PRICE_CURRENCY_REQUIRED, ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER],
      2
    )
  })

  it('should throw invalid character error for invalid amount format', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_AMOUNT_INVALID_CHAR,
      [ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER],
      1
    )
  })

  it('should throw invalid character error for letter in amount', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_AMOUNT_INVALID_LETTER,
      [ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER],
      1
    )
  })

  it('should throw invalid character error for invalid currency character', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_CURRENCY_INVALID_CHAR,
      [ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER],
      1
    )
  })

  it('should throw invalid character error for number in currency', () => {
    expectErrorMessages(
      ERR_PRICE_MODEL_CURRENCY_INVALID_NUMBER,
      [ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ###### 
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid integer price', () => {
    expect(VALID_PRICE_MODEL_INT).not.toThrow()
  })

  it('should accept valid float price', () => {
    expect(VALID_PRICE_MODEL_FLOAT).not.toThrow()
  })

  it('should accept valid HUF price', () => {
    expect(VALID_PRICE_MODEL_HUF).not.toThrow()
  })

  it('should accept valid Hungarian currency name', () => {
    expect(VALID_PRICE_MODEL_HUN_CURRENCY).not.toThrow()
  })

  it('should accept valid Hungarian accented currency', () => {
    expect(VALID_PRICE_MODEL_HUN_ACCENTED).not.toThrow()
  })
})
