import type { LearningResource } from "../../../common/types/learning-resource.type";

export interface Assignment {
  id: string;
  courseId: string;
  createdById: string;
  title: string;
  description: string | null;
  resources: LearningResource[];
  dueAt: Date | null;
  maxScore: number;
  createdAt: Date;
  updatedAt: Date;
}
