import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { CourseEntity } from "../course/course.entity";
import { UserEntity } from "../user/user.entity";

@Entity("enrollments")
@Unique("UQ_enrollments_user_course", ["userId", "courseId"])
export class EnrollmentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ name: "course_id", type: "uuid" })
  courseId!: string;

  @ManyToOne(() => CourseEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
