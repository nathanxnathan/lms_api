import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const userController = new UserController();

router.post("/login", userController.login);
router.post("/", userController.create);

export default router;
