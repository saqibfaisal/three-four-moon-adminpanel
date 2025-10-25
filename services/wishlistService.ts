import {apiClient as api } from "@/lib/api"

export interface WishlistItem {
  id: number
  user_id: number
  product_id: number
  created_at: string
  name: string
  slug: string
  price: string
  compare_price?: string
  primary_image?: string
  is_on_sale: number
  average_rating?: string
  review_count: number
}

export interface WishlistResponse {
  items: WishlistItem[]
  total: number
}

class WishlistService {
  async getWishlist(): Promise<WishlistResponse> {
    try {
      const response = await api.get("/wishlist")
      return response
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      throw error
    }
  }

  async addToWishlist(productId: any): Promise<{ success: boolean; message: string }> {
    try {
      return await api.post("/wishlist/add", { product_id: productId }) 
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      throw error
    }
  }

  async removeFromWishlist(productId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/wishlist/remove/${productId}`)
      return response.data
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      throw error
    }
  }

  async isInWishlist(productId: number): Promise<{ in_wishlist: boolean }> {
    try {
      const response = await api.get(`/wishlist/check/${productId}`)
      return response.data
    } catch (error) {
      console.error("Error checking wishlist status:", error)
      return { in_wishlist: false }
    }
  }

  async clearWishlist(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete("/wishlist/clear")
      return response.data
    } catch (error) {
      console.error("Error clearing wishlist:", error)
      throw error
    }
  }

  async moveToCart(productId: number, quantity = 1): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post("/wishlist/move-to-cart", {
        product_id: productId,
        quantity,
      })
      return response.data
    } catch (error) {
      console.error("Error moving to cart:", error)
      throw error
    }
  }

  async bulkAddToCart(productIds: number[]): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post("/wishlist/bulk-add-to-cart", {
        product_ids: productIds,
      })
      return response.data
    } catch (error) {
      console.error("Error bulk adding to cart:", error)
      throw error
    }
  }

  async bulkRemove(productIds: number[]): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post("/wishlist/bulk-remove", {
        product_ids: productIds,
      })
      return response.data
    } catch (error) {
      console.error("Error bulk removing from wishlist:", error)
      throw error
    }
  }
}

export const wishlistService = new WishlistService()
