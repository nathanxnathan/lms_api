import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CourseEntity } from "../course/course.entity";
import { DepartmentEntity } from "../department/department.entity";
import { UserEntity } from "../user/user.entity";

export enum EnrollmentApplicationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity("enrollment_applications")
@Check(
  "CHK_enrollment_applications_status",
  `"status" IN ('pending', 'approved', 'rejected')`,
)
export class EnrollmentApplicationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "tracking_number", type: "varchar", length: 32, unique: true })
  trackingNumber!: string;

  @Column({ name: "first_name", type: "varchar", length: 100 })
  firstName!: string;

  @Column({ name: "last_name", type: "varchar", length: 100 })
  lastName!: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ name: "department_id", type: "uuid" })
  departmentId!: string;

  @ManyToOne(() => DepartmentEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "department_id" })
  department!: DepartmentEntity;

  @ManyToMany(() => CourseEntity)
  @JoinTable({
    name: "enrollment_application_courses",
    joinColumn: {
      name: "application_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: { name: "course_id", referencedColumnName: "id" },
  })
  courses!: CourseEntity[];

  @Column({
    type: "varchar",
    length: 20,
    default: EnrollmentApplicationStatus.PENDING,
  })
  status!: EnrollmentApplicationStatus;

  @Column({ name: "reviewed_by_id", type: "uuid", nullable: true })
  reviewedById!: string | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "reviewed_by_id" })
  reviewedBy!: UserEntity | null;

  @Column({ name: "approved_user_id", type: "uuid", nullable: true, unique: true })
  approvedUserId!: string | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "approved_user_id" })
  approvedUser!: UserEntity | null;

  @Column({ name: "reviewed_at", type: "timestamptz", nullable: true })
  reviewedAt!: Date | null;

  @Column({ name: "review_note", type: "varchar", length: 500, nullable: true })
  reviewNote!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
