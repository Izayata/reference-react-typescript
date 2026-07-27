import i18n from '../i18n/i18n'
export const WHITESPACE_REGEX = /\s/

export const ERR_MSG_FIELDS_WITH_STAR_IS_REQUIRED = i18n.t('errors.ERR_MSG_FIELDS_WITH_STAR_IS_REQUIRED')

export function isBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === ''
}

export function containsWhitespace(value: string): boolean {
  return WHITESPACE_REGEX.test(value)
}

export function hasLeadingOrTrailingWhitespace(value: string): boolean {
  return (value.trim() !== value)
}
