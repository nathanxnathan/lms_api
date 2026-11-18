import bcrypt from "bcryptjs";
import { IsNull } from "typeorm";
import { AppDataSource } from "../../config/database";
import {
  createRefreshToken,
  hashRefreshToken,
  isRefreshTokenFormat,
  REFRESH_TOKEN_LIFETIME_SECONDS,
} from "../../common/auth/refresh-token";
import { UserEntity } from "./user.entity";
import { RefreshTokenEntity } from "./refresh-token.entity";

import { UserRepository } from "./user.respository";
import { UserInput } from "./dto/user.input";

const BCRYPT_SALT_ROUNDS = 12;

export class UserService {
  private async persistRefreshToken(
    userId: string,
    token: string,
    repository = AppDataSource.getRepository(RefreshTokenEntity),
  ): Promise<void> {
    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_LIFETIME_SECONDS * 1000,
    );
    await repository.save(
      repository.create({
        userId,
        tokenHash: hashRefreshToken(token),
        expiresAt,
        revokedAt: null,
      }),
    );
  }

  async createRefreshToken(userId: string): Promise<string> {
    const token = createRefreshToken();
    await this.persistRefreshToken(userId, token);
    return token;
  }

  async rotateRefreshToken(
    token: string,
  ): Promise<{ user: UserEntity; refreshToken: string } | null> {
    if (!isRefreshTokenFormat(token)) {
      return null;
    }

    const tokenHash = hashRefreshToken(token);
    return AppDataSource.transaction(async (manager) => {
      const refreshTokenRepository =
        manager.getRepository(RefreshTokenEntity);
      const currentToken = await refreshTokenRepository.findOne({
        where: { tokenHash, revokedAt: IsNull() },
        lock: { mode: "pessimistic_write" },
      });

      const now = new Date();
      if (!currentToken || currentToken.expiresAt <= now) {
        return null;
      }

      currentToken.revokedAt = now;
      await refreshTokenRepository.save(currentToken);

      const user = await manager.getRepository(UserEntity).findOne({
        where: {
          id: currentToken.userId,
          isActive: true,
          deletedAt: IsNull(),
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return null;
      }

      const refreshToken = createRefreshToken();
      await this.persistRefreshToken(
        user.id,
        refreshToken,
        refreshTokenRepository,
      );
      return { user, refreshToken };
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    if (!isRefreshTokenFormat(token)) {
      return;
    }

    await AppDataSource.getRepository(RefreshTokenEntity).update(
      { tokenHash: hashRefreshToken(token), revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async createUser(userInput: UserInput): Promise<UserEntity> {
    const user = new UserEntity();
    user.email = userInput.email.trim().toLowerCase();
    user.firstName = userInput.firstName;
    user.lastName = userInput.lastName;
    user.passwordHash = await bcrypt.hash(
      userInput.password,
      BCRYPT_SALT_ROUNDS,
    );
    user.isActive = true;

    const userRepository = new UserRepository();
    return userRepository.create(user);
  }

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const userRepository = new UserRepository();
    const user = await userRepository.findByEmailForLogin(email.trim());

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches || !user.isActive || user.deletedAt) {
      return null;
    }

    return user;
  }
}
