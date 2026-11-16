import { validate } from "class-validator";
import { UserEntity, UserRole } from "../modules/user/user.entity";
import { UserInput } from "../modules/user/dto/user.input";
import { AppDataSource } from "../config/database";
import { UserRepository } from "../modules/user/user.respository";
import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 12;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} must be set to seed the admin user`);
  }
  return value;
}

export async function seedAdmin(): Promise<void> {
  const userInput = Object.assign(new UserInput(), {
    email: requiredEnv("ADMIN_EMAIL").toLowerCase(),
    password: process.env.ADMIN_PASSWORD,
    firstName: requiredEnv("ADMIN_FIRST_NAME"),
    lastName: requiredEnv("ADMIN_LAST_NAME"),
  });

  if (typeof userInput.password !== "string") {
    throw new Error("ADMIN_PASSWORD must be set to seed the admin user");
  }

  const validationErrors = await validate(userInput);
  if (validationErrors.length > 0) {
    const messages = validationErrors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );
    throw new Error(`Invalid admin seed configuration: ${messages.join("; ")}`);
  }

  const userRepository = AppDataSource.getRepository(UserEntity);
  const existingUser = await userRepository.findOne({
    where: { email: userInput.email },
    withDeleted: true,
  });

  if (existingUser) {
    if (existingUser.deletedAt) {
      throw new Error(
        `A deleted user already exists with ADMIN_EMAIL (${userInput.email})`,
      );
    }

    if (existingUser.role !== UserRole.ADMIN) {
      throw new Error(
        `A non-admin user already exists with ADMIN_EMAIL (${userInput.email})`,
      );
    }

    console.log("Admin user already exists; no changes made.");
    return;
  }

  const user = new UserEntity();
  user.email = userInput.email;
  user.firstName = userInput.firstName;
  user.lastName = userInput.lastName;
  user.passwordHash = await bcrypt.hash(userInput.password, BCRYPT_SALT_ROUNDS);
  user.role = UserRole.ADMIN;
  user.isActive = true;

  await new UserRepository().create(user);
  console.log("Admin user created successfully.");
}