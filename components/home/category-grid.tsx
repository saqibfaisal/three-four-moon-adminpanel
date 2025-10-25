"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { categoryService, type Category } from "@/services/categoryService"

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data: any = await categoryService.getCategories()
      setCategories((data.categories || []).slice(0, 8))
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      // Fallback to default categories
      setCategories([
        {
          id: 1,
          name: "Women",
          slug: "women",
          image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=80&h=80&fit=crop",
          is_active: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: 2,
          name: "Men",
          slug: "men",
          image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
          is_active: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: 3,
          name: "Kids",
          slug: "kids",
          image_url: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=80&h=80&fit=crop",
          is_active: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: 4,
          name: "Shoes",
          slug: "shoes",
          image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop",
          is_active: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: 5,
          name: "Beauty",
          slug: "beauty",
          image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop",
          is_active: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: 6,
          name: "Home",
          slug: "home",
          image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80&h=80&fit=crop",
          is_active: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: 7,
          name: "Sports",
          slug: "sports",
          image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop",
          is_active: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: 8,
          name: "Curve",
          slug: "curve",
          image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&h=80&fit=crop",
          is_active: true,
          created_at: "",
          updated_at: "",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 bg-white">
        <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Shop by Category</h2>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse mb-2" />
              <div className="w-12 h-3 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 bg-white">
      <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Shop by Category</h2>
      <div className="grid grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`} className="flex flex-col items-center group">
            <div className="w-14 h-14 rounded-full overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-all duration-200 ring-2 ring-gray-100 group-hover:ring-gray-200">
              <Image
                src={category.image_url || "/placeholder.svg"}
                alt={category.name}
                width={56}
                height={56}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
            </div>
            <span className="text-xs text-center text-gray-700 leading-tight group-hover:text-gray-900 font-medium max-w-full">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
