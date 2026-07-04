import app from "./app.js"
import prisma from "./config/database.js"

const PORT = process.env["PORT"] || 5000

const startServer = async () => {
  try {
    await prisma.$connect()
    console.log("✅ Berhasil terhubung ke Database PostgreSQL (Docker)")
    app.listen(PORT, () => {
      console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("❌ Gagal menyalakan server:", error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

startServer()
