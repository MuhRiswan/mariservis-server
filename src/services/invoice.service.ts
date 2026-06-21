import prisma from "../config/database"
import { AppError } from "../utils/AppError"

type CreateInvoiceInput = {
  customerId: string
  vehicleId?: string
  appointmentId?: string
  mechanicName: string
  items: { inventoryItemId: string; qty: number }[]
}

export const getAllInvoices = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit
  const [invoices, totalData] = await Promise.all([
    prisma.invoice.findMany({
      skip,
      take: limit,
      include: {
        customer: { select: { name: true, phone: true } },
        vehicle: { select: { licensePlate: true, model: true } },
        items: true,
      },
      orderBy: { date: "desc" },
    }),
    prisma.invoice.count(),
  ])
  return { invoices, totalData }
}

export const createInvoice = async (data: CreateInvoiceInput) => {
  // TRANSAKSI INTERAKTIF PRISMA: Mengunci database selama proses ini berlangsung
  return await prisma.$transaction(async (tx) => {
    let calculatedTotalAmount = 0
    const processedItems = []

    // 1. Validasi Stok & Harga Asli dari Gudang (Anti-Tampering)
    for (const item of data.items) {
      const inventoryItem = await tx.inventoryItem.findUnique({
        where: { id: item.inventoryItemId },
      })

      if (!inventoryItem) {
        throw new AppError(
          `Barang dengan ID ${item.inventoryItemId} tidak ditemukan`,
          404,
        )
      }

      if (inventoryItem.category !== "JASA" && inventoryItem.stock < item.qty) {
        throw new AppError(
          `Stok tidak cukup untuk ${inventoryItem.name}. Sisa stok: ${inventoryItem.stock}`,
          400,
        )
      }

      const subtotal = inventoryItem.price * item.qty
      calculatedTotalAmount += subtotal

      processedItems.push({
        inventoryItemId: inventoryItem.id,
        itemName: inventoryItem.name, // Membekukan/Snapshot nama barang
        qty: item.qty,
        priceAtSale: inventoryItem.price, // Membekukan/Snapshot harga saat ini
        subtotal: subtotal,
        // Data ekstra untuk Smart Assistant nanti
        category: inventoryItem.category,
        lifespanMonths: inventoryItem.lifespanMonths,
        warrantyDays: inventoryItem.warrantyDays,
        brand: inventoryItem.brand,
      })
    }

    // 2. Buat Nomor Invoice Otomatis (Contoh: INV-20260614-1234)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const invoiceNum = `INV-${dateStr}-${randomNum}`

    // 3. Simpan Invoice & Rinciannya ke Database
    const newInvoice = await tx.invoice.create({
      data: {
        invoiceNum,
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        mechanicName: data.mechanicName,
        totalAmount: calculatedTotalAmount, // Menggunakan total aman yang dihitung Backend
        status: "LUNAS",
        items: {
          create: processedItems.map((item) => ({
            inventoryItemId: item.inventoryItemId,
            itemName: item.itemName,
            qty: item.qty,
            priceAtSale: item.priceAtSale,
            subtotal: item.subtotal,
          })),
        },
      },
      include: { items: true },
    })

    // 4. Potong Stok Gudang & Catat Riwayat Suku Cadang (Jika ada motornya)
    for (const item of processedItems) {
      if (item.category !== "JASA") {
        await tx.inventoryItem.update({
          where: { id: item.inventoryItemId },
          data: { stock: { decrement: item.qty } }, // Mengurangi stok
        })
      }

      // 5. SMART ASSISTANT: Hitung tanggal jatuh tempo jika barang memiliki lifespanMonths
      if (data.vehicleId && item.category !== "JASA" && item.lifespanMonths) {
        const nextReplacement = new Date()
        nextReplacement.setMonth(
          nextReplacement.getMonth() + item.lifespanMonths,
        )

        await tx.componentPart.create({
          data: {
            partName: item.itemName,
            brand: item.brand,
            price: item.priceAtSale,
            estimatedNextReplacement: nextReplacement,
            warrantyDays: item.warrantyDays || 0,
            vehicleId: data.vehicleId,
            inventoryItemId: item.inventoryItemId,
          },
        })
      }
    }

    // 6. Tambahkan total belanja ke Profil Pelanggan (Loyalty System)
    await tx.customer.update({
      where: { id: data.customerId },
      data: { totalSpending: { increment: calculatedTotalAmount } }, // Menambah omset pelanggan
    })

    if (data.appointmentId) {
      await tx.appointment.update({
        where: { id: data.appointmentId },
        data: { status: "SELESAI" },
      })
    }

    return newInvoice
  })
}
