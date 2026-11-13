import type { LearningResource } from "../../../common/types/learning-resource.type";

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  responseText: string | null;
  resources: LearningResource[];
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
