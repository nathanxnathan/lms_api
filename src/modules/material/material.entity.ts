import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { LearningResource } from "../../common/types/learning-resource.type";

@Entity("materials")
export class MaterialEntity {
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

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
