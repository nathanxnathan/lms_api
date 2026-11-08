import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database";
import { UserEntity } from "./user.entity";

export class UserRepository {
  private get repo(): Repository<UserEntity> {
    return AppDataSource.getRepository(UserEntity);
  }

  create(user: UserEntity): Promise<UserEntity> {
    return this.repo.save(user);
  }
}
