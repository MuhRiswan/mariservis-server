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
import userRoutes from "./routes/user.routes"
import analyticsRoutes from "./routes/analytics.routes"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
dotenv.config()

const app: Application = express()

// ==========================================
// 🛡️ GLOBAL MIDDLEWARES
// ==========================================

app.use(helmet())

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  }),
)

const globalLimiter = rateLimit({
  windowMs:
    parseInt(process.env.RATE_LIMIT_WINDOW_MS as string) || 15 * 60 * 1000, 
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS as string) || 1000,
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message:
      "Terlalu banyak permintaan dari perangkat ini. Silakan coba lagi setelah 15 menit.",
  },
})

app.use("/api", globalLimiter)

app.use(express.json())

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
app.use("/api/users", userRoutes)
app.use("/api/analytics", analyticsRoutes)

app.all("*any", (req: Request, _res: Response, next: NextFunction) => {
  next(
    new AppError(`Rute ${req.originalUrl} tidak ditemukan di server ini!`, 404),
  )
})

app.use(globalErrorHandler)

export default app
