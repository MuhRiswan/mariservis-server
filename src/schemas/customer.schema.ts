import { z } from "zod"

const vehicleSchema = z.object({
  licensePlate: z.string().min(3, "Plat nomor tidak valid"),
  brand: z.string().min(1, "Merek motor wajib diisi"),
  model: z.string().min(1, "Model motor wajib diisi"),
  year: z
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear() + 1),
  transmission: z.enum(["Manual", "Matic"]),
  currentOdometer: z.number().int().min(0).default(0),
  vinNumber: z.string().optional(),
})

export const createCustomerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .regex(/^[0-9]+$/, "Nomor HP hanya boleh angka"),
  address: z.string().optional(),
  vehicles: z.array(vehicleSchema).optional(),
})

export const updateCustomerSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z
    .string()
    .min(10)
    .regex(/^[0-9]+$/)
    .optional(),
  address: z.string().optional(),
  tier: z.enum(["REGULER", "LOYAL", "VIP"]).optional(),
})
