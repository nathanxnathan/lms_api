import Joi from "joi";
import type { NextFunction, Request, Response } from "express";
import { validateJsonBody } from "../../common/validation/validate-json-body";
import { CourseService } from "./course.service";

const createCourseSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  code: Joi.string().trim().min(1).max(50).required(),
  description: Joi.string().max(200).allow(null).optional(),
}).unknown(false);

export class CourseController {
  private courseService = new CourseService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    const body = validateJsonBody(req.body, createCourseSchema);
    if (!body.valid) {
      res.status(400).json({ message: body.message });
      return;
    }

    try {
      const course = await this.courseService.createCourse(body.value);
      res.status(201).json({
        message: "Course created successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  };
}
