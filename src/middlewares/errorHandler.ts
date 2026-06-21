import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Jika error tidak memiliki status code, anggap itu 500 Internal Server Error
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  // Format respon yang akan selalu diterima oleh Frontend Next.js kita
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    // (Opsional) Tampilkan stack trace di mode development agar kamu gampang debugging
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}
