import { AppDataSource } from "../config/database";
import { seedAdmin } from "./admin.seed";

async function main(): Promise<void> {
  await AppDataSource.initialize();

  try {
    await seedAdmin();
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

main().catch((error: unknown) => {
  console.error("Admin seed failed:", error);
  process.exitCode = 1;
});