import { Router } from "express"
import * as inventoryController from "../controllers/inventory.controller"
import { validate } from "../middlewares/validate"
import {
  bulkCreateInventorySchema,
  createInventorySchema,
  updateInventorySchema,
} from "../schemas/inventory.schema"

const router = Router()

// GET /api/inventory
router.get("/", inventoryController.getAll)

// POST /api/inventory (Dihadang satpam Zod createInventorySchema)
router.post("/", validate(createInventorySchema), inventoryController.create)
router.post(
  "/bulk",
  validate(bulkCreateInventorySchema),
  inventoryController.createBulk,
)
// PUT /api/inventory/:id (Dihadang satpam Zod updateInventorySchema)
router.put("/:id", validate(updateInventorySchema), inventoryController.update)

// DELETE /api/inventory/:id
router.delete("/:id", inventoryController.remove)

export default router
