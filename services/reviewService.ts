import { apiClient } from "@/lib/api"

export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  comment: string
  user?: {
    name: string
  }
  created_at: string
  updated_at: string
}

export interface CreateReviewData {
  productId: string
  rating: number
  comment: string
}

class ReviewService {
  async getReviews(productId?: string): Promise<Review[]> {
    const params = productId ? { productId } : {}
    return apiClient.get<Review[]>("/reviews", params)
  }

  async createReview(data: CreateReviewData): Promise<Review> {
    return apiClient.post<Review>("/reviews", data)
  }

  async updateReview(id: string, data: Partial<CreateReviewData>): Promise<Review> {
    return apiClient.put<Review>(`/reviews/${id}`, data)
  }

  async deleteReview(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/reviews/${id}`)
  }
}

export const reviewService = new ReviewService()
