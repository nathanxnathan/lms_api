import { MigrationInterface, QueryRunner } from "typeorm";

export class DescribeSchemaChange1795185010243 implements MigrationInterface {
    name = 'DescribeSchemaChange1795185010243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_department"`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" DROP CONSTRAINT "FK_enrollment_applications_department"`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" DROP CONSTRAINT "FK_enrollment_applications_reviewed_by"`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" DROP CONSTRAINT "FK_enrollment_applications_approved_user"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_user"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_course"`);
        await queryRunner.query(`ALTER TABLE "account_setup_tokens" DROP CONSTRAINT "FK_account_setup_tokens_user"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user_id"`);
        await queryRunner.query(`ALTER TABLE "course_departments" DROP CONSTRAINT "FK_course_departments_course"`);
        await queryRunner.query(`ALTER TABLE "course_departments" DROP CONSTRAINT "FK_course_departments_department"`);
        await queryRunner.query(`ALTER TABLE "enrollment_application_courses" DROP CONSTRAINT "FK_enrollment_application_courses_application"`);
        await queryRunner.query(`ALTER TABLE "enrollment_application_courses" DROP CONSTRAINT "FK_enrollment_application_courses_course"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_users_student_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_department_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_enrollment_applications_status_created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_enrollments_course_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_account_setup_tokens_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_course_departments_department_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_enrollment_application_courses_course_id"`);
        await queryRunner.query(`ALTER TABLE "assignments" ALTER COLUMN "resources" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_4bcc4fd204f448ad671c0747ab4" UNIQUE ("student_id")`);
        await queryRunner.query(`ALTER TABLE "materials" ALTER COLUMN "resources" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "resources" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "account_setup_tokens" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_d11cc0bb755186049541875308" ON "course_departments"  ("course_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_091fb64ee9a3471d13e9fa84c5" ON "course_departments"  ("department_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7e153465ff3dbaceb976624638" ON "enrollment_application_courses"  ("application_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f6ad52d3aeb7454b663d3a3a6f" ON "enrollment_application_courses"  ("course_id") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_0921d1972cf861d568f5271cd85" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" ADD CONSTRAINT "FK_a3be801ce248886c353341e6c0f" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" ADD CONSTRAINT "FK_cf6b4924378ac93ee380c4349e4" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" ADD CONSTRAINT "FK_924c041cc5ed0521e4e6e886e40" FOREIGN KEY ("approved_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_ff997f5a39cd24a491b9aca45c9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_setup_tokens" ADD CONSTRAINT "FK_c040859fbffac9f51b91f557224" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_departments" ADD CONSTRAINT "FK_d11cc0bb7551860495418753081" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "course_departments" ADD CONSTRAINT "FK_091fb64ee9a3471d13e9fa84c54" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "enrollment_application_courses" ADD CONSTRAINT "FK_7e153465ff3dbaceb9766246389" FOREIGN KEY ("application_id") REFERENCES "enrollment_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "enrollment_application_courses" ADD CONSTRAINT "FK_f6ad52d3aeb7454b663d3a3a6ff" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollment_application_courses" DROP CONSTRAINT "FK_f6ad52d3aeb7454b663d3a3a6ff"`);
        await queryRunner.query(`ALTER TABLE "enrollment_application_courses" DROP CONSTRAINT "FK_7e153465ff3dbaceb9766246389"`);
        await queryRunner.query(`ALTER TABLE "course_departments" DROP CONSTRAINT "FK_091fb64ee9a3471d13e9fa84c54"`);
        await queryRunner.query(`ALTER TABLE "course_departments" DROP CONSTRAINT "FK_d11cc0bb7551860495418753081"`);
        await queryRunner.query(`ALTER TABLE "account_setup_tokens" DROP CONSTRAINT "FK_c040859fbffac9f51b91f557224"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_ff997f5a39cd24a491b9aca45c9"`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" DROP CONSTRAINT "FK_924c041cc5ed0521e4e6e886e40"`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" DROP CONSTRAINT "FK_cf6b4924378ac93ee380c4349e4"`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" DROP CONSTRAINT "FK_a3be801ce248886c353341e6c0f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_0921d1972cf861d568f5271cd85"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6ad52d3aeb7454b663d3a3a6f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e153465ff3dbaceb976624638"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_091fb64ee9a3471d13e9fa84c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d11cc0bb755186049541875308"`);
        await queryRunner.query(`ALTER TABLE "account_setup_tokens" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "resources" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "materials" ALTER COLUMN "resources" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_4bcc4fd204f448ad671c0747ab4"`);
        await queryRunner.query(`ALTER TABLE "assignments" ALTER COLUMN "resources" SET DEFAULT '[]'`);
        await queryRunner.query(`CREATE INDEX "IDX_enrollment_application_courses_course_id" ON "enrollment_application_courses" USING btree ("course_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_course_departments_department_id" ON "course_departments" USING btree ("department_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_account_setup_tokens_user_id" ON "account_setup_tokens" USING btree ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_enrollments_course_id" ON "enrollments" USING btree ("course_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_enrollment_applications_status_created_at" ON "enrollment_applications" USING btree ("created_at", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_department_id" ON "users" USING btree ("department_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_student_id" ON "users" USING btree ("student_id") `);
        await queryRunner.query(`ALTER TABLE "enrollment_application_courses" ADD CONSTRAINT "FK_enrollment_application_courses_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment_application_courses" ADD CONSTRAINT "FK_enrollment_application_courses_application" FOREIGN KEY ("application_id") REFERENCES "enrollment_applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_departments" ADD CONSTRAINT "FK_course_departments_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_departments" ADD CONSTRAINT "FK_course_departments_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_setup_tokens" ADD CONSTRAINT "FK_account_setup_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_enrollments_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_enrollments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" ADD CONSTRAINT "FK_enrollment_applications_approved_user" FOREIGN KEY ("approved_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" ADD CONSTRAINT "FK_enrollment_applications_reviewed_by" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment_applications" ADD CONSTRAINT "FK_enrollment_applications_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
