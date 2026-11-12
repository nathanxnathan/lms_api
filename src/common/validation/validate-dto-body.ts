import { validate } from "class-validator";

type BodyValidation<T> =
  | { valid: true; value: T }
  | { valid: false; message: string };

type DtoConstructor<T> = new () => T;

export async function validateDtoBody<T extends object>(
  body: unknown,
  Dto: DtoConstructor<T>,
): Promise<BodyValidation<T>> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, message: "Request body must be a JSON object" };
  }

  const dto = new Dto();
  for (const [key, value] of Object.entries(body)) {
    Object.defineProperty(dto, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }

  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  });
  if (errors.length > 0) {
    return { valid: false, message: "Invalid request body" };
  }

  return { valid: true, value: dto };
}
