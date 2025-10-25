"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/ui/product-card"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import { productService, type Product } from "@/services/productService"

export function TrendingProducts() {
  const { translate } = useInternationalization()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      const response = await productService.getTrendingProducts(4)
      setProducts(response.products)
    } catch (error) {
      console.error("Failed to fetch trending products:", error)
      // Fallback to default products
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="p-4">
        <h2 className="text-xl font-bold mb-4">{translate("trending.now")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-3">
                <div className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
                <div className="w-1/2 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4">{translate("trending.now")}</h2>

      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
