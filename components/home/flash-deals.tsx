"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { ProductCard } from "@/components/ui/product-card"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import { productService, type Product } from "@/services/productService"

export function FlashDeals() {
  const { translate } = useInternationalization()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState("23:45:12")

  useEffect(() => {
    fetchFlashDeals()

    // Update countdown timer
    const timer = setInterval(() => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      const diff = endOfDay.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchFlashDeals = async () => {
    try {
      const response = await productService.getTrendingProducts(3)
      setProducts(response.products)
    } catch (error) {
      console.error("Failed to fetch flash deals:", error)
      // Fallback to default products
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{translate("flash.deals")}</h2>
          <div className="flex items-center gap-2 text-red-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">--:--:--</span>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-40 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-2" />
              <div className="w-3/4 h-4 bg-gray-200 rounded mb-1" />
              <div className="w-1/2 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{translate("flash.deals")}</h2>
        <div className="flex items-center gap-2 text-red-500">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">{timeLeft}</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-40">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
