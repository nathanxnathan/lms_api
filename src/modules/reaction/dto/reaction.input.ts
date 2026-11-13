import {
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { ContentTargetType } from "../../../common/types/content-target.type";

export class ReactionInput {
  @IsEnum(ContentTargetType)
  targetType!: ContentTargetType;

  @IsUUID()
  targetId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  value!: string;
}
