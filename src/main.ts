import { AppDataSource } from "./config/database";

import { env } from "./config/env";
// import { createApp } from './app'; // Your HTTP app, once defined

async function main() {
  await AppDataSource.initialize();

  // const app = createApp();
  // app.listen(env.PORT, () => {
  //   console.log(`Server listening on port ${env.PORT}`);
  // });
}

main().catch((error: unknown) => {
  console.error("Application failed to start:", error);
  process.exitCode = 1;
});
