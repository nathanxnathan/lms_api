import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { LearningResource } from "../../common/types/learning-resource.type";

@Entity("submissions")
export class SubmissionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "assignment_id", type: "uuid" })
  assignmentId!: string;

  @Column({ name: "student_id", type: "uuid" })
  studentId!: string;

  @Column({ name: "response_text", type: "text", nullable: true })
  responseText!: string | null;

  @Column({
    type: "jsonb",
    default: () => "'[]'::jsonb",
  })
  resources!: LearningResource[];

  @Column({ name: "submitted_at", type: "timestamptz" })
  submittedAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
