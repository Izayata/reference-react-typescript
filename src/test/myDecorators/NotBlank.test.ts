import { validateSync } from 'class-validator'
import { NotBlank } from '../../main/myDecorators/NotBlank'

class TestClass {
  @NotBlank({ message: 'must not be blank' })
    value: unknown

  constructor(value: unknown) {
    this.value = value
  }
}

function validationMessages(value: unknown): string[] {
  const errors = validateSync(new TestClass(value))
  return errors.flatMap(err => Object.values(err.constraints ?? {}))
}

describe('NotBlank', () => {
  it('fails validation for undefined', () => {
    expect(validationMessages(undefined)).toContain('must not be blank')
  })

  it('fails validation for null', () => {
    expect(validationMessages(null)).toContain('must not be blank')
  })

  it('fails validation for an empty string', () => {
    expect(validationMessages('')).toContain('must not be blank')
  })

  it('fails validation for a whitespace-only string', () => {
    expect(validationMessages('   ')).toContain('must not be blank')
  })

  it('fails validation for a non-string value', () => {
    expect(validationMessages(123)).toContain('must not be blank')
  })

  it('passes validation for a non-blank string', () => {
    expect(validationMessages('valid')).toEqual([])
  })
})
