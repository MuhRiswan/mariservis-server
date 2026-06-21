import express, {
  NextFunction,
  type Application,
  type Request,
  type Response,
} from "express"
import cors from "cors"
import dotenv from "dotenv"
import { AppError } from "./utils/AppError"
import { globalErrorHandler } from "./middlewares/errorHandler"
import inventoryRoutes from "./routes/inventory.routes"
import customerRoutes from "./routes/customer.routes"
import appointmentRoutes from "./routes/appointment.routes"
import invoiceRoutes from "./routes/invoice.routes"
import { requireApiKey } from "./middlewares/auth"
dotenv.config()

const app: Application = express()

// ==========================================
// 🛡️ GLOBAL MIDDLEWARES
// ==========================================

// 1. CORS: Mengizinkan Frontend (localhost:3000) berkomunikasi dengan Backend (localhost:5000)
// Tanpa ini, browser akan memblokir request demi keamanan.
app.use(cors())

// 2. JSON Parser: Mengubah data yang dikirim Frontend (string JSON) menjadi Object JavaScript
app.use(express.json())

// ==========================================
// 🛣️ ROUTES (Sistem Navigasi)
// ==========================================

// Rute tes sederhana untuk mengecek apakah server hidup
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to MariServis API Server! 🚀",
    timestamp: new Date().toISOString(),
  })
})

app.use(requireApiKey)

app.use("/api/inventory", inventoryRoutes)
app.use("/api/customers", customerRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/invoices", invoiceRoutes)

app.all("*any", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(`Rute ${req.originalUrl} tidak ditemukan di server ini!`, 404),
  )
})

app.use(globalErrorHandler)

export default app
