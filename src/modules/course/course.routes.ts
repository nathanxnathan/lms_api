import { Router } from "express";
import { authenticate, requireAdmin } from "../../common/auth/auth.middleware";
import { CourseController } from "./course.controller";

const router = Router();
const courseController = new CourseController();

router.post("/", authenticate, requireAdmin, courseController.create);

export default router;
