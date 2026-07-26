import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function NotBlank(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator(
      {
        name: 'NotBlank',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, _args: ValidationArguments) {
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
