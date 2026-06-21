// src/schemas/invoice.schema.ts
import { z } from "zod"

const invoiceItemSchema = z.object({
  inventoryItemId: z.string().uuid("ID Barang/Jasa tidak valid"),
  qty: z.number().int().positive("Jumlah barang minimal 1"),
})

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid("ID Pelanggan tidak valid"),
  vehicleId: z.string().uuid("ID Kendaraan tidak valid").optional(),
  appointmentId: z.string().uuid("ID Antrean tidak valid").optional(),
  mechanicName: z.string().min(1, "Nama mekanik wajib diisi"),
  items: z
    .array(invoiceItemSchema)
    .min(1, "Keranjang belanja tidak boleh kosong"),
})
