"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/ui/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { productService, type Product } from "@/services/productService"

export function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const response = await productService.getRecentlyViewed(4)
        setProducts(response.products)
      } catch (error) {
        console.error("Failed to fetch recently viewed products:", error)
        // Don't show error to user, just hide the section
      } finally {
        setLoading(false)
      }
    }

    // fetchRecentlyViewed()
  }, [])

  if (loading) {
    return (
      <section className="py-8 border-t">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Don't render if no recently viewed products
  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-8 border-t">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.compare_price,
              image: product.primary_image || product.images?.[0]?.image_url || "/placeholder.svg",
              rating: product.average_rating ? Number.parseFloat(product.average_rating) : 0,
              discount: product.compare_price
                ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
                : 0,
            }}
          />
        ))}
      </div>
    </section>
  )
}
