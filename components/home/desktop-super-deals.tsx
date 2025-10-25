"use client"

import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { productService, type Product } from "@/services/productService"

export function DesktopSuperDeals() {
  const { formatPrice } = useInternationalization()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [superDealsProducts, setSuperDealsProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerView = 6

  useEffect(() => {
    fetchSuperDeals()
  }, [])

  const fetchSuperDeals = async () => {
    try {
      setLoading(true)
      const products = await productService.getSaleProducts(12)
      console.log('Fetched super deals products:', products)
      setSuperDealsProducts(products.products || [])
    } catch (error) {
      console.error("Failed to fetch super deals:", error)
      // Fallback data
      setSuperDealsProducts([])
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerView) % superDealsProducts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - itemsPerView + superDealsProducts.length) % superDealsProducts.length)
  }

  const visibleProducts = superDealsProducts.slice(currentIndex, currentIndex + itemsPerView)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 italic">Super Deals</h2>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 italic">Super Deals</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-50"
              disabled={superDealsProducts.length <= itemsPerView}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-50"
              disabled={superDealsProducts.length <= itemsPerView}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Link href="/sale" className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
          Save big now! <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {visibleProducts.map((product) => {
          const discount = product.compare_price 
            ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
            : 0

          return (
            <Link key={product.id} href={`/product/${product.id}`} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <Image
                    src={product.primary_image || "/placeholder.svg"}
                    alt={product.name}
                    width={200}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.is_on_sale && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1">Flash Sale</Badge>
                  )}
                  {discount > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-xs px-2 py-1">-{discount}%</Badge>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-start flex-col gap-2">
                    <span className="text-lg font-bold text-red-500">{formatPrice(product.price)}</span>
                    {product.compare_price && (
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.compare_price)}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
