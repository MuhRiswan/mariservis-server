import { Request, Response, NextFunction } from "express"
import * as invoiceService from "../services/invoice.service"
import { getPagingData } from "../utils/pagination"

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const { invoices, totalData } = await invoiceService.getAllInvoices(
      page,
      limit,
    )
    res.status(200).json(getPagingData(invoices, totalData, page, limit))
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
    const newInvoice = await invoiceService.createInvoice(req.body)
    res.status(201).json({
      success: true,
      data: newInvoice,
      message:
        "Transaksi berhasil, stok terpotong, dan riwayat kendaraan diperbarui!",
    })
  } catch (error) {
    next(error)
  }
}
