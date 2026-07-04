import { Router } from "express"
import * as userController from "../controllers/user.controller"
import { validate } from "../middlewares/validate"
import { createUserSchema, loginSchema } from "../schemas/user.schema"

const router = Router()

router.get("/", userController.getAll)
router.post("/", validate(createUserSchema), userController.create)
router.post("/login", validate(loginSchema), userController.login)

export default router
