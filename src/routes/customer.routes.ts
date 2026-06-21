import { Router } from "express"
import * as customerController from "../controllers/customer.controller"
import { validate } from "../middlewares/validate"
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../schemas/customer.schema"

const router = Router()

router.get("/", customerController.getAll)
router.get("/:id", customerController.getById)
router.post("/", validate(createCustomerSchema), customerController.create)
router.put("/:id", validate(updateCustomerSchema), customerController.update)
router.delete("/:id", customerController.remove)

export default router
