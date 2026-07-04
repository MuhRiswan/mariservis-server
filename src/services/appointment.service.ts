import prisma from '../config/database'
import { AppointmentWithCustomer } from '../types/appointment'
import { AppError } from '../utils/AppError'
import { AppointmentStatus, Prisma } from '@prisma/client'

export const getAllAppointments = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit

  const [appointments, totalData] = await Promise.all([
    prisma.appointment.findMany({
      skip,
      take: limit,
      // Eager loading: Bawa nama pelanggan agar bisa ditampilkan di kartu Kanban
      include: { customer: { select: { name: true, phone: true } } },
      orderBy: { date: 'asc' }, // Urutkan dari jadwal terdekat
    }),
    prisma.appointment.count(),
  ])

  return { appointments, totalData }
}

export const createAppointment = async (data: Prisma.AppointmentUncheckedCreateInput) => {
  // Pastikan ID Pelanggan yang dimasukkan benar-benar ada di database
  const customerExists = await prisma.customer.findUnique({
    where: { id: data.customerId },
  })
  if (!customerExists) throw new AppError('Pelanggan tidak ditemukan di database', 404)

  return await prisma.appointment.create({
    data,
    include: { customer: { select: { name: true } } },
  })
}

// Fungsi khusus untuk Drag-and-Drop Kanban (Hanya update status)
export const updateStatus = async (id: string, status: Prisma.AppointmentUpdateInput['status']) => {
  try {
    return await prisma.appointment.update({
      where: { id },
      data: { status },
    })
  } catch {
    throw new AppError('Gagal mengubah status: Antrean tidak ditemukan', 404)
  }
}

export const deleteAppointment = async (id: string) => {
  try {
    await prisma.appointment.delete({ where: { id } })
    return true
  } catch {
    throw new AppError('Gagal menghapus: Antrean tidak ditemukan', 404)
  }
}

// Tambahkan fungsi untuk Kalender
export const getCalendarAppointments = async (startDate: string, endDate: string) => {
  return await prisma.appointment.findMany({
    where: {
      date: {
        gte: new Date(startDate), // Lebih besar / sama dengan startDate
        lte: new Date(endDate), // Lebih kecil / sama dengan endDate
      },
    },
    include: { customer: { select: { name: true } } },
    orderBy: { date: 'asc' },
  })
}

// Tambahkan fungsi untuk Kanban (Pengelompokan Otomatis)
export const getKanbanAppointments = async () => {
  const appointments = await prisma.appointment.findMany({
    // Kita ambil antrean yang belum selesai atau baru saja selesai hari ini agar papan tidak terlalu penuh
    where: {
      OR: [
        { status: { not: 'SELESAI' } },
        {
          status: 'SELESAI',
          date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }, // Selesai hari ini saja
        },
      ],
    },
    include: { customer: { select: { name: true, phone: true } } },
    orderBy: { date: 'asc' },
  })

  // Logika Pengelompokan (Grouping) oleh Backend
  const groupedData: Record<AppointmentStatus, AppointmentWithCustomer[]> = {
    BELUM_DIHUBUNGI: [],
    MENUNGGU_BALASAN: [],
    SUDAH_KONFIRMASI: [],
    DALAM_PENGERJAAN: [],
    SELESAI: [],
    BATAL: [],
  }

  // Menyebarkan data ke keranjangnya masing-masing
  appointments.forEach((apt: AppointmentWithCustomer) => {
    groupedData[apt.status].push(apt)
  })

  return groupedData
}
