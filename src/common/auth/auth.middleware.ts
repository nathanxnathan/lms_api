import type { RequestHandler, Response } from "express";
import { UserRepository } from "../../modules/user/user.respository";
import { UserRole } from "../../modules/user/user.entity";
import { verifyAccessToken } from "./access-token";

const unauthorized = (res: Response) => {
  res.status(401).json({ message: "Authentication required" });
};

export const authenticate: RequestHandler = async (req, res, next) => {
  const authorization = req.header("authorization");
  const match = authorization && /^Bearer ([^\s]+)$/i.exec(authorization);
  const userId = match?.[1] ? verifyAccessToken(match[1]) : null;

  if (!userId) {
    unauthorized(res);
    return;
  }

  try {
    const user = await new UserRepository().findActiveById(userId);

    if (!user) {
      unauthorized(res);
      return;
    }

    req.authUser = { id: user.id, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!req.authUser) {
    unauthorized(res);
    return;
  }

  if (req.authUser.role !== UserRole.ADMIN) {
    res.status(403).json({ message: "Administrator access required" });
    return;
  }

  next();
};
