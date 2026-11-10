import express from "express";

import { AppDataSource } from "./config/database";
import { env } from "./config/env";
import userRoutes from "./modules/user/user.routes";

async function main() {
  await AppDataSource.initialize();

  const app = express();
  app.use(express.json());
  app.use("/api/users", userRoutes);

  app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
}

main().catch((error: unknown) => {
  console.error("Application failed to start:", error);
  process.exitCode = 1;
});
