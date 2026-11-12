import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
