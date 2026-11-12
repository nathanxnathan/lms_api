import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { MaxUtf8ByteLength } from "../../../common/validation/max-utf8-byte-length";

export class UserInput {
  @IsEmail({}, { message: "Email must be a valid email address" })
  @MaxLength(255)
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
  @MaxLength(72)
  @MaxUtf8ByteLength(72)
  password!: string;
}
