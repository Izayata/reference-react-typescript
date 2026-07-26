import { IngredientNameModel } from '../../../../main/model/food/ingredient/IngredientNameModel'
import {
  INGREDIENT_NAME_VALUE_MAX_LENGTH,
  ERR_MSG_INGREDIENT_NAME_VALUE_REQUIRED,
  ERR_MSG_INGREDIENT_NAME_VALUE_LENGTH,
  ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS
} from '../../../../main/utils/food/ingredientName/IngredientNameUtils'
import { expectErrorMessages } from '../../../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_INGREDIENT_NAME_MODEL_UNDEFINED = () => new IngredientNameModel(undefined as any)
const ERR_INGREDIENT_NAME_MODEL_NULL = () => new IngredientNameModel(null as any)
const ERR_INGREDIENT_NAME_MODEL_EMPTY = () => new IngredientNameModel('')
const ERR_INGREDIENT_NAME_MODEL_SPACE_ONLY = () => new IngredientNameModel('  ')
const ERR_INGREDIENT_NAME_MODEL_TOO_LONG = () => new IngredientNameModel('A'.repeat(INGREDIENT_NAME_VALUE_MAX_LENGTH + 1))
const ERR_INGREDIENT_NAME_MODEL_TOO_SHORT = () => new IngredientNameModel('A')
const ERR_INGREDIENT_NAME_MODEL_INVALID_DIGIT = () => new IngredientNameModel('Ingredient1')
const ERR_INGREDIENT_NAME_MODEL_INVALID_BANNED_SPECIAL_CHARACTER = () => new IngredientNameModel('Ingredient!')

// Valid cases
const VALID_INGREDIENT_NAME_MODEL = () => new IngredientNameModel('Ingredient')
const VALID_INGREDIENT_NAME_MODEL_MIN_LENGTH = () => new IngredientNameModel('In')
const VALID_INGREDIENT_NAME_MODEL_MAX_LENGTH = () => new IngredientNameModel('A'.repeat(INGREDIENT_NAME_VALUE_MAX_LENGTH))
const VALID_INGREDIENT_NAME_MODEL_HUN_LETTERS = () => new IngredientNameModel('Banán héja')

describe('IngredientNameModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_INGREDIENT_NAME_MODEL_UNDEFINED,
      [ERR_MSG_INGREDIENT_NAME_VALUE_REQUIRED, ERR_MSG_INGREDIENT_NAME_VALUE_LENGTH, ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_INGREDIENT_NAME_MODEL_NULL,
      [ERR_MSG_INGREDIENT_NAME_VALUE_REQUIRED, ERR_MSG_INGREDIENT_NAME_VALUE_LENGTH, ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_INGREDIENT_NAME_MODEL_EMPTY,
      [ERR_MSG_INGREDIENT_NAME_VALUE_REQUIRED, ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_INGREDIENT_NAME_MODEL_SPACE_ONLY,
      [ERR_MSG_INGREDIENT_NAME_VALUE_REQUIRED, ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_INGREDIENT_NAME_MODEL_TOO_LONG,
      [ERR_MSG_INGREDIENT_NAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_INGREDIENT_NAME_MODEL_TOO_SHORT,
      [ERR_MSG_INGREDIENT_NAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for digit in ingredient name', () => {
    expectErrorMessages(
      ERR_INGREDIENT_NAME_MODEL_INVALID_DIGIT,
      [ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS],
      1
    )
  })

  it('should throw format error for banned special character in ingredient name', () => {
    expectErrorMessages(
      ERR_INGREDIENT_NAME_MODEL_INVALID_BANNED_SPECIAL_CHARACTER,
      [ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS],
      1
    )
  })

  
  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid ingredient name', () => {
    expect(VALID_INGREDIENT_NAME_MODEL).not.toThrow()
  })

  it('should accept valid ingredient name with min length', () => {
    expect(VALID_INGREDIENT_NAME_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid ingredient name with max length', () => {
    expect(VALID_INGREDIENT_NAME_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should accept valid ingredient name with Hungarian letters and space', () => {
    expect(VALID_INGREDIENT_NAME_MODEL_HUN_LETTERS).not.toThrow()
  })
})
