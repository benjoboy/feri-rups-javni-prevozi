import express from "express"
import { poblicRouter } from "./public/public.route"
import { stationRouter } from "./station/station.route"
import { noticeRouter } from "./notice/notice.route"

export const routesRouter = express.Router()

routesRouter.use("/public", poblicRouter)

routesRouter.use("/notice", noticeRouter)

routesRouter.use("/station", stationRouter)
