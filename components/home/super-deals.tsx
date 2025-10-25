"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Image from "next/image"
import Link from "next/link"
import { productService, type Product } from "@/services/productService"

export function SuperDeals() {
  const { formatPrice } = useInternationalization()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSaleProducts()
  }, [])

  const fetchSaleProducts = async () => {
    try {
      const response = await productService.getOnSaleProducts(4)
      setProducts(response.products)
    } catch (error) {
      console.error("Failed to fetch sale products:", error)
      // Fallback to default products
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const calculateDiscount = (price: number, comparePrice?: number) => {
    if (!comparePrice) return 0
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  if (loading) {
    return (
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Super Deals</h2>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-32">
              <div className="w-full h-32 bg-gray-200 animate-pulse rounded-lg mb-2" />
              <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Super Deals</h2>
        <Link href="/sale">
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((product) => {
          const discount = calculateDiscount(product.price, product.compare_price)
          return (
            <Link key={product.id} href={`/product/${product.id}`} className="flex-shrink-0 w-32">
              <div className="relative">
                <Image
                  src={product.primary_image || "/placeholder.svg"}
                  alt={product.name}
                  width={128}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {product.is_on_sale && (
                  <Badge className="absolute top-1 left-1 bg-yellow-500 text-black text-xs px-1">Flash Sale</Badge>
                )}
                {discount > 0 && <Badge className="absolute top-1 right-1 bg-red-500 text-xs px-1">-{discount}%</Badge>}
              </div>
              <div className="mt-2">
                <p className="text-red-500 font-bold text-sm">{formatPrice(product.price)}</p>
                {product.compare_price && (
                  <p className="text-gray-400 text-xs line-through">{formatPrice(product.compare_price)}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
