import "reflect-metadata";

import { DataSource } from "typeorm";

import { UserEntity } from "../domains/users/entities/user.entity";
import { CreateUsersTable2026071600000 } from "./migrations/2026071600000-CreateUsersTable";

const useSsl = process.env.POSTGRES_SSL === "true";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "localhost",
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER ?? "base_system",
  password: process.env.POSTGRES_PASSWORD ?? "base_system_local",
  database: process.env.POSTGRES_DB ?? "base_system",
  entities: [UserEntity],
  migrations: [CreateUsersTable2026071600000],
  synchronize: false,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});
