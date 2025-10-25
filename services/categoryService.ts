import { apiClient } from "@/lib/api"

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number
  image_url?: string
  is_active: boolean
  sort_order: number
  product_count: number
  created_at: string
  updated_at: string
  children?: Category[]
}

export interface CreateCategoryData {
  name: string
  description?: string
  parent_id?: number
  image_url?: string
  is_active?: boolean
  sort_order?: number
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

class CategoryService {
  async getCategories(parentId?: number): Promise<{ categories: Category[] }> {
    const params = parentId !== undefined ? { parent_id: parentId.toString() } : {}
    return apiClient.get<{ categories: Category[] }>("/categories", params)
  }

  async getActiveCategories(): Promise<{ categories: Category[] }> {
    return apiClient.get<{ categories: Category[] }>("/categories/active")
  }

  async getCategory(slug: string): Promise<{ category: Category }> {
    return apiClient.get<{ category: Category }>(`/categories/${slug}`)
  }

  async getCategoryById(id: number): Promise<{ category: Category }> {
    return apiClient.get<{ category: Category }>(`/categories/id/${id}`)
  }

  async createCategory(data: CreateCategoryData): Promise<{ category: Category }> {
    return apiClient.post<{ category: Category }>("/categories", data)
  }

  async updateCategory(id: number, data: UpdateCategoryData): Promise<{ category: Category }> {
    return apiClient.put<{ category: Category }>(`/categories/${id}`, data)
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/categories/${id}`)
  }

  async toggleCategoryStatus(id: number): Promise<{ category: Category }> {
    return apiClient.put<{ category: Category }>(`/categories/${id}/status`)
  }

  async getCategoryTree(): Promise<{ categories: Category[] }> {
    return apiClient.get<{ categories: Category[] }>("/categories/tree")
  }

  async getFeaturedCategories(limit = 6): Promise<{ categories: Category[] }> {
    return apiClient.get<{ categories: Category[] }>("/categories/featured", { limit: limit.toString() })
  }
}

export const categoryService = new CategoryService()
