import express from "express";

import { AppDataSource } from "./config/database";
import { env } from "./config/env";
import courseRoutes from "./modules/course/course.routes";
import departmentRoutes from "./modules/department/department.routes";
import userRoutes from "./modules/user/user.routes";

async function main() {
  await AppDataSource.initialize();

  const app = express();
  app.use(express.json({ limit: "16kb" }));
  app.use("/api/users", userRoutes);
  app.use("/api/departments", departmentRoutes);
  app.use("/api/courses", courseRoutes);

  app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
}

main().catch((error: unknown) => {
  console.error("Application failed to start:", error);
  process.exitCode = 1;
});
