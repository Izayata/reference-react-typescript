import { registerDecorator, ValidationOptions } from 'class-validator'

export function NotBlank(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator(
      {
        name: 'NotBlank',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: unknown) {
            return (
              typeof value === 'string' &&
              value !== undefined &&
              value !== null &&
              value.trim().length > 0
            )
          },
        },
      }
    )
  }
}
