import { validateSync } from 'class-validator'
import { NotUndefined } from './NotUndefined'

class TestClass {
  @NotUndefined({ message: 'must not be undefined' })
    value: unknown

  constructor(value: unknown) {
    this.value = value
  }
}

function validationMessages(value: unknown): string[] {
  const errors = validateSync(new TestClass(value))
  return errors.flatMap(err => Object.values(err.constraints ?? {}))
}

describe('NotUndefined', () => {
  it('fails validation for undefined', () => {
    expect(validationMessages(undefined)).toContain('must not be undefined')
  })

  it('passes validation for null (only undefined is rejected)', () => {
    expect(validationMessages(null)).toEqual([])
  })

  it('passes validation for an empty string', () => {
    expect(validationMessages('')).toEqual([])
  })

  it('passes validation for a non-undefined value', () => {
    expect(validationMessages('valid')).toEqual([])
  })
})
