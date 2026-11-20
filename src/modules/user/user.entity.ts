import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { DepartmentEntity } from "../department/department.entity";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  INSTRUCTOR = "instructor",
  STUDENT = "student",
}

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "first_name", type: "varchar", length: 100 })
  firstName!: string;

  @Column({ name: "last_name", type: "varchar", length: 100 })
  lastName!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ name: "password_hash", type: "text", select: false })
  passwordHash!: string;

  @Column({
    name: "student_id",
    type: "varchar",
    length: 32,
    nullable: true,
    unique: true,
  })
  studentId!: string | null;

  @Column({ name: "must_set_password", type: "boolean", default: false })
  mustSetPassword!: boolean;

  @Column({ name: "department_id", type: "uuid", nullable: true })
  departmentId!: string | null;

  @ManyToOne(() => DepartmentEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "department_id" })
  department!: DepartmentEntity | null;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: "deleted_at",
    type: "timestamptz",
    nullable: true,
  })
  deletedAt!: Date | null;
}
