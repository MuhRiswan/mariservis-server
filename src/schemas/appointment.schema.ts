import { z } from "zod"

const AppointmentStatusEnum = z.enum([
  "BELUM_DIHUBUNGI",
  "MENUNGGU_BALASAN",
  "SUDAH_KONFIRMASI",
  "DALAM_PENGERJAAN",
  "BATAL",
  "SELESAI",
])

export const createAppointmentSchema = z.object({
  // Kita ubah string ISO menjadi objek Date secara otomatis menggunakan coerce
  date: z.coerce.date({ invalid_type_error: "Format tanggal tidak valid" }),
  customerId: z.string().uuid("ID Pelanggan tidak valid"),
  licensePlate: z.string().min(1, "Plat nomor wajib diisi"),
  vehicleModel: z.string().min(1, "Model kendaraan wajib diisi"),
  primaryService: z.string().min(3, "Keluhan/Servis utama wajib diisi"),
  status: AppointmentStatusEnum.optional().default("BELUM_DIHUBUNGI"),
})

export const updateAppointmentStatusSchema = z.object({
  status: AppointmentStatusEnum,
})
