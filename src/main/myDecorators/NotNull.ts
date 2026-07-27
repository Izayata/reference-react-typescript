import { registerDecorator, ValidationOptions } from 'class-validator'

export function NotNull(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator(
      {
        name: 'NotNull',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: unknown) {
            return (
              value !== null
            )
          },
        },
      }
    )
  }
}
