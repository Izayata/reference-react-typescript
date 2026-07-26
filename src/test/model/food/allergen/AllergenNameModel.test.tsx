import { AllergenNameModel } from '../../../../main/model/food/allergen/AllergenNameModel'
import {
  ALLERGEN_NAME_VALUE_MAX_LENGTH,
  ERR_MSG_ALLERGEN_NAME_VALUE_REQUIRED,
  ERR_MSG_ALLERGEN_NAME_VALUE_LENGTH,
  ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS
} from '../../../../main/utils/food/allergenName/AllergenNameUtils'
import { expectErrorMessages } from '../../../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_ALLERGEN_NAME_MODEL_UNDEFINED = () => new AllergenNameModel(undefined as any)
const ERR_ALLERGEN_NAME_MODEL_NULL = () => new AllergenNameModel(null as any)
const ERR_ALLERGEN_NAME_MODEL_EMPTY = () => new AllergenNameModel('')
const ERR_ALLERGEN_NAME_MODEL_SPACE_ONLY = () => new AllergenNameModel('  ')
const ERR_ALLERGEN_NAME_MODEL_TOO_LONG = () => new AllergenNameModel('A'.repeat(ALLERGEN_NAME_VALUE_MAX_LENGTH + 1))
const ERR_ALLERGEN_NAME_MODEL_TOO_SHORT = () => new AllergenNameModel('A')
const ERR_ALLERGEN_NAME_MODEL_INVALID_DIGIT = () => new AllergenNameModel('Allergen1')
const ERR_ALLERGEN_NAME_MODEL_INVALID_BANNED_SPECIAL_CHARACTER = () => new AllergenNameModel('Allergen!')

// Valid cases
const VALID_ALLERGEN_NAME_MODEL = () => new AllergenNameModel('Allergen')
const VALID_ALLERGEN_NAME_MODEL_MIN_LENGTH = () => new AllergenNameModel('Al')
const VALID_ALLERGEN_NAME_MODEL_MAX_LENGTH = () => new AllergenNameModel('A'.repeat(ALLERGEN_NAME_VALUE_MAX_LENGTH))
const VALID_ALLERGEN_NAME_MODEL_HUN_LETTERS = () => new AllergenNameModel('Banán héja')

describe('AllergenNameModel', () => {
  
  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_ALLERGEN_NAME_MODEL_UNDEFINED,
      [ERR_MSG_ALLERGEN_NAME_VALUE_REQUIRED, ERR_MSG_ALLERGEN_NAME_VALUE_LENGTH, ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_ALLERGEN_NAME_MODEL_NULL,
      [ERR_MSG_ALLERGEN_NAME_VALUE_REQUIRED, ERR_MSG_ALLERGEN_NAME_VALUE_LENGTH, ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS],
      3
    )
  })
  
  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_ALLERGEN_NAME_MODEL_EMPTY,
      [ERR_MSG_ALLERGEN_NAME_VALUE_REQUIRED, ERR_MSG_ALLERGEN_NAME_VALUE_LENGTH, ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_ALLERGEN_NAME_MODEL_SPACE_ONLY,
      [ERR_MSG_ALLERGEN_NAME_VALUE_REQUIRED, ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_ALLERGEN_NAME_MODEL_TOO_LONG,
      [ERR_MSG_ALLERGEN_NAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_ALLERGEN_NAME_MODEL_TOO_SHORT,
      [ERR_MSG_ALLERGEN_NAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for digit in allergen name', () => {
    expectErrorMessages(
      ERR_ALLERGEN_NAME_MODEL_INVALID_DIGIT,
      [ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS],
      1
    )
  })

  it('should throw format error for banned special character in allergen name', () => {
    expectErrorMessages(
      ERR_ALLERGEN_NAME_MODEL_INVALID_BANNED_SPECIAL_CHARACTER,
      [ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid allergen name', () => {
    expect(VALID_ALLERGEN_NAME_MODEL).not.toThrow()
  })

  it('should accept valid allergen name with min length', () => {
    expect(VALID_ALLERGEN_NAME_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid allergen name with max length', () => {
    expect(VALID_ALLERGEN_NAME_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should accept valid allergen name with Hungarian letters and space', () => {
    expect(VALID_ALLERGEN_NAME_MODEL_HUN_LETTERS).not.toThrow()
  })
})
