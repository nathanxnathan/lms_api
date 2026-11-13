import {
  registerDecorator,
  type ValidationOptions,
} from "class-validator";
import { LearningResourceType } from "../types/learning-resource.type";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isLearningResource(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  const allowedKeys = ["type", "url", "fileName"];
  if (Object.keys(value).some((key) => !allowedKeys.includes(key))) {
    return false;
  }

  if (
    typeof value.type !== "string" ||
    !Object.values(LearningResourceType).some(
      (resourceType) => resourceType === value.type,
    ) ||
    typeof value.url !== "string"
  ) {
    return false;
  }

  if (
    value.fileName !== undefined &&
    (typeof value.fileName !== "string" || value.fileName.length > 255)
  ) {
    return false;
  }

  try {
    const url = new URL(value.url);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function IsLearningResources(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target, propertyKey) => {
    registerDecorator({
      name: "isLearningResources",
      target: target.constructor,
      propertyName: String(propertyKey),
      ...(validationOptions ? { options: validationOptions } : {}),
      validator: {
        validate(value: unknown): boolean {
          return Array.isArray(value) && value.every(isLearningResource);
        },
        defaultMessage(): string {
          return "Resources must contain PDF, image, or link objects with valid HTTP(S) URLs";
        },
      },
    });
  };
}
