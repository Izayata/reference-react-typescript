import { registerDecorator, ValidationOptions } from 'class-validator'

export function NotUndefined(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator(
      {
        name: 'NotUndefined',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: unknown) {
            return (
              value !== undefined
            )
          },
        },
      }
    )
  }
}
