import { apiClient } from "@/lib/api"

export interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  item_count: number
}

export interface CreateOrderData {
  cartId: string
  address: string
}

class OrderService {
  async getOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders")
  }
  async getAllOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders/admin")
  }

  async getOrderById(id: string): Promise<Order> {
    console.log(id)
    return apiClient.get<Order>(`/orders/${id}`)
  }

  async createOrder(data: CreateOrderData): Promise<Order> {
    return apiClient.post<Order>("/orders", data)
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return apiClient.put<Order>(`/orders/${id}`, { status })
  }
}

export const orderService = new OrderService()
