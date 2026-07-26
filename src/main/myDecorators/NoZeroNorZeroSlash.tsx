import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function NoZeroNorZeroSlash(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'NotZeroOrZeroSlash',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return true
          return value !== '0' && !value.startsWith('0/')
        },
      },
    })
  }
}
