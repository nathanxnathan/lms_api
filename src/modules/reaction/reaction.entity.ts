import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContentTargetType } from "../../common/types/content-target.type";

@Entity("reactions")
@Index("UQ_reactions_user_target", ["userId", "targetType", "targetId"], {
  unique: true,
})
export class ReactionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "target_type", type: "enum", enum: ContentTargetType })
  targetType!: ContentTargetType;

  @Column({ name: "target_id", type: "uuid" })
  targetId!: string;

  @Column({ type: "varchar", length: 32 })
  value!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
