import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepartmentsAndCourses1794432000000
  implements MigrationInterface
{
  name = "CreateDepartmentsAndCourses1794432000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "departments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(50) NOT NULL, "description" text, CONSTRAINT "PK_departments_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(50) NOT NULL, "description" text, CONSTRAINT "PK_courses_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "departments"`);
  }
}
