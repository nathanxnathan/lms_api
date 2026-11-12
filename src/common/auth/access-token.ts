import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env";

const TOKEN_ISSUER = "lms-api";
const TOKEN_AUDIENCE = "lms-api";
const MAX_ACCESS_TOKEN_LIFETIME_SECONDS = 60 * 60;

function getLifetimeSeconds(value: string): number {
  const match = /^([1-9]\d*)(s|m|h|d)$/.exec(value);
  if (!match) {
    throw new Error("JWT_ACCESS_EXPIRES_IN must be a duration such as 15m");
  }

  const amount = Number(match[1]);
  const unit = match[2];
  if (!unit) {
    throw new Error("JWT_ACCESS_EXPIRES_IN has an unsupported duration unit");
  }

  const unitSeconds: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };
  const multiplier = unitSeconds[unit];
  if (!multiplier) {
    throw new Error("JWT_ACCESS_EXPIRES_IN has an unsupported duration unit");
  }
  const seconds = amount * multiplier;

  if (
    !Number.isSafeInteger(seconds) ||
    seconds < 60 ||
    seconds > MAX_ACCESS_TOKEN_LIFETIME_SECONDS
  ) {
    throw new Error("JWT access-token lifetime must be between 1 minute and 1 hour");
  }

  return seconds;
}

export const ACCESS_TOKEN_LIFETIME_SECONDS = getLifetimeSeconds(
  env.JWT_ACCESS_EXPIRES_IN,
);

function encode(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decodeBase64Url(value: string): Buffer | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    return null;
  }

  const decoded = Buffer.from(value, "base64url");
  return decoded.toString("base64url") === value ? decoded : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  keys: string[],
): boolean {
  return (
    Object.keys(value).length === keys.length &&
    keys.every((key) => Object.hasOwn(value, key))
  );
}

export function createAccessToken(userId: string): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({
    sub: userId,
    iss: TOKEN_ISSUER,
    aud: TOKEN_AUDIENCE,
    iat: issuedAt,
    exp: issuedAt + ACCESS_TOKEN_LIFETIME_SECONDS,
  });
  const signingInput = `${header}.${payload}`;
  const signature = createHmac("sha256", env.JWT_SECRET)
    .update(signingInput)
    .digest("base64url");

  return `${signingInput}.${signature}`;
}

export function verifyAccessToken(token: string): string | null {
  if (token.length > 4096) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null;
  }

  const signature = decodeBase64Url(encodedSignature);
  if (!signature || signature.length !== 32) {
    return null;
  }

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = createHmac("sha256", env.JWT_SECRET)
    .update(signingInput)
    .digest();

  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  const headerBytes = decodeBase64Url(encodedHeader);
  const payloadBytes = decodeBase64Url(encodedPayload);
  if (!headerBytes || !payloadBytes) {
    return null;
  }

  try {
    const header: unknown = JSON.parse(headerBytes.toString("utf8"));
    const payload: unknown = JSON.parse(payloadBytes.toString("utf8"));
    if (!isRecord(header) || !isRecord(payload)) {
      return null;
    }

    if (
      !hasExactKeys(header, ["alg", "typ"]) ||
      header.alg !== "HS256" ||
      header.typ !== "JWT" ||
      !hasExactKeys(payload, ["sub", "iss", "aud", "iat", "exp"])
    ) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const issuedAt = payload.iat;
    const expiresAt = payload.exp;
    if (
      typeof payload.sub !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        payload.sub,
      ) ||
      payload.iss !== TOKEN_ISSUER ||
      payload.aud !== TOKEN_AUDIENCE ||
      typeof issuedAt !== "number" ||
      !Number.isSafeInteger(issuedAt) ||
      typeof expiresAt !== "number" ||
      !Number.isSafeInteger(expiresAt) ||
      issuedAt > now ||
      expiresAt <= now ||
      expiresAt - issuedAt !== ACCESS_TOKEN_LIFETIME_SECONDS
    ) {
      return null;
    }

    return payload.sub;
  } catch {
    return null;
  }
}
