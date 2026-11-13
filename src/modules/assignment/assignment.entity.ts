import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { LearningResource } from "../../common/types/learning-resource.type";

@Entity("assignments")
export class AssignmentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "course_id", type: "uuid" })
  courseId!: string;

  @Column({ name: "created_by_id", type: "uuid" })
  createdById!: string;

  @Column({ type: "varchar", length: 150 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "jsonb",
    default: () => "'[]'::jsonb",
  })
  resources!: LearningResource[];

  @Column({ name: "due_at", type: "timestamptz", nullable: true })
  dueAt!: Date | null;

  @Column({
    name: "max_score",
    type: "double precision",
    default: 100,
  })
  maxScore!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
