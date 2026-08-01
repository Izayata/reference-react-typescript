import { PasswordChangeModel } from './PasswordChangeModel'
import { PasswordModel } from './myUser/PasswordModel'
import { NewPasswordDetailsModelBuilder } from '../builder/NewPasswordDetailsModelBuilder'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import {
  ERR_MSG_CURRENT_PASSWORD_REQUIRED,
  ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED
} from '../utils/PasswordChangeUtils'

// Valid passwords and wrappers for composing PasswordChangeModel
const VALID_CURRENT_PASSWORD = new PasswordModel('CurrentPass123!')
const VALID_NEW_PASSWORD_DETAILS = new NewPasswordDetailsModelBuilder()
  .setNewPassword('NewPassword456!')
  .setConfirmNewPassword('NewPassword456!')
  .build()
const SAME_AS_CURRENT_PASSWORD_DETAILS = new NewPasswordDetailsModelBuilder()
  .setNewPassword('CurrentPass123!')
  .setConfirmNewPassword('CurrentPass123!')
  .build()

// Invalid cases using direct constructor
const ERR_PASSWORD_CHANGE_MODEL_CURRENT_PASSWORD_UNDEFINED = () => new PasswordChangeModel(
  undefined as any,
  VALID_NEW_PASSWORD_DETAILS
)

const ERR_PASSWORD_CHANGE_MODEL_CURRENT_PASSWORD_NULL = () => new PasswordChangeModel(
  null as any,
  VALID_NEW_PASSWORD_DETAILS
)

const ERR_PASSWORD_CHANGE_MODEL_NEW_PASSWORD_DETAILS_UNDEFINED = () => new PasswordChangeModel(
  VALID_CURRENT_PASSWORD,
  undefined as any
)

const ERR_PASSWORD_CHANGE_MODEL_NEW_PASSWORD_DETAILS_NULL = () => new PasswordChangeModel(
  VALID_CURRENT_PASSWORD,
  null as any
)

// Business logic validation errors
const ERR_NEW_PASSWORD_SAME_AS_CURRENT = () => new PasswordChangeModel(
  VALID_CURRENT_PASSWORD,
  SAME_AS_CURRENT_PASSWORD_DETAILS
)

// Valid cases using direct constructor
const VALID_PASSWORD_CHANGE_MODEL = () => new PasswordChangeModel(
  VALID_CURRENT_PASSWORD,
  VALID_NEW_PASSWORD_DETAILS
)

describe('PasswordChangeModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined currentPassword', () => {
    expectErrorMessages(
      ERR_PASSWORD_CHANGE_MODEL_CURRENT_PASSWORD_UNDEFINED,
      [ERR_MSG_CURRENT_PASSWORD_REQUIRED],
      1
    )
  })

  it('should throw required error for null currentPassword', () => {
    expectErrorMessages(
      ERR_PASSWORD_CHANGE_MODEL_CURRENT_PASSWORD_NULL,
      [ERR_MSG_CURRENT_PASSWORD_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined newPasswordDetails', () => {
    expectErrorMessages(
      ERR_PASSWORD_CHANGE_MODEL_NEW_PASSWORD_DETAILS_UNDEFINED,
      [ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for null newPasswordDetails', () => {
    expectErrorMessages(
      ERR_PASSWORD_CHANGE_MODEL_NEW_PASSWORD_DETAILS_NULL,
      [ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid password change model', () => {
    expect(VALID_PASSWORD_CHANGE_MODEL).not.toThrow()
  })
})
