import { NewPasswordDetailsModel } from './NewPasswordDetailsModel'
import { PasswordModel } from './myUser/PasswordModel'
import { 
  ERR_MSG_NEW_PASSWORD_REQUIRED,
  ERR_MSG_CONFIRM_NEW_PASSWORD_REQUIRED,
  ERR_MSG_NEW_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_NEW_PASSWORD_VALUE 
} from '../utils/PasswordChangeUtils'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'

const VALID_PASSWORD = new PasswordModel('ValidPass123!')

//Invalid cases
const ERR_NEW_PASSWORD_DETAILS_MODEL_NEW_PASSWORD_UNDEFINED = () => new NewPasswordDetailsModel(
  undefined as any,
  VALID_PASSWORD
)

const ERR_NEW_PASSWORD_DETAILS_MODEL_NEW_PASSWORD_NULL = () => new NewPasswordDetailsModel(
  null as any,
  VALID_PASSWORD
)

const ERR_NEW_PASSWORD_DETAILS_MODEL_CONFIRM_NEW_PASSWORD_UNDEFINED = () => new NewPasswordDetailsModel(
  VALID_PASSWORD,
  undefined as any
)

const ERR_NEW_PASSWORD_DETAILS_MODEL_CONFIRM_NEW_PASSWORD_NULL = () => new NewPasswordDetailsModel(
  VALID_PASSWORD,
  null as any
)

const ERR_NEW_PASSWORD_DETAILS_MODEL_CONFIRM_NEW_PASSWORD_NOT_MATCHES_NEW_PASSWORD = () => new NewPasswordDetailsModel(
  VALID_PASSWORD,
  new PasswordModel('DifferentPass456!')
)

//Valid cases
const VALID_NEW_PASSWORD_DETAILS_MODEL = () => new NewPasswordDetailsModel(
  VALID_PASSWORD,
  VALID_PASSWORD
)

describe('NewPasswordDetailsModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined newPassword', () => {
    expectErrorMessages(
      ERR_NEW_PASSWORD_DETAILS_MODEL_NEW_PASSWORD_UNDEFINED,
      [ERR_MSG_NEW_PASSWORD_REQUIRED],
      1
    )
  })

  it('should throw required error for null newPassword', () => {
    expectErrorMessages(
      ERR_NEW_PASSWORD_DETAILS_MODEL_NEW_PASSWORD_NULL,
      [ERR_MSG_NEW_PASSWORD_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined confirmNewPassword', () => {
    expectErrorMessages(
      ERR_NEW_PASSWORD_DETAILS_MODEL_CONFIRM_NEW_PASSWORD_UNDEFINED,
      [ERR_MSG_CONFIRM_NEW_PASSWORD_REQUIRED],
      1
    )
  })

  it('should throw required error for null confirmNewPassword', () => {
    expectErrorMessages(
      ERR_NEW_PASSWORD_DETAILS_MODEL_CONFIRM_NEW_PASSWORD_NULL,
      [ERR_MSG_CONFIRM_NEW_PASSWORD_REQUIRED],
      1
    )
  })

  it('should throw required error if confirmNewPassword not matches newPassword', () => {
    expectErrorMessages(
      ERR_NEW_PASSWORD_DETAILS_MODEL_CONFIRM_NEW_PASSWORD_NOT_MATCHES_NEW_PASSWORD,
      [ERR_MSG_NEW_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_NEW_PASSWORD_VALUE],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid NewPasswordDetailsModel', () => {
    expect(VALID_NEW_PASSWORD_DETAILS_MODEL).not.toThrow()
  })
})
