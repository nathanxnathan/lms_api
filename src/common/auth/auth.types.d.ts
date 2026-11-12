import type { UserRole } from "../../modules/user/user.entity";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};
