import type { LearningResource } from "../../../common/types/learning-resource.type";

export interface Material {
  id: string;
  courseId: string;
  createdById: string;
  title: string;
  description: string | null;
  resources: LearningResource[];
  createdAt: Date;
  updatedAt: Date;
}
