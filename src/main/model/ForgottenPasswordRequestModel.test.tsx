import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import { ERR_MSG_EMAIL_REQUIRED } from '../utils/EmailUtils'
import { ERR_MSG_USERNAME_REQUIRED } from '../utils/myUser/UsernameUtils'
import { ForgottenPasswordRequestModel } from './ForgottenPasswordRequestModel'
import { EmailModel } from './EmailModel'
import { UsernameModel } from './myUser/UsernameModel'

// Valid models for composing MyUserModel
const VALID_EMAIL = new EmailModel('anna.kovacs@example.com')
const VALID_USERNAME = new UsernameModel('testuser')

// Invalid cases
const ERR_FORGOTTEN_PASSWORD_REQUEST_MODEL_EMAIL_UNDEFINED = () =>
  new ForgottenPasswordRequestModel(undefined as any, VALID_USERNAME)

const ERR_FORGOTTEN_PASSWORD_REQUEST_MODEL_EMAIL_NULL = () =>
  new ForgottenPasswordRequestModel(null as any, VALID_USERNAME)

const ERR_FORGOTTEN_PASSWORD_REQUEST_MODEL_USERNAME_UNDEFINED = () =>
  new ForgottenPasswordRequestModel(VALID_EMAIL, undefined as any)

const ERR_FORGOTTEN_PASSWORD_REQUEST_MODEL_USERNAME_NULL = () =>
  new ForgottenPasswordRequestModel(VALID_EMAIL, null as any)

// Valid case
const VALID_FORGOTTEN_PASSWORD_REQUEST_MODEL = () => new ForgottenPasswordRequestModel(VALID_EMAIL, VALID_USERNAME)

describe('ForgottenPasswordRequestModel', () => {
  it('should throw required error for undefined email', () => {
    expectErrorMessages(
      ERR_FORGOTTEN_PASSWORD_REQUEST_MODEL_EMAIL_UNDEFINED,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for null email', () => {
    expectErrorMessages(
      ERR_FORGOTTEN_PASSWORD_REQUEST_MODEL_EMAIL_NULL,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined username', () => {
    expectErrorMessages(
      ERR_FORGOTTEN_PASSWORD_REQUEST_MODEL_USERNAME_UNDEFINED,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null username', () => {
    expectErrorMessages(
      ERR_FORGOTTEN_PASSWORD_REQUEST_MODEL_USERNAME_NULL,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should accept valid ForgottenPasswordRequestModel', () => {
    expect(VALID_FORGOTTEN_PASSWORD_REQUEST_MODEL).not.toThrow()
  })
})
