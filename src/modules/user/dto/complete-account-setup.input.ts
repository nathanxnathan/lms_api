import Joi from "joi";

export const completeAccountSetupSchema = Joi.object({
  token: Joi.string()
    .pattern(/^[A-Za-z0-9_-]{43}$/)
    .required(),
  newPassword: Joi.string()
    .min(8)
    .max(72)
    .custom((value, helpers) =>
      Buffer.byteLength(value, "utf8") <= 72
        ? value
        : helpers.error("string.max"),
    )
    .required(),
}).unknown(false);
