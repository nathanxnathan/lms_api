import Joi from "joi";
import type { NextFunction, Request, Response } from "express";
import { sendEnrollmentApprovedEmail } from "../../common/email/email.service";
import { validateJsonBody } from "../../common/validation/validate-json-body";
import {
  createEnrollmentApplicationSchema,
  rejectEnrollmentApplicationSchema,
} from "./enrollment.input";
import {
  EnrollmentService,
  EnrollmentWorkflowError,
} from "./enrollment.service";

const applicationIdSchema = Joi.string().guid({ version: "uuidv4" });

function validApplicationId(
  value: string | string[] | undefined,
): value is string {
  return (
    typeof value === "string" && applicationIdSchema.validate(value).error === undefined
  );
}

export class EnrollmentController {
  private enrollmentService = new EnrollmentService();

  createApplication = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const body = validateJsonBody(
      req.body,
      createEnrollmentApplicationSchema,
    );
    if (!body.valid) {
      res.status(400).json({ message: body.message });
      return;
    }

    try {
      const application = await this.enrollmentService.createApplication(
        body.value,
      );
      res.status(201).json({
        message: "Enrollment application submitted",
        data: {
          trackingNumber: application.trackingNumber,
          status: application.status,
          submittedAt: application.createdAt,
        },
      });
    } catch (error) {
      this.respondToWorkflowError(error, res, next);
    }
  };

  getStatus = async (req: Request, res: Response, next: NextFunction) => {
    const trackingNumber = req.params.trackingNumber;
    if (
      typeof trackingNumber !== "string" ||
      !/^[A-F0-9]{32}$/.test(trackingNumber)
    ) {
      res.status(400).json({ message: "Invalid tracking number" });
      return;
    }

    try {
      const application = await this.enrollmentService.getStatus(
        trackingNumber,
      );
      res.status(200).json({
        data: {
          trackingNumber: application.trackingNumber,
          status: application.status,
          reviewNote: application.reviewNote,
          submittedAt: application.createdAt,
          reviewedAt: application.reviewedAt,
        },
      });
    } catch (error) {
      this.respondToWorkflowError(error, res, next);
    }
  };

  listPending = async (req: Request, res: Response, next: NextFunction) => {
    const query = Joi.object({
      page: Joi.number().integer().min(1).default(1),
    })
      .unknown(false)
      .validate(req.query);
    if (query.error) {
      res.status(400).json({ message: "Invalid page query parameter" });
      return;
    }

    try {
      const page = Number(query.value.page);
      const applications =
        await this.enrollmentService.listPendingApplications(page);
      res.status(200).json({
        data: applications.map((application) => ({
          id: application.id,
          trackingNumber: application.trackingNumber,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          status: application.status,
          submittedAt: application.createdAt,
          department: {
            id: application.department.id,
            name: application.department.name,
            code: application.department.code,
          },
          courses: application.courses.map((course) => ({
            id: course.id,
            name: course.name,
            code: course.code,
          })),
        })),
        page,
        pageSize: 100,
      });
    } catch (error) {
      next(error);
    }
  };

  approve = async (req: Request, res: Response, next: NextFunction) => {
    const applicationId = req.params.applicationId;
    if (!validApplicationId(applicationId)) {
      res.status(400).json({ message: "Invalid application ID" });
      return;
    }
    const adminId = req.authUser?.id;
    if (!adminId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const result = await this.enrollmentService.approveApplication(
        applicationId,
        adminId,
      );

      try {
        await sendEnrollmentApprovedEmail({
          email: result.user.email,
          firstName: result.user.firstName,
          studentId: result.studentId,
          setupToken: result.setupToken,
        });
      } catch (emailError) {
        console.error("Enrollment approval email delivery failed", emailError);
        res.status(503).json({
          message:
            "The application was approved, but the notification email could not be sent. Retry delivery through the admin endpoint.",
          data: {
            trackingNumber: result.application.trackingNumber,
            status: result.application.status,
            studentId: result.studentId,
            notificationSent: false,
          },
        });
        return;
      }

      res.status(200).json({
        message: "Enrollment application approved",
        data: {
          trackingNumber: result.application.trackingNumber,
          status: result.application.status,
          studentId: result.studentId,
          setupRequired: result.setupToken !== null,
          notificationSent: true,
        },
      });
    } catch (error) {
      this.respondToWorkflowError(error, res, next);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    const applicationId = req.params.applicationId;
    if (!validApplicationId(applicationId)) {
      res.status(400).json({ message: "Invalid application ID" });
      return;
    }
    const adminId = req.authUser?.id;
    if (!adminId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const body = validateJsonBody(
      req.body ?? {},
      rejectEnrollmentApplicationSchema,
    );
    if (!body.valid) {
      res.status(400).json({ message: body.message });
      return;
    }

    try {
      const application = await this.enrollmentService.rejectApplication(
        applicationId,
        adminId,
        body.value.reviewNote,
      );
      res.status(200).json({
        message: "Enrollment application rejected",
        data: {
          trackingNumber: application.trackingNumber,
          status: application.status,
          reviewedAt: application.reviewedAt,
        },
      });
    } catch (error) {
      this.respondToWorkflowError(error, res, next);
    }
  };

  resendApprovalEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const applicationId = req.params.applicationId;
    if (!validApplicationId(applicationId)) {
      res.status(400).json({ message: "Invalid application ID" });
      return;
    }

    try {
      const { user, studentId, setupToken } =
        await this.enrollmentService.prepareApprovalEmail(applicationId);
      try {
        await sendEnrollmentApprovedEmail({
          email: user.email,
          firstName: user.firstName,
          studentId,
          setupToken,
        });
      } catch (emailError) {
        console.error("Enrollment approval email delivery failed", emailError);
        res.status(503).json({
          message: "The approval email could not be sent; retry the request",
          data: { notificationSent: false },
        });
        return;
      }

      res.status(200).json({
        message: "Approval email sent",
        data: { notificationSent: true },
      });
    } catch (error) {
      this.respondToWorkflowError(error, res, next);
    }
  };

  private respondToWorkflowError(
    error: unknown,
    res: Response,
    next: NextFunction,
  ): void {
    if (error instanceof EnrollmentWorkflowError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
}
