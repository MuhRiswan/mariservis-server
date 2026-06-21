import { Router } from "express"
import * as appointmentController from "../controllers/appointment.controller"
import { validate } from "../middlewares/validate"
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../schemas/appointment.schema"

const router = Router()

router.get("/", appointmentController.getAll)
router.post(
  "/",
  validate(createAppointmentSchema),
  appointmentController.create,
)

// Perhatikan kita menggunakan PATCH di sini, bukan PUT
router.patch(
  "/:id/status",
  validate(updateAppointmentStatusSchema),
  appointmentController.patchStatus,
)

router.delete("/:id", appointmentController.remove)

export default router
