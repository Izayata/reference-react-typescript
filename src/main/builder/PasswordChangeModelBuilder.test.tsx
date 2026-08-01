import { PasswordChangeModelBuilder } from './PasswordChangeModelBuilder'
import { NewPasswordDetailsModelBuilder } from '../builder/NewPasswordDetailsModelBuilder'
import { PasswordModel } from '../model/myUser/PasswordModel'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import { expectSetterReturnsSameInstance } from '../utils/test/ExpectSetterChaining'
import { ERR_MSG_CURRENT_PASSWORD_REQUIRED, ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED } from '../utils/PasswordChangeUtils'

// Valid values for composing PasswordChangeModel via the builder
const VALID_CURRENT_PASSWORD = new PasswordModel('CurrentPass123!')
const VALID_NEW_PASSWORD_DETAILS = new NewPasswordDetailsModelBuilder()
  .setNewPassword(new PasswordModel('NewPassword456!'))
  .setConfirmNewPassword(new PasswordModel('NewPassword456!'))
  .build()

// Invalid cases
const ERR_PASSWORD_CHANGE_MODEL_BUILDER_CURRENT_PASSWORD_UNSET = () => new PasswordChangeModelBuilder()
  .setNewPasswordDetails(VALID_NEW_PASSWORD_DETAILS)
  .build()

const ERR_PASSWORD_CHANGE_MODEL_BUILDER_NEW_PASSWORD_DETAILS_UNSET = () => new PasswordChangeModelBuilder()
  .setCurrentPassword(VALID_CURRENT_PASSWORD)
  .build()

// Valid case
const VALID_PASSWORD_CHANGE_MODEL_BUILDER = () => new PasswordChangeModelBuilder()
  .setCurrentPassword(VALID_CURRENT_PASSWORD)
  .setNewPasswordDetails(VALID_NEW_PASSWORD_DETAILS)
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

  it('should throw required error when newPasswordDetails is never set', () => {
    expectErrorMessages(
      ERR_PASSWORD_CHANGE_MODEL_BUILDER_NEW_PASSWORD_DETAILS_UNSET,
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

  it('setCurrentPassword returns the same builder instance for chaining', () => {
    const builder = new PasswordChangeModelBuilder()
    expectSetterReturnsSameInstance(builder, b => b.setCurrentPassword(VALID_CURRENT_PASSWORD))
  })

  it('setCurrentPassword overwrites a previously set value', () => {
    const model = new PasswordChangeModelBuilder()
      .setCurrentPassword(new PasswordModel('OtherPass789!'))
      .setCurrentPassword(VALID_CURRENT_PASSWORD)
      .setNewPasswordDetails(VALID_NEW_PASSWORD_DETAILS)
      .build()
    expect(model.currentPassword.value).toBe(VALID_CURRENT_PASSWORD.value)
  })
})
