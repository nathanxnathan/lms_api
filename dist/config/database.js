"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const env_1 = require("./env");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: env_1.env.DATABASE_URL,
    ssl: env_1.env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
    synchronize: false,
    logging: env_1.isProduction ? ['error'] : ['error', 'warn'],
    entities: [__dirname + '/../modules/**/*.entity.{ts,js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    subscribers: [],
    extra: {
        max: 20,
        min: 2,
    },
});
//# sourceMappingURL=database.js.map