import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

export const requireApiKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Mengambil kunci dari header request (biasanya dinamakan x-api-key)
  const apiKey = req.headers["x-api-key"]

  // Ambil kunci asli dari sistem (file .env)
  const validApiKey = process.env.BACKEND_API_KEY

  if (!apiKey) {
    return next(
      new AppError("Akses ditolak: API Key tidak ditemukan di header", 401),
    )
  }

  if (apiKey !== validApiKey) {
    return next(new AppError("Akses ditolak: API Key tidak valid", 403))
  }

  // Jika kunci benar, silakan masuk ke Controller!
  next()
}
