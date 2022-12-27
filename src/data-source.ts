import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
	type: "postgres",
	host:
		process.env.NODE_ENV?.trim() === "development"
			? "localhost"
			: process.env.DB_HOST,
	port: 5432,
	username:
		process.env.NODE_ENV?.trim() === "development"
			? "postgres"
			: process.env.DB_USER,
	password:
		process.env.NODE_ENV?.trim() === "development"
			? "example"
			: process.env.DB_PASS,
	database:
		process.env.NODE_ENV?.trim() === "development"
			? "postgres"
			: process.env.DB_NAME,
	schema:
		process.env.NODE_ENV?.trim() === "development"
			? "public"
			: process.env.SCHEMA_NAME,
	synchronize: true,
	logging: true,
	entities: [
		process.env.NODE_ENV?.trim() === "development"
			? "./src/entities/**/*.ts"
			: "./dist/entities/**/*.js",
	],
	migrations: [],
	subscribers: [],
	poolErrorHandler: console.log,
})
