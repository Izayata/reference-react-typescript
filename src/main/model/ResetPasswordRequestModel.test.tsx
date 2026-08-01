import { ResetPasswordRequestModel } from './ResetPasswordRequestModel'
import { NewPasswordDetailsModelBuilder } from '../builder/NewPasswordDetailsModelBuilder'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import i18n from '../i18n/i18n'

const ERR_MSG_RESET_TOKEN_REQUIRED = i18n.t('errors.ERR_MSG_RESET_TOKEN_REQUIRED')
const ERR_MSG_RESET_NEW_PASSWORD_DETAILS_REQUIRED = i18n.t('errors.ERR_MSG_RESET_NEW_PASSWORD_DETAILS_REQUIRED')

// Valid values for composing ResetPasswordRequestModel
const VALID_TOKEN = 'a-valid-reset-token'
const VALID_NEW_PASSWORD_DETAILS = new NewPasswordDetailsModelBuilder()
  .setNewPassword('NewPassword456!')
  .setConfirmNewPassword('NewPassword456!')
  .build()

// Invalid cases
const ERR_RESET_PASSWORD_REQUEST_MODEL_TOKEN_UNDEFINED = () =>
  new ResetPasswordRequestModel(undefined as any, VALID_NEW_PASSWORD_DETAILS)

const ERR_RESET_PASSWORD_REQUEST_MODEL_TOKEN_NULL = () =>
  new ResetPasswordRequestModel(null as any, VALID_NEW_PASSWORD_DETAILS)

const ERR_RESET_PASSWORD_REQUEST_MODEL_TOKEN_EMPTY_STRING = () =>
  new ResetPasswordRequestModel('', VALID_NEW_PASSWORD_DETAILS)

const ERR_RESET_PASSWORD_REQUEST_MODEL_TOKEN_BLANK = () =>
  new ResetPasswordRequestModel('   ', VALID_NEW_PASSWORD_DETAILS)

const ERR_RESET_PASSWORD_REQUEST_MODEL_NEW_PASSWORD_DETAILS_UNDEFINED = () =>
  new ResetPasswordRequestModel(VALID_TOKEN, undefined as any)

const ERR_RESET_PASSWORD_REQUEST_MODEL_NEW_PASSWORD_DETAILS_NULL = () =>
  new ResetPasswordRequestModel(VALID_TOKEN, null as any)

// Valid case
const VALID_RESET_PASSWORD_REQUEST_MODEL = () =>
  new ResetPasswordRequestModel(VALID_TOKEN, VALID_NEW_PASSWORD_DETAILS)

describe('ResetPasswordRequestModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined token', () => {
    expectErrorMessages(
      ERR_RESET_PASSWORD_REQUEST_MODEL_TOKEN_UNDEFINED,
      [ERR_MSG_RESET_TOKEN_REQUIRED],
      1
    )
  })

  it('should throw required error for null token', () => {
    expectErrorMessages(
      ERR_RESET_PASSWORD_REQUEST_MODEL_TOKEN_NULL,
      [ERR_MSG_RESET_TOKEN_REQUIRED],
      1
    )
  })

  it('should throw required error for empty string token', () => {
    expectErrorMessages(
      ERR_RESET_PASSWORD_REQUEST_MODEL_TOKEN_EMPTY_STRING,
      [ERR_MSG_RESET_TOKEN_REQUIRED],
      1
    )
  })

  it('should throw required error for blank token', () => {
    expectErrorMessages(
      ERR_RESET_PASSWORD_REQUEST_MODEL_TOKEN_BLANK,
      [ERR_MSG_RESET_TOKEN_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined newPasswordDetails', () => {
    expectErrorMessages(
      ERR_RESET_PASSWORD_REQUEST_MODEL_NEW_PASSWORD_DETAILS_UNDEFINED,
      [ERR_MSG_RESET_NEW_PASSWORD_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for null newPasswordDetails', () => {
    expectErrorMessages(
      ERR_RESET_PASSWORD_REQUEST_MODEL_NEW_PASSWORD_DETAILS_NULL,
      [ERR_MSG_RESET_NEW_PASSWORD_DETAILS_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid ResetPasswordRequestModel', () => {
    expect(VALID_RESET_PASSWORD_REQUEST_MODEL).not.toThrow()
  })
})
