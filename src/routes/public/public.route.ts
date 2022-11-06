import { Router } from "express"
import userController from "../../controllers/user.controller"

export const poblicRouter: Router = Router()

poblicRouter.post("/register", userController.register)

poblicRouter.post("/login", userController.login)
