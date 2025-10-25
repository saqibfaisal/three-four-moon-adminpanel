import { apiClient } from "@/lib/api"

export interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: {
    name: string
    image?: string
  }
}

export interface Cart {
  id: string
  items: CartItem[]
  total: number
  created_at: string
  updated_at: string
}

class CartService {
  async getCart(): Promise<Cart> {
    return apiClient.get<Cart>("/cart")
  }

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    return apiClient.post<Cart>("/cart/add", { product_id:productId, quantity })
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    return apiClient.put<Cart>(`/cart/${itemId}`, { quantity })
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    return apiClient.delete<Cart>(`/cart/${itemId}`)
  }

  async clearCart(): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>("/cart")
  }
}

export const cartService = new CartService()
