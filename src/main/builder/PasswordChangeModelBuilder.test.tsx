import { PasswordChangeModelBuilder } from './PasswordChangeModelBuilder'
import { NewPasswordDetailsModelBuilder } from '../builder/NewPasswordDetailsModelBuilder'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import { ERR_MSG_CURRENT_PASSWORD_REQUIRED, ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED } from '../utils/PasswordChangeUtils'

// Valid values for composing PasswordChangeModel via the builder
const VALID_CURRENT_PASSWORD = 'CurrentPass123!'
const VALID_NEW_PASSWORD_DETAILS = new NewPasswordDetailsModelBuilder()
  .setNewPassword('NewPassword456!')
  .setConfirmNewPassword('NewPassword456!')
  .build()

// Invalid cases
const ERR_PASSWORD_CHANGE_MODEL_BUILDER_CURRENT_PASSWORD_UNSET = () => new PasswordChangeModelBuilder()
  .setNewPasswordWrapper(VALID_NEW_PASSWORD_DETAILS)
  .build()

const ERR_PASSWORD_CHANGE_MODEL_BUILDER_NEW_PASSWORD_WRAPPER_UNSET = () => new PasswordChangeModelBuilder()
  .setCurrentPassword(VALID_CURRENT_PASSWORD)
  .build()

// Valid case
const VALID_PASSWORD_CHANGE_MODEL_BUILDER = () => new PasswordChangeModelBuilder()
  .setCurrentPassword(VALID_CURRENT_PASSWORD)
  .setNewPasswordWrapper(VALID_NEW_PASSWORD_DETAILS)
  .build()

describe('PasswordChangeModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error when currentPassword is never set', () => {
    expectErrorMessages(
      ERR_PASSWORD_CHANGE_MODEL_BUILDER_CURRENT_PASSWORD_UNSET,
      [ERR_MSG_CURRENT_PASSWORD_REQUIRED],
      1
    )
  })

  it('should throw required error when newPasswordWrapper is never set', () => {
    expectErrorMessages(
      ERR_PASSWORD_CHANGE_MODEL_BUILDER_NEW_PASSWORD_WRAPPER_UNSET,
      [ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid password change', () => {
    expect(VALID_PASSWORD_CHANGE_MODEL_BUILDER).not.toThrow()
  })

  it('wraps setCurrentPassword\'s raw string into a real PasswordModel', () => {
    const model = VALID_PASSWORD_CHANGE_MODEL_BUILDER()
    expect(model.currentPassword.value).toBe(VALID_CURRENT_PASSWORD)
  })
})
