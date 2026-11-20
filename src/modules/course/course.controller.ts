import Joi from "joi";
import type { NextFunction, Request, Response } from "express";
import { validateJsonBody } from "../../common/validation/validate-json-body";
import { CourseInputError, CourseService } from "./course.service";

const createCourseSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  code: Joi.string().trim().min(1).max(50).required(),
  description: Joi.string().max(200).allow(null).optional(),
  departmentIds: Joi.array()
    .items(Joi.string().guid({ version: "uuidv4" }).required())
    .min(1)
    .unique()
    .required(),
}).unknown(false);

const courseDepartmentsSchema = Joi.object({
  departmentIds: Joi.array()
    .items(Joi.string().guid({ version: "uuidv4" }).required())
    .min(1)
    .unique()
    .required(),
}).unknown(false);

export class CourseController {
  private courseService = new CourseService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    const query = Joi.object({
      departmentId: Joi.string().guid({ version: "uuidv4" }).optional(),
    })
      .unknown(false)
      .validate(req.query);
    if (query.error) {
      res.status(400).json({ message: "Invalid course query parameters" });
      return;
    }

    try {
      const courses = await this.courseService.listCourses(
        query.value.departmentId,
      );
      res.status(200).json({ data: courses });
    } catch (error) {
      next(error);
    }
  };

  updateDepartments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const courseId = req.params.courseId;
    if (
      typeof courseId !== "string" ||
      Joi.string().guid({ version: "uuidv4" }).validate(courseId).error
    ) {
      res.status(400).json({ message: "Invalid course ID" });
      return;
    }

    const body = validateJsonBody(req.body, courseDepartmentsSchema);
    if (!body.valid) {
      res.status(400).json({ message: body.message });
      return;
    }

    try {
      const course = await this.courseService.setCourseDepartments(
        courseId,
        body.value.departmentIds,
      );
      res.status(200).json({
        message: "Course departments updated successfully",
        data: course,
      });
    } catch (error) {
      if (error instanceof CourseInputError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

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
      if (error instanceof CourseInputError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}
