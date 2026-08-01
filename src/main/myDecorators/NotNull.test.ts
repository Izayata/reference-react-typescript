import { validateSync } from 'class-validator'
import { NotNull } from './NotNull'

class TestClass {
  @NotNull({ message: 'must not be null' })
    value: unknown

  constructor(value: unknown) {
    this.value = value
  }
}

function validationMessages(value: unknown): string[] {
  const errors = validateSync(new TestClass(value))
  return errors.flatMap(err => Object.values(err.constraints ?? {}))
}

describe('NotNull', () => {
  it('fails validation for null', () => {
    expect(validationMessages(null)).toContain('must not be null')
  })

  it('passes validation for undefined (only null is rejected)', () => {
    expect(validationMessages(undefined)).toEqual([])
  })

  it('passes validation for an empty string', () => {
    expect(validationMessages('')).toEqual([])
  })

  it('passes validation for a non-null value', () => {
    expect(validationMessages('valid')).toEqual([])
  })
})
