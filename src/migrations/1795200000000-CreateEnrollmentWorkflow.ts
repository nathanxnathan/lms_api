import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEnrollmentWorkflow1795200000000
  implements MigrationInterface
{
  name = "CreateEnrollmentWorkflow1795200000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "users_role_enum" ADD VALUE 'student'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "student_id" character varying(32)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_users_student_id" ON "users" ("student_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "must_set_password" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "department_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_department_id" ON "users" ("department_id")`,
    );
    await queryRunner.query(
      `CREATE TABLE "course_departments" ("course_id" uuid NOT NULL, "department_id" uuid NOT NULL, CONSTRAINT "PK_course_departments" PRIMARY KEY ("course_id", "department_id"), CONSTRAINT "FK_course_departments_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE, CONSTRAINT "FK_course_departments_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_course_departments_department_id" ON "course_departments" ("department_id")`,
    );
    await queryRunner.query(
      `CREATE TABLE "enrollment_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tracking_number" character varying(32) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "department_id" uuid NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "reviewed_by_id" uuid, "approved_user_id" uuid, "reviewed_at" TIMESTAMP WITH TIME ZONE, "review_note" character varying(500), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_enrollment_applications_tracking_number" UNIQUE ("tracking_number"), CONSTRAINT "UQ_enrollment_applications_approved_user_id" UNIQUE ("approved_user_id"), CONSTRAINT "CHK_enrollment_applications_status" CHECK ("status" IN ('pending', 'approved', 'rejected')), CONSTRAINT "PK_enrollment_applications_id" PRIMARY KEY ("id"), CONSTRAINT "FK_enrollment_applications_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT, CONSTRAINT "FK_enrollment_applications_reviewed_by" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL, CONSTRAINT "FK_enrollment_applications_approved_user" FOREIGN KEY ("approved_user_id") REFERENCES "users"("id") ON DELETE SET NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_enrollment_applications_status_created_at" ON "enrollment_applications" ("status", "created_at")`,
    );
    await queryRunner.query(
      `CREATE TABLE "enrollment_application_courses" ("application_id" uuid NOT NULL, "course_id" uuid NOT NULL, CONSTRAINT "PK_enrollment_application_courses" PRIMARY KEY ("application_id", "course_id"), CONSTRAINT "FK_enrollment_application_courses_application" FOREIGN KEY ("application_id") REFERENCES "enrollment_applications"("id") ON DELETE CASCADE, CONSTRAINT "FK_enrollment_application_courses_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_enrollment_application_courses_course_id" ON "enrollment_application_courses" ("course_id")`,
    );
    await queryRunner.query(
      `CREATE TABLE "enrollments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "course_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_enrollments_user_course" UNIQUE ("user_id", "course_id"), CONSTRAINT "PK_enrollments_id" PRIMARY KEY ("id"), CONSTRAINT "FK_enrollments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE, CONSTRAINT "FK_enrollments_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_enrollments_course_id" ON "enrollments" ("course_id")`,
    );
    await queryRunner.query(
      `CREATE TABLE "account_setup_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token_hash" character varying(64) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_account_setup_tokens_token_hash" UNIQUE ("token_hash"), CONSTRAINT "PK_account_setup_tokens_id" PRIMARY KEY ("id"), CONSTRAINT "FK_account_setup_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_account_setup_tokens_user_id" ON "account_setup_tokens" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_account_setup_tokens_user_id"`);
    await queryRunner.query(`DROP TABLE "account_setup_tokens"`);
    await queryRunner.query(`DROP INDEX "IDX_enrollments_course_id"`);
    await queryRunner.query(`DROP TABLE "enrollments"`);
    await queryRunner.query(
      `DROP INDEX "IDX_enrollment_application_courses_course_id"`,
    );
    await queryRunner.query(`DROP TABLE "enrollment_application_courses"`);
    await queryRunner.query(
      `DROP INDEX "IDX_enrollment_applications_status_created_at"`,
    );
    await queryRunner.query(`DROP TABLE "enrollment_applications"`);
    await queryRunner.query(
      `DROP INDEX "IDX_course_departments_department_id"`,
    );
    await queryRunner.query(`DROP TABLE "course_departments"`);
    await queryRunner.query(`DROP INDEX "IDX_users_department_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_department"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "department_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "must_set_password"`,
    );
    await queryRunner.query(`DROP INDEX "UQ_users_student_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "student_id"`);
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'user' WHERE "role" = 'student'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE character varying(30) USING "role"::text`,
    );
    await queryRunner.query(`DROP TYPE "users_role_enum"`);
    await queryRunner.query(
      `CREATE TYPE "users_role_enum" AS ENUM('admin', 'user', 'instructor')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "users_role_enum" USING "role"::text::"users_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'`,
    );
  }
}
