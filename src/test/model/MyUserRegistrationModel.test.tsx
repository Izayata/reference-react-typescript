import { MyUserRegistrationModel } from '../../main/model/MyUserRegistrationModel'
import { EmailModel } from '../../main/model/EmailModel'
import { UsernameModel } from '../../main/model/myUser/UsernameModel'
import { PasswordModel } from '../../main/model/myUser/PasswordModel'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import { ERR_MSG_EMAIL_REQUIRED } from '../../main/utils/EmailUtils'
import { ERR_MSG_USERNAME_REQUIRED } from '../../main/utils/myUser/UsernameUtils'
import { ERR_MSG_CONFIRM_PASSWORD_REQUIRED, ERR_MSG_PASSWORD_REQUIRED, ERR_MSG_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_PASSWORD_VALUE } from '../../main/utils/myUser/PasswordUtils'
import { NewPasswordDetailsModel } from '../../main/model/NewPasswordDetailsModel'
import { ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED } from '../../main/utils/PasswordChangeUtils'

// Valid models for composing MyUserModel
const VALID_EMAIL_MODEL = new EmailModel('test@example.com')
const VALID_USERNAME_MODEL = new UsernameModel('ValidUser123')
const VALID_NEW_PASSWORD_DETAILS_MODEL = new NewPasswordDetailsModel(
  new PasswordModel('ValidPass123!'),
  new PasswordModel('ValidPass123!')
)

// Invalid cases
const ERR_MY_USER_MODEL_EMAIL_UNDEFINED = () => new MyUserRegistrationModel(
  undefined as any,
  VALID_USERNAME_MODEL,
  VALID_NEW_PASSWORD_DETAILS_MODEL
)
const ERR_MY_USER_MODEL_EMAIL_NULL = () => new MyUserRegistrationModel(
  null as any,
  VALID_USERNAME_MODEL,
  VALID_NEW_PASSWORD_DETAILS_MODEL
)
const ERR_MY_USER_MODEL_USERNAME_UNDEFINED = () => new MyUserRegistrationModel(
  VALID_EMAIL_MODEL,
  undefined as any,
  VALID_NEW_PASSWORD_DETAILS_MODEL
)
const ERR_MY_USER_MODEL_USERNAME_NULL = () => new MyUserRegistrationModel(
  VALID_EMAIL_MODEL,
  null as any,
  VALID_NEW_PASSWORD_DETAILS_MODEL
)
const ERR_MY_USER_MODEL_NEW_PASSWORD_DETAILS_UNDEFINED = () => new MyUserRegistrationModel(
  VALID_EMAIL_MODEL,
  VALID_USERNAME_MODEL,
  undefined as any
)
const ERR_MY_USER_MODEL_NEW_PASSWORD_DETAILS_NULL = () => new MyUserRegistrationModel(
  VALID_EMAIL_MODEL,
  VALID_USERNAME_MODEL,
  null as any
)

// Valid case
const VALID_MY_USER_MODEL = () => new MyUserRegistrationModel(
  VALID_EMAIL_MODEL,
  VALID_USERNAME_MODEL,
  VALID_NEW_PASSWORD_DETAILS_MODEL
)

describe('MyUserModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined email', () => {
    expectErrorMessages(
      ERR_MY_USER_MODEL_EMAIL_UNDEFINED,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })
  
  it('should throw required error for null email', () => {
    expectErrorMessages(
      ERR_MY_USER_MODEL_EMAIL_NULL,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })
 
  it('should throw required error for undefined username', () => {
    expectErrorMessages(
      ERR_MY_USER_MODEL_USERNAME_UNDEFINED,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null username', () => {
    expectErrorMessages(
      ERR_MY_USER_MODEL_USERNAME_NULL,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined new password details model', () => {
    expectErrorMessages(
      ERR_MY_USER_MODEL_NEW_PASSWORD_DETAILS_UNDEFINED,
      [ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for null new password details model', () => {
    expectErrorMessages(
      ERR_MY_USER_MODEL_NEW_PASSWORD_DETAILS_NULL,
      [ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid MyUserModel', () => {
    expect(VALID_MY_USER_MODEL).not.toThrow()
  })
})
