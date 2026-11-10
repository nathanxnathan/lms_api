import bcrypt from "bcryptjs";

import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.respository";
import { UserInput } from "./dto/user.input";

const BCRYPT_SALT_ROUNDS = 12;

export class UserService {
  async createUser(userInput: UserInput): Promise<UserEntity> {
    const dto = userInput;
    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS)
      : null;
    const user = new UserEntity();
    user.email = userInput.email;
    user.firstName = userInput.firstName;
    user.lastName = userInput.lastName;
    user.passwordHash = passwordHash!;
    user.isActive = true;

    const userRepository = new UserRepository();
    return userRepository.create(user);
  }
}
