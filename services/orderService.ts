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

export interface OrderResponse {
  orders: Order[]
  total: number
  page: number
  limit: number
}

class OrderService {
  async getOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders")
  }
  async getAllOrders(params?: { page?: number; limit?: number; status?: string; user_id?: string }): Promise<OrderResponse> {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.status) query.append('status', params.status)
    if (params?.user_id) query.append('user_id', params.user_id)
    return apiClient.get<OrderResponse>(`/orders/admin?${query.toString()}`)
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
