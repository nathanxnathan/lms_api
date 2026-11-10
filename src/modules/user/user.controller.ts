import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

export class UserController {
  private userService = new UserService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({
        message: "Request body must be a JSON object",
      });
      return;
    }

    try {
      const user = await this.userService.createUser(req.body);

      res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
