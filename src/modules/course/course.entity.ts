import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DepartmentEntity } from "../department/department.entity";

@Entity("courses")
export class CourseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 50 })
  code!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @ManyToMany(() => DepartmentEntity, (department) => department.courses)
  @JoinTable({
    name: "course_departments",
    joinColumn: { name: "course_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "department_id", referencedColumnName: "id" },
  })
  departments!: DepartmentEntity[];
}
