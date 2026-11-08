import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class UserInput {
  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;
}
