import { apiClient, type PaginationResponse } from "@/lib/api"

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  alt_text?: string
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductVariant {
  id: number
  product_id: number
  sku: string
  name: string
  value: string
  price?: number
  compare_price?: number
  inventory_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

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
}

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
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  sku: string
  price: number
  compare_price?: number
  cost_price?: number
  inventory_quantity: number
  weight?: number
  dimensions?: string
  material?: string
  care_instructions?: string
  brand?: string
  color?: string
  size?: string
  gender?: "men" | "women" | "unisex" | "kids"
  country?: string
  is_active: boolean
  is_featured: boolean
  is_trending: boolean
  is_new_arrival: boolean
  is_on_sale: boolean
  primary_image?: string
  average_rating?: string
  review_count: number
  created_at: string
  updated_at: string
  images?: ProductImage[]
  variants?: ProductVariant[]
  categories?: Category[]
  reviews?: Review[]
}

export interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  search?: string
  min_price?: number
  max_price?: number
  color?: string
  size?: string
  brand?: string
  gender?: string
  sort?: string
  order?: "ASC" | "DESC"
  featured?: boolean
  trending?: boolean
  new_arrivals?: boolean
  on_sale?: boolean
}

export interface FilterOptions {
  colors: Array<{ name: string; value: string; count: number }>
  sizes: Array<{ name: string; value: string; count: number }>
  brands: Array<{ name: string; value: string; count: number }>
  categories: Array<{ name: string; value: string; count: number }>
  priceRange: { min: number; max: number }
}

class ProductService {
  async getProducts(filters: ProductFilters = {}): Promise<PaginationResponse<Product>> {
    return apiClient.get<PaginationResponse<Product>>("/products", filters)
  }

  async getProduct(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`)
  }

  async getRelatedProducts(id: string, limit = 4): Promise<{ products: Product[] }> {
    return apiClient.get<{ products: Product[] }>(`/products/${id}/related`, { limit: limit.toString() })
  }

  async getRecentlyViewed(limit = 4): Promise<{ products: Product[] }> {
    return apiClient.get<{ products: Product[] }>("/products/user/recently-viewed", { limit: limit.toString() })
  }

  async getFeaturedProducts(limit = 8): Promise<{ products: Product[] }> {
    return apiClient.get<{ products: Product[] }>("/products", { featured: "true", limit: limit.toString() })
  }

  async getTrendingProducts(limit = 8): Promise<{ products: Product[] }> {
    return apiClient.get<{ products: Product[] }>("/products", { trending: "true", limit: limit.toString() })
  }

  async getNewArrivals(limit = 8): Promise<{ products: Product[] }> {
    return apiClient.get<{ products: Product[] }>("/products", { new_arrivals: "true", limit: limit.toString() })
  }

  async getOnSaleProducts(limit = 8): Promise<{ products: Product[] }> {
    return apiClient.get<{ products: Product[] }>("/products", { on_sale: "true", limit: limit.toString() })
  }

  async searchProducts(query: string, filters: ProductFilters = {}): Promise<PaginationResponse<Product>> {
    return this.getProducts({ ...filters, search: query })
  }

  async getSaleProducts(limit = 8): Promise<{ products: Product[] }> {
    return this.getProducts({ on_sale: true, limit })
  }

  async getCategories(parentId?: number): Promise<{ categories: Category[] }> {
    const params = parentId !== undefined ? { parent_id: parentId.toString() } : {}
    return apiClient.get<{ categories: Category[] }>("/categories", params)
  }

  async getCategory(slug: string): Promise<{ category: Category }> {
    return apiClient.get<{ category: Category }>(`/categories/${slug}`)
  }

  async getProductReviews(
    productId: number,
    page = 1,
    limit = 10,
    rating?: number,
  ): Promise<{
    reviews: Review[]
    statistics: {
      average_rating: string
      total_reviews: number
      five_star: number
      four_star: number
      three_star: number
      two_star: number
      one_star: number
    }
  }> {
    const params: Record<string, string> = { page: page.toString(), limit: limit.toString() }
    if (rating) params.rating = rating.toString()

    return apiClient.get(`/reviews/product/${productId}`, params)
  }

  async createReview(
    productId: number,
    review: {
      rating: number
      title?: string
      comment?: string
    },
  ): Promise<{ message: string; review_id: number }> {
    return apiClient?.post("/reviews", { product_id: productId, ...review })
  }

  async createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> {
    return apiClient?.post<Product>("/products", product)
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return apiClient?.put<Product>(`/products/${id}`, product)
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    return apiClient?.delete<{ message: string }>(`/products/${id}`)
  }

  // New methods for category listing
  async getProductsByCategory(
    categorySlug: string,
    filters: ProductFilters = {},
  ): Promise<PaginationResponse<Product>> {
    return this.getProducts({ ...filters, category: categorySlug })
  }

  async getFilterOptions(categorySlug?: string): Promise<FilterOptions> {
    const params = categorySlug ? { category: categorySlug } : {}
    return apiClient.get<FilterOptions>("/products", params)
  }

  async getFlashDeals(limit = 8): Promise<Product[]> {
    const response = await this.getProducts({ on_sale: true, limit, sort: "created_at", order: "DESC" })
    return response?.data
  }

  async getTopTrends(limit = 6): Promise<Product[]> {
    const response = await this.getProducts({ trending: true, limit })
    return response?.data
  }

  async getSuperDeals(limit = 8): Promise<Product[]> {
    const response = await this.getProducts({ on_sale: true, limit, sort: "discount", order: "DESC" })
    return response?.data
  }

  async getRandomProducts(limit = 4): Promise<Product[]> {
    const response = await this.getProducts({ limit, sort: "random" })
    return response?.data
  }
}

export const productService = new ProductService()
