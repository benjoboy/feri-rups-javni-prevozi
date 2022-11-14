import "reflect-metadata"
import express from "express"
import cors from "cors"
import { routesRouter } from "./routes/routes"
import { AppDataSource } from "./data-source"

export const startServer = async () => {
	await AppDataSource.initialize()

	const app = express()
	app.use(cors())
	app.use(express.json())
	app.use("/api", routesRouter)

	app.listen(3002, () => {
		console.log("Server has started!🚀")
	})
}
