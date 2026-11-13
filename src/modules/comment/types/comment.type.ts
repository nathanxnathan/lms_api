import type { ContentTargetType } from "../../../common/types/content-target.type";

export interface Comment {
  id: string;
  authorId: string;
  targetType: ContentTargetType;
  targetId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}
