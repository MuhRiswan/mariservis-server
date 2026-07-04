import { z } from "zod"

const RoleEnum = z.enum(["ADMIN", "KASIR", "MEKANIK"])

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .regex(/^\S+$/, "Username tidak boleh mengandung spasi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().min(3, "Nama lengkap wajib diisi"),
  role: RoleEnum.optional().default("KASIR"),
})

export const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
})
