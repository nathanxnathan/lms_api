import bcrypt from "bcryptjs";

import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.respository";
import { UserInput } from "./dto/user.input";

const BCRYPT_SALT_ROUNDS = 12;

export class UserService {
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
