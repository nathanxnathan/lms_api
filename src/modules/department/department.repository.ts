import { AppDataSource } from "../../config/database";
import { DepartmentEntity } from "./department.entity";

export class DepartmentRepository {
  create(department: DepartmentEntity): Promise<DepartmentEntity> {
    return AppDataSource.getRepository(DepartmentEntity).save(department);
  }
}
