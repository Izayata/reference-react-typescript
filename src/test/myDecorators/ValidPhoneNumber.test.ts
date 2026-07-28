import { validateSync } from 'class-validator'
import { ValidPhoneNumber } from '../../main/myDecorators/ValidPhoneNumber'

class TestClass {
  @ValidPhoneNumber({ message: 'invalid phone number' })
    value: unknown

  constructor(value: unknown) {
    this.value = value
  }
}

function validationMessages(value: unknown): string[] {
  const errors = validateSync(new TestClass(value))
  return errors.flatMap(err => Object.values(err.constraints ?? {}))
}

describe('ValidPhoneNumber', () => {
  it('passes for a valid +36-prefixed international number', () => {
    expect(validationMessages('+36204234442')).toEqual([])
  })

  it('passes for a valid 06-prefixed number (normalized to +36)', () => {
    expect(validationMessages('06204234442')).toEqual([])
  })

  it('passes for a valid number missing only the leading +', () => {
    expect(validationMessages('36204234442')).toEqual([])
  })

  it('fails for a number that is not a valid phone number once normalized', () => {
    expect(validationMessages('123')).toContain('invalid phone number')
  })

  it('fails for an empty string', () => {
    expect(validationMessages('')).toContain('invalid phone number')
  })

  it('fails for a non-string value', () => {
    expect(validationMessages(36204234442)).toContain('invalid phone number')
  })
})
