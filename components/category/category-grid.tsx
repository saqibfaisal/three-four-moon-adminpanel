"use client"

import { CategoryCard } from "@/components/category/category-card"
import type { Category } from "@/services/categoryService"

interface CategoryGridProps {
  categories: Category[]
  viewMode: "grid" | "list"
}

export function CategoryGrid({ categories, viewMode }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">Categories will appear here once they are added.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`grid ${
        viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"
      } gap-4`}
    >
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} layout={viewMode} />
      ))}
    </div>
  )
}
