import type { ContentTargetType } from "../../../common/types/content-target.type";

export interface Reaction {
  id: string;
  userId: string;
  targetType: ContentTargetType;
  targetId: string;
  value: string;
  createdAt: Date;
}
