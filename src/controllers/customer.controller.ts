import { Request, Response, NextFunction } from "express"
import * as customerService from "../services/customer.service"
import { getPagingData } from "../utils/pagination"

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const { customers, totalData } = await customerService.getAllCustomers(
      page,
      limit,
    )

    const response = getPagingData(customers, totalData, page, limit)

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customer = await customerService.getCustomerById(
      req.params.id as string,
    )
    res.status(200).json({ success: true, data: customer })
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
    const newCustomer = await customerService.createCustomer(req.body)
    res.status(201).json({
      success: true,
      data: newCustomer,
      message: "Pelanggan berhasil didaftarkan",
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
    const updatedCustomer = await customerService.updateCustomer(
      req.params.id as string,
      req.body,
    )
    res.status(200).json({
      success: true,
      data: updatedCustomer,
      message: "Data pelanggan diperbarui",
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
    await customerService.deleteCustomer(req.params.id as string)
    res.status(200).json({
      success: true,
      message: "Pelanggan dan kendaraannya berhasil dihapus",
    })
  } catch (error) {
    next(error)
  }
}
