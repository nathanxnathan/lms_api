import { CourseEntity } from "./course.entity";
import { CourseRepository } from "./course.repository";
import { CourseInput } from "./dto/course.input";

export class CourseService {
  async createCourse(input: CourseInput): Promise<CourseEntity> {
    const course = new CourseEntity();
    course.name = input.name;
    course.code = input.code;
    course.description = input.description ?? null;

    return new CourseRepository().create(course);
  }
}
