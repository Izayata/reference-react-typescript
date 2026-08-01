import { DescriptionModel } from './DescriptionModel'
import {
  DESCRIPTION_VALUE_MAX_LENGTH,
  ERR_MSG_DESCRIPTION_VALUE_REQUIRED,
  ERR_MSG_DESCRIPTION_VALUE_LENGTH,
  ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS
} from '../../utils/food/DescriptionUtils'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_DESCRIPTION_MODEL_UNDEFINED = () => new DescriptionModel(undefined as any)
const ERR_DESCRIPTION_MODEL_NULL = () => new DescriptionModel(null as any)
const ERR_DESCRIPTION_MODEL_EMPTY = () => new DescriptionModel('')
const ERR_DESCRIPTION_MODEL_SPACE_ONLY = () => new DescriptionModel('   ')
const ERR_DESCRIPTION_MODEL_TOO_LONG = () => new DescriptionModel('A'.repeat(DESCRIPTION_VALUE_MAX_LENGTH + 1))
const ERR_DESCRIPTION_MODEL_TOO_SHORT = () => new DescriptionModel('A')
const ERR_DESCRIPTION_MODEL_INVALID_LEADING_SPACE = () => new DescriptionModel(' Invalid')
const ERR_DESCRIPTION_MODEL_INVALID_TRAILING_SPACE = () => new DescriptionModel('Invalid ')
const ERR_DESCRIPTION_MODEL_INVALID_LEADING_SPECIAL_CHARACTER = () => new DescriptionModel('@Invalid')
const ERR_DESCRIPTION_MODEL_INVALID_TRAILING_SPECIAL_CHARACTER = () => new DescriptionModel('Invalid@')
const ERR_DESCRIPTION_MODEL_INVALID_CONTAINS_SPECIAL_CHARACTER = () => new DescriptionModel('Inv@lid')

// Valid cases
const VALID_DESCRIPTION_MODEL = () => new DescriptionModel('Valid description')
const VALID_DESCRIPTION_MODEL_MIN_LENGTH = () => new DescriptionModel('Val')
const VALID_DESCRIPTION_MODEL_MAX_LENGTH = () => new DescriptionModel('A'.repeat(DESCRIPTION_VALUE_MAX_LENGTH))
const VALID_DESCRIPTION_MODEL_HUN_LETTERS = () => new DescriptionModel('Árvíztűrő tükörfúrógép')

describe('DescriptionModel', () => {
  
  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_DESCRIPTION_MODEL_UNDEFINED,
      [ERR_MSG_DESCRIPTION_VALUE_REQUIRED, ERR_MSG_DESCRIPTION_VALUE_LENGTH, ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_DESCRIPTION_MODEL_NULL,
      [ERR_MSG_DESCRIPTION_VALUE_REQUIRED, ERR_MSG_DESCRIPTION_VALUE_LENGTH, ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_DESCRIPTION_MODEL_EMPTY,
      [ERR_MSG_DESCRIPTION_VALUE_REQUIRED, ERR_MSG_DESCRIPTION_VALUE_LENGTH, ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_DESCRIPTION_MODEL_SPACE_ONLY,
      [ERR_MSG_DESCRIPTION_VALUE_REQUIRED, ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_DESCRIPTION_MODEL_TOO_LONG,
      [ERR_MSG_DESCRIPTION_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_DESCRIPTION_MODEL_TOO_SHORT,
      [ERR_MSG_DESCRIPTION_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for leading space', () => {
    expectErrorMessages(
      ERR_DESCRIPTION_MODEL_INVALID_LEADING_SPACE,
      [ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS],
      1
    )
  })

  it('should throw format error for trailing space', () => {
    expectErrorMessages(
      ERR_DESCRIPTION_MODEL_INVALID_TRAILING_SPACE,
      [ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ###### 
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept leading special character', () => {
    expect(ERR_DESCRIPTION_MODEL_INVALID_LEADING_SPECIAL_CHARACTER).not.toThrow()
  })

  it('should accept trailing special character', () => {
    expect(ERR_DESCRIPTION_MODEL_INVALID_TRAILING_SPECIAL_CHARACTER).not.toThrow()
  })

  it('should accept containing special character', () => {
    expect(ERR_DESCRIPTION_MODEL_INVALID_CONTAINS_SPECIAL_CHARACTER).not.toThrow()
  })

  it('should accept valid description', () => {
    expect(VALID_DESCRIPTION_MODEL).not.toThrow()
  })

  it('should accept valid description with min length', () => {
    expect(VALID_DESCRIPTION_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid description with max length', () => {
    expect(VALID_DESCRIPTION_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should accept valid description with Hungarian letters and spaces', () => {
    expect(VALID_DESCRIPTION_MODEL_HUN_LETTERS).not.toThrow()
  })
})
