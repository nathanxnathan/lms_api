import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class GradeInput {
  @IsUUID()
  assignmentId!: string;

  @IsUUID()
  studentId!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000000)
  score!: number;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  feedback?: string | null;
}
