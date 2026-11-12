import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class DepartmentInput {
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
  @MaxLength(200)
  description?: string | null;
}
