import { validateSync } from 'class-validator'
import { NoZeroNorZeroSlash } from '../../main/myDecorators/NoZeroNorZeroSlash'

class TestClass {
  @NoZeroNorZeroSlash({ message: 'must not be zero or zero-slash' })
    value: unknown

  constructor(value: unknown) {
    this.value = value
  }
}

function validationMessages(value: unknown): string[] {
  const errors = validateSync(new TestClass(value))
  return errors.flatMap(err => Object.values(err.constraints ?? {}))
}

describe('NoZeroNorZeroSlash', () => {
  it('fails for the literal string "0"', () => {
    expect(validationMessages('0')).toContain('must not be zero or zero-slash')
  })

  it('fails for a string starting with "0/"', () => {
    expect(validationMessages('0/1')).toContain('must not be zero or zero-slash')
  })

  it('passes for a regular house number', () => {
    expect(validationMessages('1')).toEqual([])
  })

  it('passes for a house number containing a slash that does not start with "0/"', () => {
    expect(validationMessages('1/2')).toEqual([])
  })

  it('passes for non-string values (the decorator only inspects strings)', () => {
    expect(validationMessages(0)).toEqual([])
  })
})
