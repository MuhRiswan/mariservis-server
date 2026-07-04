import prisma from '../config/database'
import { AppError } from '../utils/AppError'
import { Prisma } from '@prisma/client'

// Tambahkan parameter page dan limit dengan nilai default
export const getAllItems = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit

  // Mengambil data dan menghitung total baris secara bersamaan
  const [items, totalData] = await Promise.all([
    prisma.inventoryItem.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.inventoryItem.count(),
  ])

  return { items, totalData }
}

export const createItem = async (data: Prisma.InventoryItemCreateInput) => {
  // Cek apakah kode item sudah pernah dipakai
  const existingItem = await prisma.inventoryItem.findUnique({
    where: { itemCode: data.itemCode },
  })

  if (existingItem) {
    throw new AppError('Kode Item tersebut sudah digunakan di gudang!', 400)
  }

  return await prisma.inventoryItem.create({ data })
}

export const createManyItems = async (items: Prisma.InventoryItemCreateInput[]) => {
  return await prisma.inventoryItem.createMany({
    data: items,
    // skipDuplicates: true memastikan jika ada kode item yang tidak sengaja kembar,
    // sistem tidak akan crash, melainkan mengabaikan yang kembar dan melanjutkan sisa data lainnya.
    skipDuplicates: true,
  })
}

export const updateItem = async (id: string, data: Prisma.InventoryItemUpdateInput) => {
  try {
    return await prisma.inventoryItem.update({
      where: { id },
      data,
    })
  } catch {
    throw new AppError('Gagal update: Item tidak ditemukan', 404)
  }
}

export const deleteItem = async (id: string) => {
  try {
    await prisma.inventoryItem.delete({ where: { id } })
    return true
  } catch {
    throw new AppError('Gagal hapus: Item tidak ditemukan', 404)
  }
}
