import { Request, Response, NextFunction } from "express"
import * as analyticsService from "../services/analytics.service"

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { startDate, endDate } = req.query

    const metrics = await analyticsService.getDashboardMetrics(
      startDate as string | undefined,
      endDate as string | undefined,
    )

    res.status(200).json({ success: true, data: metrics })
  } catch (error) {
    next(error)
  }
}
