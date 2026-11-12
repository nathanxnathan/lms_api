import { DepartmentEntity } from "./department.entity";
import { DepartmentRepository } from "./department.repository";
import { DepartmentInput } from "./dto/department.input";

export class DepartmentService {
  async createDepartment(
    input: DepartmentInput,
  ): Promise<DepartmentEntity> {
    const department = new DepartmentEntity();
    department.name = input.name;
    department.code = input.code;
    department.description = input.description ?? null;

    return new DepartmentRepository().create(department);
  }
}
