import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { IsLearningResources } from "../../../common/validation/learning-resources";
import type { LearningResource } from "../../../common/types/learning-resource.type";

export class SubmissionInput {
  @IsUUID()
  assignmentId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  responseText?: string | null;

  @IsOptional()
  @IsLearningResources()
  resources?: LearningResource[];
}
