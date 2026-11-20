import { In } from "typeorm";
import { AppDataSource } from "../../config/database";
import { CourseEntity } from "./course.entity";
import { CourseRepository } from "./course.repository";
import { CourseInput } from "./dto/course.input";
import { DepartmentEntity } from "../department/department.entity";

export class CourseInputError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "CourseInputError";
  }
}

export class CourseService {
  async createCourse(input: CourseInput): Promise<CourseEntity> {
    const departments = await AppDataSource.getRepository(
      DepartmentEntity,
    ).findBy({ id: In(input.departmentIds) });

    if (departments.length !== new Set(input.departmentIds).size) {
      throw new CourseInputError(400, "One or more departments were not found");
    }

    const course = new CourseEntity();
    course.name = input.name;
    course.code = input.code;
    course.description = input.description ?? null;
    course.departments = departments;

    return new CourseRepository().create(course);
  }

  listCourses(departmentId?: string): Promise<CourseEntity[]> {
    const query = AppDataSource.getRepository(CourseEntity)
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.departments", "department");
    if (departmentId) {
      query.where("department.id = :departmentId", { departmentId });
    }
    return query
      .orderBy("course.code", "ASC")
      .getMany();
  }

  async setCourseDepartments(
    courseId: string,
    departmentIds: string[],
  ): Promise<CourseEntity> {
    const repository = AppDataSource.getRepository(CourseEntity);
    const course = await repository.findOne({
      where: { id: courseId },
      relations: { departments: true },
    });
    if (!course) {
      throw new CourseInputError(404, "Course was not found");
    }

    const departments = await AppDataSource.getRepository(
      DepartmentEntity,
    ).findBy({ id: In(departmentIds) });
    if (departments.length !== new Set(departmentIds).size) {
      throw new CourseInputError(400, "One or more departments were not found");
    }

    course.departments = departments;
    return repository.save(course);
  }
}
