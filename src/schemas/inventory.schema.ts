import { z } from "zod"

// Enum Zod ini harus sama persis dengan Enum di Prisma schema
const ItemCategoryEnum = z.enum(["SPAREPART", "JASA", "OLI", "AKSESORIS"])

export const createInventorySchema = z.object({
  itemCode: z.string().min(3, "Kode item minimal 3 karakter"),
  name: z.string().min(3, "Nama item minimal 3 karakter"),
  brand: z.string().optional(),
  category: ItemCategoryEnum,
  price: z.number().min(0, "Harga tidak boleh negatif"),
  stock: z.number().int().min(0, "Stok tidak boleh negatif").default(0),
  minStock: z
    .number()
    .int()
    .min(0, "Minimal stok tidak boleh negatif")
    .default(0),
  lifespanMonths: z.number().int().positive().optional(),
  warrantyDays: z.number().int().min(0).optional().default(0),
})

export const bulkCreateInventorySchema = z.object({
  items: z
    .array(createInventorySchema)
    .min(1, "Daftar item massal tidak boleh kosong"),
})

// Untuk update, semua field opsional (karena mungkin admin hanya mau edit harganya saja)
export const updateInventorySchema = createInventorySchema.partial()
