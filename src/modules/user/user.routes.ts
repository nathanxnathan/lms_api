import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const userController = new UserController();

router.post("/login", userController.login);
router.post("/refresh", userController.refresh);
router.post("/logout", userController.logout);
router.post("/complete-setup", userController.completeAccountSetup);
router.post("/", userController.create);

export default router;
