import { Router } from "express"
import noticeController from "../../controllers/notice.controller"
import { handleAuthentication } from "../../middlewares/auth.middleware"

export const noticeRouter: Router = Router()

noticeRouter.post("/", handleAuthentication, noticeController.createNotice)

noticeRouter.get("/", noticeController.getNotices)

noticeRouter.get("/:id", noticeController.getNotice)

noticeRouter.delete("/:id", handleAuthentication, noticeController.deleteNotice)

noticeRouter.put("/:id", handleAuthentication, noticeController.updateNotice)
