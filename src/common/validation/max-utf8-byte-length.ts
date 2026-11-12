import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from "class-validator";

export function MaxUtf8ByteLength(
  maxBytes: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target, propertyKey) => {
    registerDecorator({
      name: "maxUtf8ByteLength",
      target: target.constructor,
      propertyName: propertyKey.toString(),
      constraints: [maxBytes],
      ...(validationOptions ? { options: validationOptions } : {}),
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          return (
            typeof value === "string" &&
            Buffer.byteLength(value, "utf8") <= args.constraints[0]
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at most ${args.constraints[0]} UTF-8 bytes`;
        },
      },
    });
  };
}
