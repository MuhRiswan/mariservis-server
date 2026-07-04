import { Request, Response } from 'express'

interface AppError extends Error {
  statusCode?: number
  status?: string
}

export const globalErrorHandler = (err: AppError, _req: Request, res: Response) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
}
