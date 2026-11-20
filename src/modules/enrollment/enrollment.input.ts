import Joi from "joi";

export const createEnrollmentApplicationSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().email().max(255).required(),
  departmentId: Joi.string().guid({ version: "uuidv4" }).required(),
  courseIds: Joi.array()
    .items(Joi.string().guid({ version: "uuidv4" }).required())
    .min(1)
    .unique()
    .required(),
}).unknown(false);

export const rejectEnrollmentApplicationSchema = Joi.object({
  reviewNote: Joi.string().trim().max(500).allow("").optional(),
}).unknown(false);

