import { AppDataSource } from "../../config/database";
import { CourseEntity } from "./course.entity";

export class CourseRepository {
  create(course: CourseEntity): Promise<CourseEntity> {
    return AppDataSource.getRepository(CourseEntity).save(course);
  }
}
