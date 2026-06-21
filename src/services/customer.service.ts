import prisma from "../config/database"
import { AppError } from "../utils/AppError"
import { Prisma } from "@prisma/client"

// Tipe khusus karena kita menerima input gabungan (Customer + Vehicles)
type CreateCustomerWithVehiclesInput = {
  name: string
  phone: string
  address?: string
  vehicles?: {
    licensePlate: string
    brand: string
    model: string
    year: number
    transmission: "Manual" | "Matic"
    currentOdometer?: number
    vinNumber?: string
  }[]
}

export const getAllCustomers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit

  const [customers, totalData] = await Promise.all([
    prisma.customer.findMany({
      skip,
      take: limit,
      include: { vehicles: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count(),
  ])

  return { customers, totalData }
}

export const getCustomerById = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      vehicles: {
        include: { components: true }, // Bawa data motor beserta riwayat suku cadangnya
      },
      invoices: true, // Bawa riwayat transaksinya
    },
  })

  if (!customer) throw new AppError("Pelanggan tidak ditemukan", 404)
  return customer
}

export const createCustomer = async (data: CreateCustomerWithVehiclesInput) => {
  // 1. Cek apakah nomor HP sudah terdaftar
  const existingCustomer = await prisma.customer.findUnique({
    where: { phone: data.phone },
  })
  if (existingCustomer)
    throw new AppError("Nomor HP tersebut sudah terdaftar di sistem", 400)

  // 2. Jika ada data plat nomor, pastikan plat tersebut belum ada di sistem
  if (data.vehicles && data.vehicles.length > 0) {
    for (const vehicle of data.vehicles) {
      const existingVehicle = await prisma.vehicle.findUnique({
        where: { licensePlate: vehicle.licensePlate },
      })
      if (existingVehicle)
        throw new AppError(
          `Plat nomor ${vehicle.licensePlate} sudah terdaftar`,
          400,
        )
    }
  }

  // 3. Eksekusi Nested Write (Memasukkan data ke 2 tabel sekaligus!)
  return await prisma.customer.create({
    data: {
      name: data.name,
      phone: data.phone,
      address: data.address,
      vehicles: data.vehicles ? { create: data.vehicles } : undefined,
    },
    include: { vehicles: true },
  })
}

export const updateCustomer = async (
  id: string,
  data: Prisma.CustomerUpdateInput,
) => {
  try {
    return await prisma.customer.update({ where: { id }, data })
  } catch (error) {
    throw new AppError("Gagal memperbarui: Pelanggan tidak ditemukan", 404)
  }
}

export const deleteCustomer = async (id: string) => {
  try {
    await prisma.customer.delete({ where: { id } })
    return true
  } catch (error) {
    throw new AppError("Gagal menghapus: Pelanggan tidak ditemukan", 404)
  }
}
