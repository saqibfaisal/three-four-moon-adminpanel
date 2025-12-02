import { apiClient } from "@/lib/api"
import type { User } from "./authService"
import type { Product } from "./productService"
import type { Category } from "./categoryService"
import type { Order } from "./orderService"

export interface Review {
  id: number
  product_id: number
  user_id: number
  rating: number
  title?: string
  comment?: string
  is_verified_purchase: boolean
  is_approved: boolean
  helpful_count: number
  first_name: string
  last_name: string
  email: string
  product_name: string
  created_at: string
  updated_at: string
}

export interface DashboardOrder {
  id: number
  order_number: string
  total_amount: number
  status: string
  created_at: string
  currency: string
  first_name: string
  last_name: string
  email: string
}

export interface LowStockProduct {
  id: number
  name: string
  inventory_quantity: number
}

export interface AdminDashboard {
  statistics: {
    total_users: number
    total_products: number
    total_orders: number
    total_revenue: number
  }
  recent_orders: DashboardOrder[]
  low_stock_products: LowStockProduct[]
  topProducts?: Product[]
}

class AdminService {
  async getDashboard(countryId?: string): Promise<AdminDashboard> {
    const params = countryId && countryId !== "all" ? { country_id: countryId } : {}
    return apiClient.get<AdminDashboard>("/admin/dashboard", params)
  }

  async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>("/users")
  }

  async getUser(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`)
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/users/${id}`, data)
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/users/${id}`)
  }

  async getPendingReviews(page = 1, limit = 20): Promise<{
    reviews: Review[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> {
    return apiClient.get("/admin/reviews/pending", { page, limit })
  }

  async getAllReviews(
    page = 1,
    limit = 20,
    filters?: {
      status?: "pending" | "approved" | "all"
      rating?: number
      product_id?: number
      search?: string
    },
  ): Promise<{
    reviews: Review[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> {
    const params: any = { page, limit }
    if (filters?.status && filters.status !== "all") {
      params.status = filters.status
    }
    if (filters?.rating) {
      params.rating = filters.rating
    }
    if (filters?.product_id) {
      params.product_id = filters.product_id
    }
    if (filters?.search) {
      params.search = filters.search
    }
    return apiClient.get("/admin/reviews", params)
  }

  async approveReview(id: number, approved: boolean): Promise<{ message: string }> {
    return apiClient.put(`/admin/reviews/${id}/approve`, { approved })
  }

  async deleteReview(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/admin/reviews/${id}`)
  }
}

export const adminService = new AdminService()
