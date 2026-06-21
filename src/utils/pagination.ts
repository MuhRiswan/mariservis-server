export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  success: boolean
  data: T[]
  meta: {
    page: number
    limit: number
    totalData: number
    totalPages: number
  }
}

// Fungsi Generic (bisa menerima tipe data apa saja: Customer, Inventory, dll)
export const getPagingData = <T>(
  data: T[],
  totalData: number,
  page: number,
  limit: number,
): PaginatedResult<T> => {
  const totalPages = Math.ceil(totalData / limit)

  return {
    success: true,
    data,
    meta: {
      page,
      limit,
      totalData,
      totalPages,
    },
  }
}
