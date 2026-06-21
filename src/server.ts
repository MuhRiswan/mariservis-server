import app from "./app.js"
import prisma from "./config/database.js"

const PORT = process.env["PORT"] || 5000

const startServer = async () => {
  try {
    // 1. Tes koneksi ke Database terlebih dahulu
    await prisma.$connect()
    console.log("✅ Berhasil terhubung ke Database PostgreSQL (Docker)")

    // 2. Jika database aman, baru nyalakan server Express
    app.listen(PORT, () => {
      console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("❌ Gagal menyalakan server:", error)
    // Putuskan koneksi Prisma jika terjadi error fatal
    await prisma.$disconnect()
    process.exit(1)
  }
}

startServer()
