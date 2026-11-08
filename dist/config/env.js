"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isDevelopment = exports.isProduction = exports.env = void 0;
require("dotenv/config");
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    NODE_ENV: joi_1.default.string().valid('development', 'production', 'test').default('development'),
    PORT: joi_1.default.number().integer().min(1).max(65535).default(4000),
    DATABASE_URL: joi_1.default.string()
        .uri({ scheme: ['postgres', 'postgresql'] })
        .required(),
    DATABASE_SSL: joi_1.default.boolean().truthy('true').falsy('false').default(false),
    JWT_SECRET: joi_1.default.string().min(32).required(),
    JWT_REFRESH_SECRET: joi_1.default.string().min(32).required(),
    JWT_ACCESS_EXPIRES_IN: joi_1.default.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: joi_1.default.string().default('7d'),
    LOG_LEVEL: joi_1.default.string().valid('debug', 'info', 'warn', 'error').default('info'),
    STORAGE_PATH: joi_1.default.string().default('./storage'),
    LOGS_PATH: joi_1.default.string().default('./logs'),
    SENDGRID_API_KEY: joi_1.default.string().allow('').optional(),
    MAIL_DEFAULT_FROM: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .allow('')
        .optional(),
    // Comma-separated list of admin recipients for internal alerts (low stock, prescription review, etc.)
    ADMIN_NOTIFICATION_EMAIL: joi_1.default.string().allow('').optional(),
    FIREBASE_PROJECT_ID: joi_1.default.string().optional(),
    FIREBASE_CLIENT_EMAIL: joi_1.default.string().optional(),
    FIREBASE_PRIVATE_KEY: joi_1.default.string().optional(),
    // Base64-encoded full service-account JSON. Preferred for CI/CD \u2014 a single
    // secret instead of three. Takes priority over the three vars above when set.
    FIREBASE_SERVICE_ACCOUNT_BASE64: joi_1.default.string().optional(),
    // ── Secret encryption (AES-256-GCM) — required for QuickBooks tokens ──────
    // 64 hex chars = 32 bytes. Generate with: openssl rand -hex 32
    SECRET_ENCRYPTION_KEY: joi_1.default.string()
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
exports.env = value;
exports.isProduction = exports.env.NODE_ENV === 'production';
exports.isDevelopment = exports.env.NODE_ENV === 'development';
exports.isTest = exports.env.NODE_ENV === 'test';
//# sourceMappingURL=env.js.map