import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("departments")
export class DepartmentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 50 })
  code!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;
}