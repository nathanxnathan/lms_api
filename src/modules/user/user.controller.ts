import type { Request, Response, NextFunction } from "express";
import {
  ACCESS_TOKEN_LIFETIME_SECONDS,
  createAccessToken,
} from "../../common/auth/access-token";
import { REFRESH_TOKEN_LIFETIME_SECONDS } from "../../common/auth/refresh-token";
import { validateDtoBody } from "../../common/validation/validate-dto-body";
import { LoginInput } from "./dto/login.input";
import { RefreshTokenInput } from "./dto/refresh-token.input";
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

      const refreshToken = await this.userService.createRefreshToken(user.id);
      res.status(200).json({
        message: "Login successful",
        data: {
          accessToken: createAccessToken(user.id),
          tokenType: "Bearer",
          expiresIn: ACCESS_TOKEN_LIFETIME_SECONDS,
          refreshToken,
          refreshExpiresIn: REFRESH_TOKEN_LIFETIME_SECONDS,
          user: publicUser(user),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    const body = await validateDtoBody(req.body, RefreshTokenInput);
    if (!body.valid) {
      res.status(400).json({ message: body.message });
      return;
    }

    try {
      const session = await this.userService.rotateRefreshToken(
        body.value.refreshToken,
      );
      if (!session) {
        res.status(401).json({ message: "Invalid or expired refresh token" });
        return;
      }

      res.status(200).json({
        message: "Token refreshed successfully",
        data: {
          accessToken: createAccessToken(session.user.id),
          tokenType: "Bearer",
          expiresIn: ACCESS_TOKEN_LIFETIME_SECONDS,
          refreshToken: session.refreshToken,
          refreshExpiresIn: REFRESH_TOKEN_LIFETIME_SECONDS,
          user: publicUser(session.user),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    const body = await validateDtoBody(req.body, RefreshTokenInput);
    if (!body.valid) {
      res.status(400).json({ message: body.message });
      return;
    }

    try {
      await this.userService.revokeRefreshToken(body.value.refreshToken);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
