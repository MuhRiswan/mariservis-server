import { Router } from "express"
import * as analyticsController from "../controllers/analytics.controller"

const router = Router()

router.get("/dashboard", analyticsController.getDashboard)

export default router
