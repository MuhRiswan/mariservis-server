import { Request, Response, NextFunction } from "express"
import * as userService from "../services/user.service"
import { getPagingData } from "../utils/pagination"

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const { users, totalData } = await userService.getAllUsers(page, limit)
    res.status(200).json(getPagingData(users, totalData, page, limit))
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
    const newUser = await userService.createUser(req.body)
    res
      .status(201)
      .json({
        success: true,
        data: newUser,
        message: "Pengguna berhasil didaftarkan",
      })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body
    const user = await userService.verifyLogin(username, password)

    // Nanti NextAuth di Next.js akan membaca balasan ini untuk membuat Sesi Login
    res
      .status(200)
      .json({ success: true, data: user, message: "Login berhasil" })
  } catch (error) {
    next(error)
  }
}
