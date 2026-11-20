import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsUUID,
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

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  departmentIds!: string[];
}
