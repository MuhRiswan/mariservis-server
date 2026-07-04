import { Router } from "express"
import * as inventoryController from "../controllers/inventory.controller"
import { validate } from "../middlewares/validate"
import {
  bulkCreateInventorySchema,
  createInventorySchema,
  updateInventorySchema,
} from "../schemas/inventory.schema"

const router = Router()

router.get("/", inventoryController.getAll)

router.post("/", validate(createInventorySchema), inventoryController.create)
router.post(
  "/bulk",
  validate(bulkCreateInventorySchema),
  inventoryController.createBulk,
)
router.put("/:id", validate(updateInventorySchema), inventoryController.update)
router.delete("/:id", inventoryController.remove)

export default router
