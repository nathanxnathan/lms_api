import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserRoleToEnum1794268800000 implements MigrationInterface {
  name = "ChangeUserRoleToEnum1794268800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE character varying(30) USING "role"::text`,
    );
    await queryRunner.query(`DROP TYPE "users_role_enum"`);
  }
}
