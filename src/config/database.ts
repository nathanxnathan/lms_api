import "reflect-metadata";

import { DataSource } from "typeorm";
import { env, isProduction } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: isProduction ? ["error"] : ["error", "warn"],
  entities: [__dirname + "/../modules/**/*.entity.{ts,js}"],
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  subscribers: [],
  extra: {
    max: 20,
    min: 2,
  },
});
