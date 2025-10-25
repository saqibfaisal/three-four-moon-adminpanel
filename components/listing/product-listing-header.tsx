"use client"

import { Grid3X3, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductListingHeaderProps {
  categoryName?: string
  totalProducts?: number
  itemsPerPage?: number
  currentPage?: number
  productsPerPage?: number
  viewMode?: "grid" | "list"
  onViewModeChange?: (mode: "grid" | "list") => void
  onSortChange?: (sort: string) => void
  onFilterToggle?: () => void
  sortBy?: string
}

export function ProductListingHeader({
  categoryName = "Products",
  totalProducts = 0,
  currentPage = 1,
  productsPerPage = 24,
  viewMode = "grid",
  onViewModeChange,
  onSortChange,
  itemsPerPage,
  onFilterToggle,
  sortBy = "popularity",
}: ProductListingHeaderProps) {
  const formatCategoryName = (name: string) => {
    return (
      name.charAt(0).toUpperCase() +
      name
        .slice(1)
        .replace(/([A-Z])/g, " $1")
        .trim()
    )
  }

  const startItem = (currentPage - 1) * productsPerPage + 1
  const endItem = Math.min(currentPage * productsPerPage, totalProducts)

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{formatCategoryName(categoryName)}</h1>
        <p className="text-gray-600">
          {totalProducts > 0 ? (
            <>
              Showing {startItem}-{endItem} of {totalProducts.toLocaleString()} items
            </>
          ) : (
            "No items found"
          )}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="discount">Highest Discount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={viewMode === "grid" ? "text-gray-900" : "text-gray-400"}
            onClick={() => onViewModeChange?.("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={viewMode === "list" ? "text-gray-900" : "text-gray-400"}
            onClick={() => onViewModeChange?.("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" size="sm" className="lg:hidden bg-transparent" onClick={onFilterToggle}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  )
}
