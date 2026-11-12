import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CourseInput {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  description?: string | null;
}
