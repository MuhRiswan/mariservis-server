import prisma from "../config/database"

export const getDashboardMetrics = async (
  startDate?: string,
  endDate?: string,
) => {
  const now = new Date()

  // 1. Tentukan rentang waktu secara dinamis
  // Jika tidak ada input tanggal, default ke tanggal 1 bulan ini sampai akhir bulan ini
  const start = startDate
    ? new Date(startDate)
    : new Date(now.getFullYear(), now.getMonth(), 1)

  const end = endDate
    ? new Date(endDate)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Pastikan jamnya mencakup seluruh hari (00:00:00 hingga 23:59:59)
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  // 2. Hitung Total Omset pada rentang waktu yang diminta
  const revenue = await prisma.invoice.aggregate({
    where: {
      date: { gte: start, lte: end },
      status: "LUNAS", // Hanya hitung yang sudah lunas
    },
    _sum: { totalAmount: true },
  })

  // 3. Hitung Total Antrean pada rentang waktu yang diminta
  const appointmentsCount = await prisma.appointment.count({
    where: { date: { gte: start, lte: end } },
  })

  // 4. Cari 5 Sparepart Kritis (Real-time snapshot, tidak terpengaruh filter tanggal)
  const criticalStockItems = await prisma.inventoryItem.findMany({
    where: {
      category: { not: "JASA" },
      stock: { lte: prisma.inventoryItem.fields.minStock },
    },
    take: 5,
    select: { itemCode: true, name: true, stock: true, minStock: true },
    orderBy: { stock: "asc" },
  })

  return {
    periode: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    totalRevenue: revenue._sum.totalAmount || 0,
    totalAppointments: appointmentsCount,
    criticalStock: criticalStockItems,
  }
}
