export const WHITESPACE_REGEX = /\s/

export const ERR_MSG_FIELDS_WITH_STAR_IS_REQUIRED = 'A *-gal jelölt mezők kitöltése kötelező!'

export function isBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === ''
}

export function containsWhitespace(value: string): boolean {
  return WHITESPACE_REGEX.test(value)
}

export function hasLeadingOrTrailingWhitespace(value: string): boolean {
  return (value.trim() !== value)
}
