import type { ObjectSchema } from "joi";

type BodyValidation<T> =
  | { valid: true; value: T }
  | { valid: false; message: string };

export function validateJsonBody<T>(
  body: unknown,
  schema: ObjectSchema<T>,
): BodyValidation<T> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, message: "Request body must be a JSON object" };
  }

  const result = schema.validate(body, {
    abortEarly: false,
    allowUnknown: false,
    convert: false,
  });

  if (result.error) {
    return { valid: false, message: "Invalid request body" };
  }

  return { valid: true, value: result.value };
}
