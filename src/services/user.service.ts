import prisma from "../config/database"
import { AppError } from "../utils/AppError"
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"

// 1. Menampilkan semua pengguna (tanpa memunculkan password)
export const getAllUsers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit
  const [users, totalData] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      }, // PASSWORD TIDAK DIPILIH!
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ])
  return { users, totalData }
}

// 2. Mendaftarkan Pegawai Baru
export const createUser = async (data: Prisma.UserCreateInput) => {
  // Cek apakah username sudah dipakai
  const existingUser = await prisma.user.findUnique({
    where: { username: data.username },
  })
  if (existingUser) throw new AppError("Username tersebut sudah digunakan", 400)

  // HASHING: Mengacak password sebanyak 10 putaran (Standar Industri)
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(data.password, salt)

  // Simpan ke database dengan password yang sudah diacak
  const newUser = await prisma.user.create({
    data: { ...data, password: hashedPassword },
  })

  // Buang password dari objek sebelum dikembalikan ke Controller
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// 3. Logika untuk verifikasi Login (Dipanggil oleh NextAuth nanti)
export const verifyLogin = async (username: string, passwordInput: string) => {
  // Cari pengguna berdasarkan username
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) throw new AppError("Username atau password salah", 401)

  // Bandingkan password inputan dengan password acak di database
  const isPasswordValid = await bcrypt.compare(passwordInput, user.password)

  if (!isPasswordValid) throw new AppError("Username atau password salah", 401)

  // Jika sukses, kembalikan data user tanpa password
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}
