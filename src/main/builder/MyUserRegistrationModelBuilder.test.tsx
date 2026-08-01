import { MyUserRegistrationModelBuilder } from './MyUserRegistrationModelBuilder'
import { UsernameModel } from '../model/myUser/UsernameModel'
import { PasswordModel } from '../model/myUser/PasswordModel'
import { EmailModel } from '../model/EmailModel'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import { ERR_MSG_USERNAME_REQUIRED } from '../utils/myUser/UsernameUtils'
import { ERR_MSG_PASSWORD_REQUIRED, ERR_MSG_CONFIRM_PASSWORD_REQUIRED, ERR_MSG_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_PASSWORD_VALUE } from '../utils/myUser/PasswordUtils'
import { ERR_MSG_EMAIL_REQUIRED } from '../utils/EmailUtils'
import { NewPasswordDetailsModel } from '../model/NewPasswordDetailsModel'
import { ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED } from '../utils/PasswordChangeUtils'

// Valid models for composing MyUserRegistrationModel
const VALID_USERNAME_MODEL = new UsernameModel('testuser')
const VALID_PASSWORD_MODEL = new PasswordModel('StrongPassword123!')
const VALID_EMAIL_MODEL = new EmailModel('testuser@example.com')
const VALID_NEW_PASSWORD_DETAILS_MODEL = new NewPasswordDetailsModel(
  VALID_PASSWORD_MODEL,
  VALID_PASSWORD_MODEL
)

// Invalid cases
const ERR_MY_USER_REGISTRATION_MODEL_BUILDER_USERNAME_UNDEFINED = () => new MyUserRegistrationModelBuilder()
  .setMyUsername(undefined as any)
  .setEmail(VALID_EMAIL_MODEL)
  .setNewPasswordDetails(VALID_NEW_PASSWORD_DETAILS_MODEL)
  .build()

const ERR_MY_USER_REGISTRATION_MODEL_BUILDER_USERNAME_NULL = () => new MyUserRegistrationModelBuilder()
  .setMyUsername(null as any)
  .setEmail(VALID_EMAIL_MODEL)
  .setNewPasswordDetails(VALID_NEW_PASSWORD_DETAILS_MODEL)
  .build()

const ERR_MY_USER_REGISTRATION_MODEL_BUILDER_EMAIL_UNDEFINED = () => new MyUserRegistrationModelBuilder()
  .setMyUsername(VALID_USERNAME_MODEL)
  .setEmail(undefined as any)
  .setNewPasswordDetails(VALID_NEW_PASSWORD_DETAILS_MODEL)
  .build()

const ERR_MY_USER_REGISTRATION_MODEL_BUILDER_EMAIL_NULL = () => new MyUserRegistrationModelBuilder()
  .setMyUsername(VALID_USERNAME_MODEL)
  .setEmail(null as any)
  .setNewPasswordDetails(VALID_NEW_PASSWORD_DETAILS_MODEL)
  .build()

const ERR_MY_USER_REGISTRATION_MODEL_BUILDER_NEW_PASSWORD_DETAILS_UNDEFINED = () => new MyUserRegistrationModelBuilder()
  .setMyUsername(VALID_USERNAME_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setNewPasswordDetails(undefined as any)
  .build()

const ERR_MY_USER_REGISTRATION_MODEL_BUILDER_NEW_PASSWORD_DETAILS_NULL = () => new MyUserRegistrationModelBuilder()
  .setMyUsername(VALID_USERNAME_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setNewPasswordDetails(null as any)
  .build()

// Valid case
const VALID_MY_USER_REGISTRATION_MODEL_BUILDER = () => new MyUserRegistrationModelBuilder()
  .setMyUsername(VALID_USERNAME_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setNewPasswordDetails(VALID_NEW_PASSWORD_DETAILS_MODEL)
  .build()

describe('MyUserRegistrationModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined username', () => {
    expectErrorMessages(
      ERR_MY_USER_REGISTRATION_MODEL_BUILDER_USERNAME_UNDEFINED,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null username', () => {
    expectErrorMessages(
      ERR_MY_USER_REGISTRATION_MODEL_BUILDER_USERNAME_NULL,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined email', () => {
    expectErrorMessages(
      ERR_MY_USER_REGISTRATION_MODEL_BUILDER_EMAIL_UNDEFINED,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for null email', () => {
    expectErrorMessages(
      ERR_MY_USER_REGISTRATION_MODEL_BUILDER_EMAIL_NULL,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined password', () => {
    expectErrorMessages(
      ERR_MY_USER_REGISTRATION_MODEL_BUILDER_NEW_PASSWORD_DETAILS_UNDEFINED,
      [ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for null password', () => {
    expectErrorMessages(
      ERR_MY_USER_REGISTRATION_MODEL_BUILDER_NEW_PASSWORD_DETAILS_NULL,
      [ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid user registration model', () => {
    expect(VALID_MY_USER_REGISTRATION_MODEL_BUILDER).not.toThrow()
  })
})
