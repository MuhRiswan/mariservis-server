// src/routes/invoice.routes.ts
import { Router } from "express"
import * as invoiceController from "../controllers/invoice.controller"
import { validate } from "../middlewares/validate"
import { createInvoiceSchema } from "../schemas/invoice.schema"

const router = Router()

router.get("/", invoiceController.getAll)
router.post("/", validate(createInvoiceSchema), invoiceController.create)

export default router
