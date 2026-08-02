import { NewPasswordDetailsModelBuilder } from './NewPasswordDetailsModelBuilder'
import { PasswordModel } from '../../model/myUser/PasswordModel'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'
import { expectSetterReturnsSameInstance } from '../../utils/test/ExpectSetterChaining'
import {
  ERR_MSG_NEW_PASSWORD_REQUIRED,
  ERR_MSG_CONFIRM_NEW_PASSWORD_REQUIRED,
  ERR_MSG_NEW_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_NEW_PASSWORD_VALUE
} from '../../utils/PasswordChangeUtils'

const VALID_PASSWORD = new PasswordModel('ValidPass123!')

// Invalid cases
const ERR_NEW_PASSWORD_DETAILS_MODEL_BUILDER_NEW_PASSWORD_UNSET = () => new NewPasswordDetailsModelBuilder()
  .setConfirmNewPassword(VALID_PASSWORD)
  .build()

const ERR_NEW_PASSWORD_DETAILS_MODEL_BUILDER_CONFIRM_NEW_PASSWORD_UNSET = () => new NewPasswordDetailsModelBuilder()
  .setNewPassword(VALID_PASSWORD)
  .build()

const ERR_NEW_PASSWORD_DETAILS_MODEL_BUILDER_MISMATCH = () => new NewPasswordDetailsModelBuilder()
  .setNewPassword(VALID_PASSWORD)
  .setConfirmNewPassword(new PasswordModel('DifferentPass456!'))
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

  it('setNewPassword returns the same builder instance for chaining', () => {
    const builder = new NewPasswordDetailsModelBuilder()
    expectSetterReturnsSameInstance(builder, b => b.setNewPassword(VALID_PASSWORD))
  })

  it('setNewPassword overwrites a previously set value', () => {
    const model = new NewPasswordDetailsModelBuilder()
      .setNewPassword(new PasswordModel('OtherPass789!'))
      .setNewPassword(VALID_PASSWORD)
      .setConfirmNewPassword(VALID_PASSWORD)
      .build()
    expect(model.newPassword.value).toBe(VALID_PASSWORD.value)
  })
})
