import { FoodNameModel } from './FoodNameModel'
import {
  FOOD_NAME_VALUE_MAX_LENGTH,
  FOOD_NAME_VALUE_MIN_LENGTH,
  ERR_MSG_FOOD_NAME_VALUE_REQUIRED,
  ERR_MSG_FOOD_NAME_VALUE_LENGTH,
  ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS
} from '../../utils/food/FoodNameUtils'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_FOOD_NAME_MODEL_UNDEFINED = () => new FoodNameModel(undefined as any)
const ERR_FOOD_NAME_MODEL_NULL = () => new FoodNameModel(null as any)
const ERR_FOOD_NAME_MODEL_EMPTY = () => new FoodNameModel('')
const ERR_FOOD_NAME_MODEL_SPACE_ONLY = () => new FoodNameModel('   ')
const ERR_FOOD_NAME_MODEL_TOO_LONG = () => new FoodNameModel('A'.repeat(FOOD_NAME_VALUE_MAX_LENGTH + 1))
const ERR_FOOD_NAME_MODEL_TOO_SHORT = () => new FoodNameModel('A')
const ERR_FOOD_NAME_MODEL_INVALID_LEADING_SPACE = () => new FoodNameModel(' Invalid')
const ERR_FOOD_NAME_MODEL_INVALID_TRAILING_SPACE = () => new FoodNameModel('Invalid ')
const ERR_FOOD_NAME_MODEL_INVALID_LEADING_SPECIAL_CHARACTER = () => new FoodNameModel('@Invalid')
const ERR_FOOD_NAME_MODEL_INVALID_TRAILING_SPECIAL_CHARACTER = () => new FoodNameModel('Invalid@')
const ERR_FOOD_NAME_MODEL_INVALID_CONTAINS_SPECIAL_CHARACTER = () => new FoodNameModel('Inv@lid')

// Valid cases
const VALID_FOOD_NAME_MODEL = () => new FoodNameModel('Valid Food Name')
const VALID_FOOD_NAME_MODEL_MIN_LENGTH = () => new FoodNameModel('Foo')
const VALID_FOOD_NAME_MODEL_MAX_LENGTH = () => new FoodNameModel('A'.repeat(FOOD_NAME_VALUE_MAX_LENGTH))
const VALID_FOOD_NAME_MODEL_HUN_LETTERS = () => new FoodNameModel('Árvíztűrő tükörfúrógép')

describe('FoodNameModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_UNDEFINED,
      [ERR_MSG_FOOD_NAME_VALUE_REQUIRED, ERR_MSG_FOOD_NAME_VALUE_LENGTH, ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_NULL,
      [ERR_MSG_FOOD_NAME_VALUE_REQUIRED, ERR_MSG_FOOD_NAME_VALUE_LENGTH, ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_EMPTY,
      [ERR_MSG_FOOD_NAME_VALUE_REQUIRED, ERR_MSG_FOOD_NAME_VALUE_LENGTH, ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_SPACE_ONLY,
      [ERR_MSG_FOOD_NAME_VALUE_REQUIRED, ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_TOO_LONG,
      [ERR_MSG_FOOD_NAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_TOO_SHORT,
      [ERR_MSG_FOOD_NAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for leading space', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_INVALID_LEADING_SPACE,
      [ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS],
      1
    )
  })

  it('should throw format error for trailing space', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_INVALID_TRAILING_SPACE,
      [ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS],
      1
    )
  })

  it('should throw format error for leading special character', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_INVALID_LEADING_SPECIAL_CHARACTER,
      [ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS],
      1
    )
  })

  it('should throw format error for trailing special character', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_INVALID_TRAILING_SPECIAL_CHARACTER,
      [ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS],
      1
    )
  })

  it('should throw format error for contains special character', () => {
    expectErrorMessages(
      ERR_FOOD_NAME_MODEL_INVALID_CONTAINS_SPECIAL_CHARACTER,
      [ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ###### 
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid food name', () => {
    expect(VALID_FOOD_NAME_MODEL).not.toThrow()
  })

  it('should accept valid food name with min length', () => {
    expect(VALID_FOOD_NAME_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid food name with max length', () => {
    expect(VALID_FOOD_NAME_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should accept valid food name with Hungarian letters and spaces', () => {
    expect(VALID_FOOD_NAME_MODEL_HUN_LETTERS).not.toThrow()
  })
})
