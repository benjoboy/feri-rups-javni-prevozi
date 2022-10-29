import { Router } from "express"
import stationController from "../../controllers/station.controller"

export const stationRouter: Router = Router()

stationRouter.get("/nearest", stationController.nearestStation)
