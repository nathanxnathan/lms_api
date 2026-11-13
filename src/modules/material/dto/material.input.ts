import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { IsLearningResources } from "../../../common/validation/learning-resources";
import type { LearningResource } from "../../../common/types/learning-resource.type";

export class MaterialInput {
  @IsUUID()
  courseId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string | null;

  @IsLearningResources()
  resources!: LearningResource[];
}
