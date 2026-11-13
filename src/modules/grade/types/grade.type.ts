export interface Grade {
  id: string;
  assignmentId: string;
  studentId: string;
  gradedById: string | null;
  score: number;
  feedback: string | null;
  gradedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
