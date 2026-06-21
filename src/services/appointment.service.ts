import prisma from "../config/database"
import { AppError } from "../utils/AppError"
import { Prisma } from "@prisma/client"

export const getAllAppointments = async (
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit

  const [appointments, totalData] = await Promise.all([
    prisma.appointment.findMany({
      skip,
      take: limit,
      // Eager loading: Bawa nama pelanggan agar bisa ditampilkan di kartu Kanban
      include: { customer: { select: { name: true, phone: true } } },
      orderBy: { date: "asc" }, // Urutkan dari jadwal terdekat
    }),
    prisma.appointment.count(),
  ])

  return { appointments, totalData }
}

export const createAppointment = async (
  data: Prisma.AppointmentUncheckedCreateInput,
) => {
  // Pastikan ID Pelanggan yang dimasukkan benar-benar ada di database
  const customerExists = await prisma.customer.findUnique({
    where: { id: data.customerId },
  })
  if (!customerExists)
    throw new AppError("Pelanggan tidak ditemukan di database", 404)

  return await prisma.appointment.create({
    data,
    include: { customer: { select: { name: true } } },
  })
}

// Fungsi khusus untuk Drag-and-Drop Kanban (Hanya update status)
export const updateStatus = async (
  id: string,
  status: Prisma.AppointmentUpdateInput["status"],
) => {
  try {
    return await prisma.appointment.update({
      where: { id },
      data: { status },
    })
  } catch (error) {
    throw new AppError("Gagal mengubah status: Antrean tidak ditemukan", 404)
  }
}

export const deleteAppointment = async (id: string) => {
  try {
    await prisma.appointment.delete({ where: { id } })
    return true
  } catch (error) {
    throw new AppError("Gagal menghapus: Antrean tidak ditemukan", 404)
  }
}
