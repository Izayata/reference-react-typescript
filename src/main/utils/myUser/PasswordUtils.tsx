import { containsWhitespace, isBlank } from '../CommonUtils'

export const PASSWORD_VALUE_ALLOWED_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]+$/
export const PASSWORD_VALUE_MIN_LENGTH = 8
export const PASSWORD_VALUE_MAX_LENGTH = 24

export const ERR_MSG_PASSWORD_REQUIRED = 'A jelszó megadása kötelező!'
export const ERR_MSG_CONFIRM_PASSWORD_REQUIRED = 'A megerősítő jelszó megadása kötelező!'
export const ERR_MSG_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_PASSWORD_VALUE = 'A jelszó és a megerősítő jelszó nem egyezik!'
export const ERR_MSG_PASSWORD_VALUE_REQUIRED = 'A jelszó megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_PASSWORD_VALUE_FORMAT = 'A jelszónak tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert, valamint nem tartalmazhat szóközt!'
export const ERR_MSG_PASSWORD_VALUE_LENGTH = 'A jelszó legalább ' + PASSWORD_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + PASSWORD_VALUE_MAX_LENGTH + ' karakter!'
export const ERR_MSG_PASSWORD_VALUE_COMMON = 'A megadott jelszó túl gyakori, más jelszó szükséges!'

export async function checkPasswordIsCommon(password: string): Promise<boolean> {
  const res = await fetch('/v1/registration/common-password',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password }),
    }
  )
  if (!res.ok) return false
  const data = await res.json()
  return data.isCommonPassword
}

export function validatePassword(password: string) {
  if (isBlank(password)) {
    throw new Error(ERR_MSG_PASSWORD_VALUE_REQUIRED)
  }
  if (containsWhitespace(password)) {
    throw new Error(ERR_MSG_PASSWORD_VALUE_FORMAT)
  }
  if (!PASSWORD_VALUE_ALLOWED_REGEX.test(password)) {
    throw new Error(ERR_MSG_PASSWORD_VALUE_FORMAT)
  }
  if (password.length < PASSWORD_VALUE_MIN_LENGTH || password.length > PASSWORD_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_PASSWORD_VALUE_LENGTH)
  }
}  
