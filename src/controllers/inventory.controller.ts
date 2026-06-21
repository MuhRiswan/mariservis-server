import { Request, Response, NextFunction } from "express"
import * as inventoryService from "../services/inventory.service"
import { getPagingData } from "../utils/pagination"

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Tangkap angka dari URL query parameter (misal: ?page=1&limit=5)
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const { items, totalData } = await inventoryService.getAllItems(page, limit)

    // Bungkus menggunakan helper global
    const response = getPagingData(items, totalData, page, limit)

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newItem = await inventoryService.createItem(req.body)
    res.status(201).json({
      success: true,
      data: newItem,
      message: "Item berhasil ditambahkan ke gudang",
    })
  } catch (error) {
    next(error)
  }
}

export const createBulk = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Karena body request kita divalidasi sebagai { items: [...] }, kita ambil properti items-nya
    const { items } = req.body

    const result = await inventoryService.createManyItems(items)

    res.status(201).json({
      success: true,
      data: {
        insertedCount: result.count, // Mengembalikan jumlah data yang berhasil masuk fisik ke DB
      },
      message: `${result.count} item berhasil ditambahkan secara massal ke gudang!`,
    })
  } catch (error) {
    next(error)
  }
}

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string
    const updatedItem = await inventoryService.updateItem(id, req.body)
    res.status(200).json({
      success: true,
      data: updatedItem,
      message: "Item berhasil diperbarui",
    })
  } catch (error) {
    next(error)
  }
}

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    await inventoryService.deleteItem(id as string)
    res
      .status(200)
      .json({ success: true, message: "Item berhasil dihapus dari gudang" })
  } catch (error) {
    next(error)
  }
}
