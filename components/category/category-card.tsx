"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/services/categoryService"
import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  category: Category
  layout?: "grid" | "list"
  className?: string
}

export function CategoryCard({ category, layout = "grid", className = "" }: CategoryCardProps) {
  if (layout === "list") {
    return (
      <Link href={`/category/${category.slug}`}>
        <div
          className={`group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}
        >
          <div className="flex items-center p-4 gap-4">
            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={category.image_url || "/placeholder.svg?height=80&width=80&query=category"}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{category.description}</p>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {category.product_count} items
                </Badge>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button variant="ghost" size="sm" className="group-hover:bg-gray-100">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/category/${category.slug}`}>
      <div
        className={`group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={category.image_url || "/placeholder.svg?height=200&width=200&query=category"}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Product Count Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/70 text-white text-xs">{category.product_count} items</Badge>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button size="sm" className="bg-white text-black hover:bg-gray-100">
              Browse Category
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Category Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
            {category.name}
          </h3>
          {category.description && <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>}
        </div>
      </div>
    </Link>
  )
}
