"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/ui/product-card"
import { Button } from "@/components/ui/button"
import { productService, type Product } from "@/services/productService"
import { Loader2 } from "lucide-react"

interface ProductListingGridProps {
  categorySlug?: string
  filters?: any
  sortBy?: string
  viewMode?: "grid" | "list"
  searchQuery?: string
}

export function ProductListingGrid({
  categorySlug,
  filters = {},
  sortBy = "popularity",
  viewMode = "grid",
  searchQuery,
}: ProductListingGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const productsPerPage = 24

  useEffect(() => {
    setCurrentPage(1)
    loadProducts(1, true)
  }, [categorySlug, filters, sortBy, searchQuery])

  const loadProducts = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const [sortField, sortOrder] = getSortParams(sortBy)
      const searchFilters = {
        ...filters,
        page,
        limit: productsPerPage,
        sort: sortField,
        order: sortOrder,
        ...(searchQuery && { search: searchQuery }),
      }

      let response
      if (categorySlug) {
        response = await productService.getProductsByCategory(categorySlug, searchFilters)
      } else {
        const productsArray = await productService.getProducts(searchFilters)
        // Mock pagination response for general products
        response = {
          products: productsArray.products || [],
          total: productsArray.products.length || 0,
          page,
          limit: productsPerPage,
          totalPages: Math.ceil(productsArray.products.length / productsPerPage),
        }
      }

      if (reset) {
        setProducts(response.products || [])
      } else {
        setProducts((prev) => [...prev, ...response.products])
      }

      setTotalProducts(response.total)
      setTotalPages(response.totalPages)
      setHasMore(page < response.totalPages)
      setCurrentPage(page)
    } catch (error) {
      console.error("Error loading products:", error)
      // Fallback to mock data
      if (reset) {
        setProducts(getMockProducts())
        setTotalProducts(6)
        setTotalPages(1)
        setHasMore(false)
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const getSortParams = (sortBy: string): [string, "ASC" | "DESC"] => {
    switch (sortBy) {
      case "price-low":
        return ["price", "ASC"]
      case "price-high":
        return ["price", "DESC"]
      case "newest":
        return ["created_at", "DESC"]
      case "rating":
        return ["average_rating", "DESC"]
      case "name":
        return ["name", "ASC"]
      case "discount":
        return ["discount_percentage", "DESC"]
      default:
        return ["popularity", "DESC"]
    }
  }

  const getMockProducts = (): Product[] => [
    {
      id: "1",
      name: "Elegant Long Dress With Collar",
      slug: "elegant-long-dress-with-collar",
      price: 24.99,
      compare_price: 49.99,
      sku: "ELD001",
      primary_image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
      average_rating: "4.5",
      review_count: 234,
      inventory_quantity: 50,
      is_active: true,
      is_featured: false,
      is_trending: true,
      is_new_arrival: false,
      is_on_sale: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Pleated Wrap Button Closure Dress",
      slug: "pleated-wrap-button-closure-dress",
      price: 32.99,
      compare_price: 59.99,
      sku: "PWB002",
      primary_image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      average_rating: "4.7",
      review_count: 156,
      inventory_quantity: 30,
      is_active: true,
      is_featured: true,
      is_trending: false,
      is_new_arrival: true,
      is_on_sale: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Summer Sleeveless Midi Dress",
      slug: "summer-sleeveless-midi-dress",
      price: 19.99,
      compare_price: 39.99,
      sku: "SSM003",
      primary_image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop",
      average_rating: "4.3",
      review_count: 89,
      inventory_quantity: 75,
      is_active: true,
      is_featured: false,
      is_trending: true,
      is_new_arrival: false,
      is_on_sale: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Vintage Floral Print Dress",
      slug: "vintage-floral-print-dress",
      price: 28.99,
      compare_price: 54.99,
      sku: "VFP004",
      primary_image: "https://images.unsplash.com/photo-1566479179817-c0b2b2b5b5b5?w=300&h=400&fit=crop",
      average_rating: "4.6",
      review_count: 312,
      inventory_quantity: 25,
      is_active: true,
      is_featured: true,
      is_trending: false,
      is_new_arrival: false,
      is_on_sale: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Casual A-Line Dress",
      slug: "casual-a-line-dress",
      price: 22.99,
      compare_price: 42.99,
      sku: "CAL005",
      primary_image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop",
      average_rating: "4.4",
      review_count: 178,
      inventory_quantity: 60,
      is_active: true,
      is_featured: false,
      is_trending: true,
      is_new_arrival: true,
      is_on_sale: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Bohemian Maxi Dress",
      slug: "bohemian-maxi-dress",
      price: 35.99,
      compare_price: 69.99,
      sku: "BMD006",
      primary_image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=400&fit=crop",
      average_rating: "4.8",
      review_count: 267,
      inventory_quantity: 40,
      is_active: true,
      is_featured: true,
      is_trending: false,
      is_new_arrival: false,
      is_on_sale: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadProducts(currentPage + 1, false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <div
        className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showColors showSizes layout={viewMode} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Showing {products.length} of {totalProducts.toLocaleString()} items
          </p>
          <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Products"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
