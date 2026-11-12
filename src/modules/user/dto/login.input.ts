import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { MaxUtf8ByteLength } from "../../../common/validation/max-utf8-byte-length";

export class LoginInput {
  @IsEmail({}, { message: "Email must be a valid email address" })
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(72)
  @MaxUtf8ByteLength(72)
  password!: string;
}
