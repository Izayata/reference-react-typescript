import { UsernameModel } from '../../../main/model/myUser/UsernameModel'
import {
  USERNAME_VALUE_MAX_LENGTH,
  ERR_MSG_USERNAME_VALUE_REQUIRED,
  ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER,
  ERR_MSG_USERNAME_VALUE_LENGTH
} from '../../../main/utils/myUser/UsernameUtils'
import { expectErrorMessages } from '../../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_USERNAME_MODEL_UNDEFINED = () => new UsernameModel(undefined as any)
const ERR_USERNAME_MODEL_NULL = () => new UsernameModel(null as any)
const ERR_USERNAME_MODEL_EMPTY = () => new UsernameModel('')
const ERR_USERNAME_MODEL_WHITESPACE_ONLY = () => new UsernameModel('   ')
const ERR_USERNAME_MODEL_TOO_LONG = () => new UsernameModel('U'.repeat(USERNAME_VALUE_MAX_LENGTH + 1))
const ERR_USERNAME_MODEL_TOO_SHORT = () => new UsernameModel('te')
const ERR_USERNAME_MODEL_CONTAINS_SPECIAL_CHARACTER = () => new UsernameModel('User@')
const ERR_USERNAME_MODEL_LEADING_SPACES = () => new UsernameModel(' ValidUser123')
const ERR_USERNAME_MODEL_TRAILING_SPACES = () => new UsernameModel('ValidUser123 ')
const ERR_USERNAME_MODEL_LEADING_TRAILING_SPACES = () => new UsernameModel(' ValidUser123 ')
const ERR_USERNAME_MODEL_CONTAINS_SPACE = () => new UsernameModel('User Name')

// Valid cases
const VALID_USERNAME_MODEL = () => new UsernameModel('ValidUser123')
const VALID_USERNAME_MODEL_MIN_LENGTH = () => new UsernameModel('Usr')
const VALID_USERNAME_MODEL_MAX_LENGTH = () => new UsernameModel('U'.repeat(USERNAME_VALUE_MAX_LENGTH))

describe('UsernameModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and forbidden character errors for undefined', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_UNDEFINED,
      [ERR_MSG_USERNAME_VALUE_REQUIRED, ERR_MSG_USERNAME_VALUE_LENGTH, ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER],
      3
    )
  })

  it('should throw required, length, and forbidden character errors for null', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_NULL,
      [ERR_MSG_USERNAME_VALUE_REQUIRED, ERR_MSG_USERNAME_VALUE_LENGTH, ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER],
      3
    )
  })

  it('should throw required, length, and forbidden character errors for empty string', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_EMPTY,
      [ERR_MSG_USERNAME_VALUE_REQUIRED, ERR_MSG_USERNAME_VALUE_LENGTH, ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER],
      3
    )
  })

  it('should throw required and forbidden character errors for whitespace-only string', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_WHITESPACE_ONLY,
      [ERR_MSG_USERNAME_VALUE_REQUIRED, ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_TOO_LONG,
      [ERR_MSG_USERNAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_TOO_SHORT,
      [ERR_MSG_USERNAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw forbidden character error for special character', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_CONTAINS_SPECIAL_CHARACTER,
      [ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER],
      1
    )
  })

  it('should throw forbidden character error for leading spaces', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_LEADING_SPACES,
      [ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER],
      1
    )
  })

  it('should throw forbidden character error for trailing spaces', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_TRAILING_SPACES,
      [ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER],
      1
    )
  })

  it('should throw forbidden character error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER],
      1
    )
  })

  it('should throw contains space error for username with space', () => {
    expectErrorMessages(
      ERR_USERNAME_MODEL_CONTAINS_SPACE,
      [ERR_MSG_USERNAME_VALUE_CONTAINS_FORBIDDEN_CHARACTER],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid username', () => {
    expect(VALID_USERNAME_MODEL).not.toThrow()
  })

  it('should accept valid min length username', () => {
    expect(VALID_USERNAME_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid max length username', () => {
    expect(VALID_USERNAME_MODEL_MAX_LENGTH).not.toThrow()
  })
})
