import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("grades")
export class GradeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "assignment_id", type: "uuid" })
  assignmentId!: string;

  @Column({ name: "student_id", type: "uuid" })
  studentId!: string;

  @Column({ name: "graded_by_id", type: "uuid", nullable: true })
  gradedById!: string | null;

  @Column({ type: "double precision" })
  score!: number;

  @Column({ type: "text", nullable: true })
  feedback!: string | null;

  @Column({ name: "graded_at", type: "timestamptz", nullable: true })
  gradedAt!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
