import {
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class AnnouncementInput {
  @IsUUID()
  courseId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(150)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  content!: string;
}
