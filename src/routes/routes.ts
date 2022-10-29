import express from "express"
import { stationRouter } from "./station/station.route"

export const routesRouter = express.Router()

routesRouter.use("/lists", stationRouter)

routesRouter.use("/station", stationRouter)
