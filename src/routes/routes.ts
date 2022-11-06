import express from "express"
import { poblicRouter } from "./public/public.route"
import { stationRouter } from "./station/station.route"

export const routesRouter = express.Router()

routesRouter.use("/public", poblicRouter)

routesRouter.use("/station", stationRouter)
