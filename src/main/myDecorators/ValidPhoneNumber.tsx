import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'
import { isValidPhoneNumber } from 'libphonenumber-js'

export function ValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false
          const internationalFormat = value && value.startsWith('06') ? '+36' + value.substring(2) : value.startsWith('+') ? value : '+' + value
          return isValidPhoneNumber(internationalFormat)
        },
      },
    })
  }
}
