import { Router } from "express";
import { authenticate, requireAdmin } from "../../common/auth/auth.middleware";
import { DepartmentController } from "./department.controller";

const router = Router();
const departmentController = new DepartmentController();

router.post("/", authenticate, requireAdmin, departmentController.create);

export default router;
