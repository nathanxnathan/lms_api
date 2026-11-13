import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ContentTargetType } from "../../common/types/content-target.type";

@Entity("comments")
export class CommentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "author_id", type: "uuid" })
  authorId!: string;

  @Column({ name: "target_type", type: "enum", enum: ContentTargetType })
  targetType!: ContentTargetType;

  @Column({ name: "target_id", type: "uuid" })
  targetId!: string;

  @Column({ type: "text" })
  body!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
