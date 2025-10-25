"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { type ProductFilters } from "@/services/productService"

interface SearchFiltersProps {
  filters: ProductFilters
  onFilterChange: (newFilters: Partial<ProductFilters>) => void
  activeFilters: { type: string; value: string }[]
  removeFilter: (type: string) => void
}

const staticCategories = [
    { name: "Dresses", value: "dresses" },
    { name: "Tops", value: "tops" },
    { name: "Bottoms", value: "bottoms" },
    { name: "Outerwear", value: "outerwear" },
    { name: "Accessories", value: "accessories" },
];

const staticSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const staticColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#EF4444" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Pink", value: "#EC4899" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Purple", value: "#8B5CF6" },
];

export function SearchFilters({
  filters,
  onFilterChange,
  activeFilters,
  removeFilter,
}: SearchFiltersProps) {
  const handlePriceChange = (value: number[]) => {
    onFilterChange({ min_price: value[0], max_price: value[1] })
  }

  const handleCategoryChange = (category: string) => {
    onFilterChange({ category: filters.category === category ? undefined : category })
  }

  const handleSizeChange = (size: string) => {
    onFilterChange({ size: filters.size === size ? undefined : size })
  }

  const handleColorChange = (color: string) => {
    onFilterChange({ color: filters.color === color ? undefined : color })
  }
  
  const clearAllFilters = () => {
    removeFilter('Category');
    removeFilter('Size');
    removeFilter('Color');
    removeFilter('Brand');
    removeFilter('Price');
  }

  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="bg-white rounded-lg p-6 sticky top-24">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {activeFilters.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Active</h3>
              <Button variant="ghost" size="sm" className="text-xs text-gray-500" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter.type} variant="secondary" className="gap-1">
                  {filter.value}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter.type)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
          <Slider
            value={[filters.min_price || 0, filters.max_price || 1000]}
            onValueChange={handlePriceChange}
            max={1000}
            min={0}
            step={10}
            className="w-full mb-3"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${filters.min_price || 0}</span>
            <span>${filters.max_price || 1000}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            {staticCategories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={category.value}
                  checked={filters.category === category.value}
                  onCheckedChange={() => handleCategoryChange(category.value)}
                />
                <label htmlFor={category.value} className="text-sm text-gray-700 cursor-pointer">
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Size</h3>
          <div className="grid grid-cols-3 gap-2">
            {staticSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`py-2 px-3 border rounded text-sm ${
                  filters.size === size
                    ? "border-gray-800 bg-gray-100"
                    : "hover:border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Color</h3>
          <div className="grid grid-cols-5 gap-2">
            {staticColors.map((color) => (
              <div
                key={color.name}
                onClick={() => handleColorChange(color.value)}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                  filters.color === color.value
                    ? "border-gray-800 ring-2 ring-offset-2 ring-gray-600"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}