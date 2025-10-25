"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { productService, type Product } from "@/services/productService"

export function DesktopHeroBanner() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const products = await productService.getFeaturedProducts(4)
      setFeaturedProducts(products.products)
    } catch (error) {
      console.error("Failed to fetch featured products:", error)
      // Fallback data
      setFeaturedProducts([
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-pink-100 via-purple-50 to-indigo-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[500px]">
          <div className="px-8 py-12 lg:py-20">
            <div className="max-w-lg">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                WHERE
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                  TRENDS
                </span>
                BEGIN
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover the latest fashion trends with up to 70% off on thousands of styles
              </p>
              <div className="flex gap-4">
                <Link href="/category/women">
                  <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                    Shop Women
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/category/men">
                  <Button size="lg" variant="outline">
                    Shop Men
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 p-8">
                <div className="space-y-4">
                  <div className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
                  <div className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
                  <div className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-8">
                <div className="space-y-4">
                  {featuredProducts.slice(0, 2).map((product, index) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <div className={`bg-white rounded-2xl p-4 shadow-lg transform ${
                        index === 0 ? 'rotate-3' : '-rotate-2'
                      } hover:rotate-0 transition-transform cursor-pointer`}>
                        <Image
                          src={product.primary_image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={250}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <p className="text-center mt-2 font-semibold">${product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="space-y-4 mt-8">
                  {featuredProducts.slice(2, 4).map((product, index) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <div className={`bg-white rounded-2xl p-4 shadow-lg transform ${
                        index === 0 ? '-rotate-1' : 'rotate-2'
                      } hover:rotate-0 transition-transform cursor-pointer`}>
                        <Image
                          src={product.primary_image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={250}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <p className="text-center mt-2 font-semibold">${product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
