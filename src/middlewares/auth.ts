import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

export const requireApiKey = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"]

  const validApiKey = process.env.BACKEND_API_KEY

  if (!apiKey) {
    return next(
      new AppError("Akses ditolak: API Key tidak ditemukan di header", 401),
    )
  }

  if (apiKey !== validApiKey) {
    return next(new AppError("Akses ditolak: API Key tidak valid", 403))
  }

  next()
}
