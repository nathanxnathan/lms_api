import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../config/database";
import { UserEntity } from "./user.entity";

export class UserRepository {
  private get repo(): Repository<UserEntity> {
    return AppDataSource.getRepository(UserEntity);
  }

  create(user: UserEntity): Promise<UserEntity> {
    return this.repo.save(user);
  }

  findByEmailForLogin(email: string): Promise<UserEntity | null> {
    return this.repo
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("LOWER(user.email) = :email", { email: email.toLowerCase() })
      .getOne();
  }

  findActiveById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { id, isActive: true, deletedAt: IsNull() },
      select: { id: true, role: true },
    });
  }
}
