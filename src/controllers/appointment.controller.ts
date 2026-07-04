import { Request, Response, NextFunction } from "express"
import * as appointmentService from "../services/appointment.service"
import { getPagingData } from "../utils/pagination"

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const { appointments, totalData } =
      await appointmentService.getAllAppointments(page, limit)
    res.status(200).json(getPagingData(appointments, totalData, page, limit))
  } catch (error) {
    next(error)
  }
}

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newAppointment = await appointmentService.createAppointment(req.body)
    res.status(201).json({
      success: true,
      data: newAppointment,
      message: "Antrean berhasil ditambahkan",
    })
  } catch (error) {
    next(error)
  }
}

export const patchStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const updatedAppointment = await appointmentService.updateStatus(
      id as string,
      status,
    )
    res.status(200).json({
      success: true,
      data: updatedAppointment,
      message: `Status diubah menjadi ${status}`,
    })
  } catch (error) {
    next(error)
  }
}

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await appointmentService.deleteAppointment(req.params.id as string)
    res
      .status(200)
      .json({ success: true, message: "Antrean berhasil dibatalkan/dihapus" })
  } catch (error) {
    next(error)
  }
}

export const getCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { start, end } = req.query
    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: "Parameter start dan end wajib diisi",
      })
    }
    const calendarData = await appointmentService.getCalendarAppointments(
      start as string,
      end as string,
    )
    res.status(200).json({ success: true, data: calendarData })
  } catch (error) {
    next(error)
  }
}

export const getKanban = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const kanbanData = await appointmentService.getKanbanAppointments()
    res.status(200).json({ success: true, data: kanbanData })
  } catch (error) {
    next(error)
  }
}
