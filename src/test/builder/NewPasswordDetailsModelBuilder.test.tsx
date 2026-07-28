import { NewPasswordDetailsModelBuilder } from '../../main/builder/NewPasswordDetailsModelBuilder'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import {
  ERR_MSG_NEW_PASSWORD_REQUIRED,
  ERR_MSG_CONFIRM_NEW_PASSWORD_REQUIRED,
  ERR_MSG_NEW_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_NEW_PASSWORD_VALUE
} from '../../main/utils/PasswordChangeUtils'

const VALID_PASSWORD = 'ValidPass123!'

// Invalid cases
const ERR_NEW_PASSWORD_DETAILS_MODEL_BUILDER_NEW_PASSWORD_UNSET = () => new NewPasswordDetailsModelBuilder()
  .setConfirmNewPassword(VALID_PASSWORD)
  .build()

const ERR_NEW_PASSWORD_DETAILS_MODEL_BUILDER_CONFIRM_NEW_PASSWORD_UNSET = () => new NewPasswordDetailsModelBuilder()
  .setNewPassword(VALID_PASSWORD)
  .build()

const ERR_NEW_PASSWORD_DETAILS_MODEL_BUILDER_MISMATCH = () => new NewPasswordDetailsModelBuilder()
  .setNewPassword(VALID_PASSWORD)
  .setConfirmNewPassword('DifferentPass456!')
  .build()

// Valid case
const VALID_NEW_PASSWORD_DETAILS_MODEL_BUILDER = () => new NewPasswordDetailsModelBuilder()
  .setNewPassword(VALID_PASSWORD)
  .setConfirmNewPassword(VALID_PASSWORD)
  .build()

describe('NewPasswordDetailsModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error when newPassword is never set', () => {
    expectErrorMessages(
      ERR_NEW_PASSWORD_DETAILS_MODEL_BUILDER_NEW_PASSWORD_UNSET,
      [ERR_MSG_NEW_PASSWORD_REQUIRED],
      1
    )
  })

  it('should throw required error when confirmNewPassword is never set', () => {
    expectErrorMessages(
      ERR_NEW_PASSWORD_DETAILS_MODEL_BUILDER_CONFIRM_NEW_PASSWORD_UNSET,
      [ERR_MSG_CONFIRM_NEW_PASSWORD_REQUIRED],
      1
    )
  })

  it('should throw a mismatch error when the two passwords differ', () => {
    expectErrorMessages(
      ERR_NEW_PASSWORD_DETAILS_MODEL_BUILDER_MISMATCH,
      [ERR_MSG_NEW_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_NEW_PASSWORD_VALUE],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid matching password pair', () => {
    expect(VALID_NEW_PASSWORD_DETAILS_MODEL_BUILDER).not.toThrow()
  })

  it('wraps the two raw strings into real PasswordModel instances', () => {
    const model = VALID_NEW_PASSWORD_DETAILS_MODEL_BUILDER()
    expect(model.newPassword.value).toBe(VALID_PASSWORD)
    expect(model.confirmNewPassword.value).toBe(VALID_PASSWORD)
  })
})
