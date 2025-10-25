"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { categoryService, type Category } from "@/services/categoryService"

export function DesktopCategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data: any = await categoryService.getCategories()
      setCategories((data.categories || []).slice(0, 12)) // Limit to 12 categories
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      // Fallback data
      setCategories([
        {
          id: 1,
          name: "Women",
          image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=120&h=120&fit=crop",


          product_count: 0,
          created_at: "",
          updated_at: ""
        },
        {
          id: 2,
          name: "Men",
          image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",

          product_count: 0,
          created_at: "",
          updated_at: ""
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-3"></div>
              <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`} className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow">
              <Image
                src={category.image_url || "/placeholder.svg"}
                alt={category.name}
                width={80}
                height={80}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-sm text-center text-gray-700 leading-tight group-hover:text-gray-900">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
