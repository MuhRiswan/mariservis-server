import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"
import { AppError } from "../utils/AppError"

// Fungsi ajaib yang menerima skema Zod dan mengembalikan Middleware Express
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Mengecek apakah body request sesuai dengan aturan Zod
      await schema.parseAsync(req.body)
      next() // Jika aman, silakan masuk ke Controller!
    } catch (error) {
      if (error instanceof ZodError) {
        // Jika gagal, ambil pesan error pertama dari Zod dan lempar ke Global Error Handler
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
