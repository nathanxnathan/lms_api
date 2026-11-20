import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { EntityManager, In, Repository } from "typeorm";
import { AppDataSource } from "../../config/database";
import { CourseEntity } from "../course/course.entity";
import { DepartmentEntity } from "../department/department.entity";
import { AccountSetupTokenEntity } from "../user/account-setup-token.entity";
import { UserEntity, UserRole } from "../user/user.entity";
import { EnrollmentEntity } from "./enrollment.entity";
import {
  EnrollmentApplicationEntity,
  EnrollmentApplicationStatus,
} from "./enrollment-application.entity";

const BCRYPT_SALT_ROUNDS = 12;
const ACCOUNT_SETUP_LIFETIME_MS = 24 * 60 * 60 * 1000;

export class EnrollmentWorkflowError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "EnrollmentWorkflowError";
  }
}

export class EnrollmentService {
  async createApplication(input: {
    firstName: string;
    lastName: string;
    email: string;
    departmentId: string;
    courseIds: string[];
  }): Promise<EnrollmentApplicationEntity> {
    const email = input.email.trim().toLowerCase();
    const departmentRepository =
      AppDataSource.getRepository(DepartmentEntity);
    const department = await departmentRepository.findOneBy({
      id: input.departmentId,
    });
    if (!department) {
      throw new EnrollmentWorkflowError(400, "Department was not found");
    }

    const courses = await AppDataSource.getRepository(CourseEntity).find({
      where: { id: In(input.courseIds) },
      relations: { departments: true },
    });
    if (
      courses.length !== input.courseIds.length ||
      courses.some(
        (course) =>
          !course.departments.some(
            (courseDepartment) => courseDepartment.id === department.id,
          ),
      )
    ) {
      throw new EnrollmentWorkflowError(
        400,
        "Each selected course must be available to the selected department",
      );
    }

    const existingApplication = await AppDataSource.getRepository(
      EnrollmentApplicationEntity,
    ).findOneBy({
      email,
      status: EnrollmentApplicationStatus.PENDING,
    });
    if (existingApplication) {
      throw new EnrollmentWorkflowError(
        409,
        "A pending application already exists for this email",
      );
    }

    const application = new EnrollmentApplicationEntity();
    application.trackingNumber = randomBytes(16).toString("hex").toUpperCase();
    application.firstName = input.firstName.trim();
    application.lastName = input.lastName.trim();
    application.email = email;
    application.department = department;
    application.departmentId = department.id;
    application.courses = courses;
    application.status = EnrollmentApplicationStatus.PENDING;

    return AppDataSource.getRepository(EnrollmentApplicationEntity).save(
      application,
    );
  }

  async getStatus(trackingNumber: string): Promise<EnrollmentApplicationEntity> {
    const application = await AppDataSource.getRepository(
      EnrollmentApplicationEntity,
    ).findOne({
      where: { trackingNumber },
      select: {
        id: true,
        trackingNumber: true,
        status: true,
        reviewNote: true,
        createdAt: true,
        reviewedAt: true,
      },
    });
    if (!application) {
      throw new EnrollmentWorkflowError(404, "Application was not found");
    }
    return application;
  }

  listPendingApplications(page: number): Promise<EnrollmentApplicationEntity[]> {
    return AppDataSource.getRepository(EnrollmentApplicationEntity).find({
      where: { status: EnrollmentApplicationStatus.PENDING },
      relations: { department: true, courses: true },
      order: { createdAt: "ASC" },
      take: 100,
      skip: (page - 1) * 100,
    });
  }

  async approveApplication(
    applicationId: string,
    adminId: string,
  ): Promise<{
    application: EnrollmentApplicationEntity;
    user: UserEntity;
    studentId: string;
    setupToken: string | null;
  }> {
    return AppDataSource.transaction(async (manager) => {
      const applicationRepository = manager.getRepository(
        EnrollmentApplicationEntity,
      );
      const application = await applicationRepository.findOne({
        where: { id: applicationId },
        lock: { mode: "pessimistic_write" },
      });
      if (!application) {
        throw new EnrollmentWorkflowError(404, "Application was not found");
      }
      if (application.status !== EnrollmentApplicationStatus.PENDING) {
        throw new EnrollmentWorkflowError(
          409,
          "Only pending applications can be approved",
        );
      }

      const applicationWithRelations = await applicationRepository.findOne({
        where: { id: applicationId },
        relations: { department: true, courses: { departments: true } },
      });
      if (!applicationWithRelations) {
        throw new EnrollmentWorkflowError(404, "Application was not found");
      }
      application.department = applicationWithRelations.department;
      application.courses = applicationWithRelations.courses;

      if (
        application.courses.length === 0 ||
        application.courses.some(
          (course) =>
            !course.departments.some(
              (department) => department.id === application.departmentId,
            ),
        )
      ) {
        throw new EnrollmentWorkflowError(
          409,
          "The application contains courses unavailable to its department",
        );
      }

      const userRepository = manager.getRepository(UserEntity);
      let user = await userRepository.findOne({
        where: { email: application.email },
        withDeleted: true,
      });
      if (user?.deletedAt) {
        throw new EnrollmentWorkflowError(
          409,
          "A deleted account already uses this applicant email",
        );
      }
      if (
        user &&
        (user.role === UserRole.ADMIN || user.role === UserRole.INSTRUCTOR)
      ) {
        throw new EnrollmentWorkflowError(
          409,
          "This email belongs to an account that cannot be converted to a student",
        );
      }
      if (user?.role === UserRole.STUDENT && user.studentId) {
        throw new EnrollmentWorkflowError(
          409,
          "This applicant already has a student account",
        );
      }
      if (user && !user.isActive) {
        throw new EnrollmentWorkflowError(
          409,
          "The existing account is inactive",
        );
      }

      const studentId = await this.generateStudentId(userRepository);
      if (!user) {
        user = userRepository.create({
          email: application.email,
          firstName: application.firstName,
          lastName: application.lastName,
          passwordHash: await bcrypt.hash(
            randomBytes(32).toString("base64url"),
            BCRYPT_SALT_ROUNDS,
          ),
          role: UserRole.STUDENT,
          studentId,
          mustSetPassword: true,
          departmentId: application.departmentId,
          department: application.department,
          isActive: true,
        });
      } else {
        user.role = UserRole.STUDENT;
        user.studentId = studentId;
        user.departmentId = application.departmentId;
        user.department = application.department;
      }
      user = await userRepository.save(user);
      const assignedStudentId = user.studentId;
      if (!assignedStudentId) {
        throw new EnrollmentWorkflowError(
          500,
          "Approved student is missing a student ID",
        );
      }

      const courseIds = application.courses.map((course) => course.id);
      const existingEnrollments = await manager
        .getRepository(EnrollmentEntity)
        .find({
          where: { userId: user.id, courseId: In(courseIds) },
        });
      if (existingEnrollments.length > 0) {
        throw new EnrollmentWorkflowError(
          409,
          "The applicant is already enrolled in one or more selected courses",
        );
      }

      await manager.getRepository(EnrollmentEntity).save(
        application.courses.map((course) =>
          manager.getRepository(EnrollmentEntity).create({
            userId: user.id,
            courseId: course.id,
          }),
        ),
      );

      application.status = EnrollmentApplicationStatus.APPROVED;
      application.reviewedById = adminId;
      application.approvedUserId = user.id;
      application.reviewedAt = new Date();
      await applicationRepository.save(application);

      const setupToken = user.mustSetPassword
        ? await this.createSetupToken(manager, user.id)
        : null;

      return {
        application,
        user,
        studentId: assignedStudentId,
        setupToken,
      };
    });
  }

  async rejectApplication(
    applicationId: string,
    adminId: string,
    reviewNote: string | undefined,
  ): Promise<EnrollmentApplicationEntity> {
    return AppDataSource.transaction(async (manager) => {
      const repository = manager.getRepository(EnrollmentApplicationEntity);
      const application = await repository.findOne({
        where: { id: applicationId },
        lock: { mode: "pessimistic_write" },
      });
      if (!application) {
        throw new EnrollmentWorkflowError(404, "Application was not found");
      }
      if (application.status !== EnrollmentApplicationStatus.PENDING) {
        throw new EnrollmentWorkflowError(
          409,
          "Only pending applications can be rejected",
        );
      }

      application.status = EnrollmentApplicationStatus.REJECTED;
      application.reviewedById = adminId;
      application.reviewedAt = new Date();
      application.reviewNote = reviewNote?.trim() || null;
      return repository.save(application);
    });
  }

  async prepareApprovalEmail(applicationId: string): Promise<{
    user: UserEntity;
    studentId: string;
    setupToken: string | null;
  }> {
    return AppDataSource.transaction(async (manager) => {
      const application = await manager
        .getRepository(EnrollmentApplicationEntity)
        .findOne({
          where: { id: applicationId },
          lock: { mode: "pessimistic_write" },
        });
      if (
        !application ||
        application.status !== EnrollmentApplicationStatus.APPROVED ||
        !application.approvedUserId
      ) {
        throw new EnrollmentWorkflowError(
          404,
          "Approved student application was not found",
        );
      }
      const user = await manager.getRepository(UserEntity).findOneBy({
        id: application.approvedUserId,
      });
      if (!user) {
        throw new EnrollmentWorkflowError(
          404,
          "Approved student account was not found",
        );
      }
      const studentId = user.studentId;
      if (!studentId) {
        throw new EnrollmentWorkflowError(
          500,
          "Approved student is missing a student ID",
        );
      }
      const setupToken = user.mustSetPassword
        ? await this.createSetupToken(
            manager,
            user.id,
          )
        : null;
      return { user, studentId, setupToken };
    });
  }

  private async generateStudentId(
    userRepository: Repository<UserEntity>,
  ): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const studentId = `STU-${randomBytes(6).toString("hex").toUpperCase()}`;
      const exists = await userRepository.exists({ where: { studentId } });
      if (!exists) {
        return studentId;
      }
    }
    throw new EnrollmentWorkflowError(
      503,
      "Could not allocate a student ID; please retry",
    );
  }

  private async createSetupToken(
    manager: EntityManager,
    userId: string,
  ): Promise<string> {
    const repository = manager.getRepository(AccountSetupTokenEntity);
    const now = new Date();
    await repository
      .createQueryBuilder()
      .update()
      .set({ usedAt: now })
      .where('"user_id" = :userId AND "used_at" IS NULL', { userId })
      .execute();

    const token = randomBytes(32).toString("base64url");
    await repository.save(
      repository.create({
        user: { id: userId },
        tokenHash: createHash("sha256").update(token).digest("hex"),
        expiresAt: new Date(now.getTime() + ACCOUNT_SETUP_LIFETIME_MS),
        usedAt: null,
      }),
    );
    return token;
  }
}
