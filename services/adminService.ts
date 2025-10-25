import { apiClient } from "@/lib/api"
import type { User } from "./authService"
import type { Product } from "./productService"
import type { Category } from "./categoryService"
import type { Order } from "./orderService"

export interface AdminDashboard {
  stats: {
    totalUsers: number
    totalProducts: number
    totalOrders: number
    totalRevenue: number
  }
  recentOrders: Order[]
  topProducts: Product[]
}

class AdminService {
  async getDashboard(): Promise<AdminDashboard> {
    return apiClient.get<AdminDashboard>("/admin/dashboard")
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
}

export const adminService = new AdminService()
