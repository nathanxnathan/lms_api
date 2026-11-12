import Joi from "joi";
import type { NextFunction, Request, Response } from "express";
import { validateJsonBody } from "../../common/validation/validate-json-body";
import { DepartmentService } from "./department.service";

const createDepartmentSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  code: Joi.string().trim().min(1).max(50).required(),
  description: Joi.string().max(200).allow(null).optional(),
}).unknown(false);

export class DepartmentController {
  private departmentService = new DepartmentService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    const body = validateJsonBody(req.body, createDepartmentSchema);
    if (!body.valid) {
      res.status(400).json({ message: body.message });
      return;
    }

    try {
      const department = await this.departmentService.createDepartment(
        body.value,
      );
      res.status(201).json({
        message: "Department created successfully",
        data: department,
      });
    } catch (error) {
      next(error);
    }
  };
}
