"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/ui/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { productService, type Product } from "@/services/productService"

interface RelatedProductsProps {
  productId: string
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await productService.getRelatedProducts(productId, 4)
        setProducts(response.products)
      } catch (error) {
        console.error("Failed to fetch related products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchRelatedProducts()
    }
  }, [productId])

  if (loading) {
    return (
      <section className="py-8">
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

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.compare_price,
              primary_image: product.primary_image || product.images?.[0]?.image_url || "/placeholder.svg",
              rating: product.average_rating ? Number.parseFloat(product.average_rating) : "0",
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
