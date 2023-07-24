import { DataSource, DataSourceOptions } from "typeorm";

const options: DataSourceOptions = {
  type: "postgres",
  entities: ["src/**/**/entities/**/*.ts"],
  synchronize: false,
  migrations: ["src/**/**/migrations/**/*.ts"],
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export default new DataSource(options);
