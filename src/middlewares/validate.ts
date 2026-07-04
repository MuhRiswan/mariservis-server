import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"
import { AppError } from "../utils/AppError"

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ")
        next(new AppError(`Validasi Gagal: ${errorMessage}`, 400))
      } else {
        next(error)
      }
    }
  }
}
