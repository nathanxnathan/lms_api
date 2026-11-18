import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RefreshTokenInput {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^[A-Za-z0-9_-]{43}$/, { message: "Invalid refresh token" })
  refreshToken!: string;
}
