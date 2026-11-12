import type { Request, Response, NextFunction } from "express";
import {
  ACCESS_TOKEN_LIFETIME_SECONDS,
  createAccessToken,
} from "../../common/auth/access-token";
import { validateDtoBody } from "../../common/validation/validate-dto-body";
import { LoginInput } from "./dto/login.input";
import { UserInput } from "./dto/user.input";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

function publicUser(user: UserEntity) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UserController {
  private userService = new UserService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    const body = await validateDtoBody(req.body, UserInput);
    if (!body.valid) {
      res.status(400).json({ message: body.message });
      return;
    }

    try {
      const user = await this.userService.createUser(body.value);

      res.status(201).json({
        message: "User created successfully",
        data: publicUser(user),
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const body = await validateDtoBody(req.body, LoginInput);
    if (!body.valid) {
      res.status(400).json({ message: body.message });
      return;
    }

    try {
      const user = await this.userService.authenticateUser(
        body.value.email,
        body.value.password,
      );

      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      res.status(200).json({
        message: "Login successful",
        data: {
          accessToken: createAccessToken(user.id),
          tokenType: "Bearer",
          expiresIn: ACCESS_TOKEN_LIFETIME_SECONDS,
          user: publicUser(user),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
