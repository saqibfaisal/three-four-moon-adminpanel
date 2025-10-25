"use client"

import { useState } from "react"
import { Grid3X3, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/ui/product-card"
import { type Product } from "@/services/productService"

interface SearchResultsProps {
  products: Product[]
  query: string
}

export function SearchResults({ products, query }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="flex-1">
      {/* Search Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b bg-white rounded-lg p-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Search Results {query && `for "${query}"`}
          </h1>
          <p className="text-gray-600">{products?.length} items found</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      {products.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
            <p className="text-lg text-gray-500">No products found matching your criteria.</p>
        </div>
      )}

      {/* Load More - This can be implemented with pagination later */}
      {products.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            Load More Results
          </Button>
        </div>
      )}
    </div>
  )
}
