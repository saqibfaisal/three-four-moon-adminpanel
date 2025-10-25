"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { useInternationalization } from "@/components/providers/internationalization-provider"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  categoryId: string
  sku: string
  stock: number
  featured: boolean
  rating: number
  reviewCount: number
  colors?: string[]
  sizes?: string[]
  countryAvailability: string[]
  createdAt: string
  updatedAt: string
}

export function useProducts(params?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  page?: number
  limit?: number
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const { currentCountry } = useInternationalization()

  useEffect(() => {
    fetchProducts()
  }, [params, currentCountry])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiService.getProducts({
        ...params,
        country: currentCountry,
      })

      setProducts(response.products)
      setTotal(response.total)
      setTotalPages(response.totalPages)
      setCurrentPage(response.page)
    } catch (err: any) {
      setError(err.message || "Failed to fetch products")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchProducts()
  }

  return {
    products,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    refetch,
  }
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getFeaturedProducts()
      setProducts(response)
    } catch (err: any) {
      setError(err.message || "Failed to fetch featured products")
      console.error("Error fetching featured products:", err)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchFeaturedProducts }
}

export function useTrendingProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getTrendingProducts()
      setProducts(response)
    } catch (err: any) {
      setError(err.message || "Failed to fetch trending products")
      console.error("Error fetching trending products:", err)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchTrendingProducts }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getProduct(id)
      setProduct(response)
    } catch (err: any) {
      setError(err.message || "Failed to fetch product")
      console.error("Error fetching product:", err)
    } finally {
      setLoading(false)
    }
  }

  return { product, loading, error, refetch: fetchProduct }
}
