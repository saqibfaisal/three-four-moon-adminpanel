"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Link from "next/link"
import Image from "next/image"
import { productService, type Product } from "@/services/productService"

export function HeroBanner() {
  const { translate } = useInternationalization()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productService.getFeaturedProducts(2)
      setFeaturedProducts(response.products.slice(0, 2))
    } catch (error) {
      console.error("Failed to fetch featured products:", error)
      // Fallback to default products
      setFeaturedProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 overflow-hidden">
      <div className="relative h-48 flex items-center">
        <div className="absolute left-4 z-10">
          <h2 className="text-white text-2xl font-bold mb-1">WHERE</h2>
          <h2 className="text-yellow-300 text-2xl font-bold mb-2">TRENDS BEGIN</h2>
          <Link href="/sale">
            <Button size="sm" className="bg-white text-teal-600 hover:bg-gray-100 font-medium">
              SAVE NOW
            </Button>
          </Link>
        </div>

        <div className="absolute right-0 top-0 h-full w-2/3">
          <Image
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=200&fit=crop"
            alt="Fashion Model"
            fill
            className="object-cover object-left"
          />
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          {loading ? (
            <>
              <div className="bg-white rounded-lg p-2 shadow-sm animate-pulse">
                <div className="w-[60px] h-[60px] bg-gray-200 rounded" />
                <div className="w-12 h-3 bg-gray-200 rounded mt-1" />
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm animate-pulse">
                <div className="w-[60px] h-[60px] bg-gray-200 rounded" />
                <div className="w-12 h-3 bg-gray-200 rounded mt-1" />
              </div>
            </>
          ) : (
            featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white rounded-lg p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <Image
                    src={product.primary_image || "/placeholder.svg"}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded object-cover w-[60ppx] h-[60px]"
                  />
                  <p className="text-xs text-center mt-1 font-medium">${product.price}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
