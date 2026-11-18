import { randomBytes, createHmac } from "node:crypto";
import { env } from "../../config/env";

function getLifetimeSeconds(value: string): number {
  const match = /^([1-9]\d*)(s|m|h|d)$/.exec(value);
  if (!match) {
    throw new Error("JWT_REFRESH_EXPIRES_IN must be a duration such as 7d");
  }

  const amount = Number(match[1]);
  const unit = match[2];
  if (!unit) {
    throw new Error("JWT_REFRESH_EXPIRES_IN has an unsupported duration unit");
  }

  const unitSeconds: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };
  const multiplier = unitSeconds[unit];
  if (!multiplier) {
    throw new Error("JWT_REFRESH_EXPIRES_IN has an unsupported duration unit");
  }

  const seconds = amount * multiplier;
  if (!Number.isSafeInteger(seconds) || seconds < 60) {
    throw new Error("JWT refresh-token lifetime must be at least 1 minute");
  }

  return seconds;
}

export const REFRESH_TOKEN_LIFETIME_SECONDS = getLifetimeSeconds(
  env.JWT_REFRESH_EXPIRES_IN,
);

export function createRefreshToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return createHmac("sha256", env.JWT_REFRESH_SECRET)
    .update(token)
    .digest("hex");
}

export function isRefreshTokenFormat(token: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}
