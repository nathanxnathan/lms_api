import 'dotenv/config';
import Joi from 'joi';

interface EnvSchema {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  DATABASE_SSL: boolean;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  STORAGE_PATH: string;
  LOGS_PATH: string;
  SENDGRID_API_KEY: string | undefined;
  MAIL_DEFAULT_FROM: string | undefined;
  ADMIN_NOTIFICATION_EMAIL: string | undefined;
  FIREBASE_PROJECT_ID: string | undefined;
  FIREBASE_CLIENT_EMAIL: string | undefined;
  FIREBASE_PRIVATE_KEY: string | undefined;
  FIREBASE_SERVICE_ACCOUNT_BASE64: string | undefined;

  SECRET_ENCRYPTION_KEY: string | undefined;
}

const schema = Joi.object<EnvSchema>({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(4000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  DATABASE_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'),
  STORAGE_PATH: Joi.string().default('./storage'),
  LOGS_PATH: Joi.string().default('./logs'),
  SENDGRID_API_KEY: Joi.string().allow('').optional(),
  MAIL_DEFAULT_FROM: Joi.string()
    .email({ tlds: { allow: false } })
    .allow('')
    .optional(),
  // Comma-separated list of admin recipients for internal alerts (low stock, prescription review, etc.)
  ADMIN_NOTIFICATION_EMAIL: Joi.string().allow('').optional(),
  FIREBASE_PROJECT_ID: Joi.string().optional(),
  FIREBASE_CLIENT_EMAIL: Joi.string().optional(),
  FIREBASE_PRIVATE_KEY: Joi.string().optional(),
  // Base64-encoded full service-account JSON. Preferred for CI/CD \u2014 a single
  // secret instead of three. Takes priority over the three vars above when set.
  FIREBASE_SERVICE_ACCOUNT_BASE64: Joi.string().optional(),



  // ── Secret encryption (AES-256-GCM) — required for QuickBooks tokens ──────
  // 64 hex chars = 32 bytes. Generate with: openssl rand -hex 32
  SECRET_ENCRYPTION_KEY: Joi.string()
    .length(64)
    .pattern(/^[0-9a-fA-F]+$/)
    .allow('')
    .optional(),
}).unknown(true);

const { error, value } = schema.validate(process.env, {
  abortEarly: false,
  stripUnknown: false,
});

if (error) {
  console.error('Invalid environment configuration:');
  for (const detail of error.details) {
    console.error(`  - ${detail.message}`);
  }
  process.exit(1);
}

export const env: EnvSchema = value as EnvSchema;

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';