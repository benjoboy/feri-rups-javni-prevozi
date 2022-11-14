import { Router } from "express"
import stationController from "../../controllers/station.controller"

export const stationRouter: Router = Router()

stationRouter.get("/nearest", stationController.nearestStation)

stationRouter.get("/lines", stationController.getLines)

stationRouter.post("/", stationController.importStations)

stationRouter.get("/:name?", stationController.getAll)
