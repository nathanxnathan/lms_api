import { Router } from "express";
import { authenticate, requireAdmin } from "../../common/auth/auth.middleware";
import { EnrollmentController } from "./enrollment.controller";

const router = Router();
const enrollmentController = new EnrollmentController();

router.post("/", enrollmentController.createApplication);
router.get("/status/:trackingNumber", enrollmentController.getStatus);
router.get(
  "/admin/pending",
  authenticate,
  requireAdmin,
  enrollmentController.listPending,
);
router.post(
  "/admin/:applicationId/approve",
  authenticate,
  requireAdmin,
  enrollmentController.approve,
);
router.post(
  "/admin/:applicationId/reject",
  authenticate,
  requireAdmin,
  enrollmentController.reject,
);
router.post(
  "/admin/:applicationId/resend-approval-email",
  authenticate,
  requireAdmin,
  enrollmentController.resendApprovalEmail,
);

export default router;
