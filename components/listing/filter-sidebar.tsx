"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { productService, type FilterOptions } from "@/services/productService"
import { useInternationalization } from "@/components/providers/internationalization-provider"

interface FilterSidebarProps {
  categorySlug?: string
  onFiltersChange?: (filters: any) => void
  initialFilters?: any
}

export function FilterSidebar({ categorySlug, onFiltersChange, initialFilters = {} }: FilterSidebarProps) {
  const { formatPrice } = useInternationalization()
  const [expandedSections, setExpandedSections] = useState<string[]>(["Price", "Size", "Color"])
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(initialFilters)
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFilterOptions()
  }, [categorySlug])

  const loadFilterOptions = async () => {
    try {
    console.log("Fetching filter options for category:", categorySlug)
      setLoading(true)
      const options = await productService.getFilterOptions(categorySlug)
      
      setFilterOptions(options?.products || [])

      if (options.priceRange) {
        setPriceRange([options.priceRange.min, options.priceRange.max])
      }
    } catch (error) {
      console.error("Error loading filter options:", error)
      // Set fallback filter options
      setFilterOptions({
        colors: [
          { name: "Black", value: "black", count: 45 },
          { name: "White", value: "white", count: 38 },
          { name: "Red", value: "red", count: 22 },
          { name: "Blue", value: "blue", count: 31 },
          { name: "Green", value: "green", count: 18 },
          { name: "Pink", value: "pink", count: 25 },
        ],
        sizes: [
          { name: "XS", value: "xs", count: 12 },
          { name: "S", value: "s", count: 28 },
          { name: "M", value: "m", count: 35 },
          { name: "L", value: "l", count: 42 },
          { name: "XL", value: "xl", count: 25 },
          { name: "XXL", value: "xxl", count: 15 },
        ],
        brands: [
          { name: "Three Fourth Moon", value: "three-fourth-moon", count: 89 },
          { name: "Fashion Co", value: "fashion-co", count: 67 },
          { name: "Style House", value: "style-house", count: 45 },
        ],
        priceRange: { min: 0, max: 200 },
        categories: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleFilterChange = (filterType: string, value: any, checked?: boolean) => {
    const newFilters = { ...activeFilters }

    if (filterType === "price") {
      newFilters.min_price = value[0]
      newFilters.max_price = value[1]
      setPriceRange(value)
    } else if (Array.isArray(newFilters[filterType])) {
      if (checked) {
        newFilters[filterType] = [...(newFilters[filterType] || []), value]
      } else {
        newFilters[filterType] = (newFilters[filterType] || []).filter((item: any) => item !== value)
      }
    } else {
      if (checked) {
        newFilters[filterType] = [value]
      } else {
        delete newFilters[filterType]
      }
    }

    setActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const removeFilter = (filterType: string, value?: any) => {
    const newFilters = { ...activeFilters }

    if (filterType === "price") {
      delete newFilters.min_price
      delete newFilters.max_price
      setPriceRange([filterOptions?.priceRange.min || 0, filterOptions?.priceRange.max || 200])
    } else if (value !== undefined) {
      newFilters[filterType] = (newFilters[filterType] || []).filter((item: any) => item !== value)
      if (newFilters[filterType].length === 0) {
        delete newFilters[filterType]
      }
    } else {
      delete newFilters[filterType]
    }

    setActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setPriceRange([filterOptions?.priceRange.min || 0, filterOptions?.priceRange.max || 200])
    onFiltersChange?.({})
  }

  const getActiveFilterLabels = () => {
    const labels: Array<{ key: string; label: string; value?: any }> = []

    if (activeFilters.min_price !== undefined || activeFilters.max_price !== undefined) {
      labels.push({
        key: "price",
        label: `Price: ${formatPrice(activeFilters.min_price || 0)} - ${formatPrice(activeFilters.max_price || 200)}`,
      })
    }

    Object.entries(activeFilters).forEach(([key, values]) => {
      if (key !== "min_price" && key !== "max_price" && Array.isArray(values)) {
        values.forEach((value) => {
          labels.push({
            key,
            label: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
            value,
          })
        })
      }
    })

    return labels
  }

  if (loading) {
    return (
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-32">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b border-gray-200 pb-4">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const activeFilterLabels = getActiveFilterLabels()

  return (
    <div className=" w-64 flex-shrink-0">
      <div className="sticky top-32">
        {/* Active Filters */}
        {activeFilterLabels.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Active Filters</h3>
              <Button variant="ghost" size="sm" className="text-xs text-gray-500" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilterLabels.map((filter, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {filter.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter.key, filter.value)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filter Sections */}
        <div className="space-y-4">
          {/* Price Filter */}
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection("Price")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="font-semibold text-gray-900">Price</h3>
              {expandedSections.includes("Price") ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.includes("Price") && (
              <div className="mt-3 space-y-3">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => handleFilterChange("price", value)}
                  max={filterOptions?.priceRange?.max || 200}
                  min={filterOptions?.priceRange?.min || 0}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            )}
          </div>

          {/* Size Filter */}
          {filterOptions?.sizes && filterOptions.sizes.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => toggleSection("Size")}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-semibold text-gray-900">Size</h3>
                {expandedSections.includes("Size") ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSections.includes("Size") && (
                <div className="mt-3 space-y-2">
                  {filterOptions.sizes.map((size:any) => (
                    <div key={size.value} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={size.value}
                          checked={(activeFilters.size || []).includes(size.value)}
                          onCheckedChange={(checked) => handleFilterChange("size", size.value, checked as boolean)}
                        />
                        <label htmlFor={size.value} className="text-sm text-gray-700 cursor-pointer">
                          {size.name}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">({size.count})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Color Filter */}
          {filterOptions?.colors && filterOptions.colors.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => toggleSection("Color")}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-semibold text-gray-900">Color</h3>
                {expandedSections.includes("Color") ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSections.includes("Color") && (
                <div className="mt-3 space-y-2">
                  {filterOptions.colors.map((color:any) => (
                    <div key={color.value} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={color.value}
                          checked={(activeFilters.color || []).includes(color.value)}
                          onCheckedChange={(checked) => handleFilterChange("color", color.value, checked as boolean)}
                        />
                        <label htmlFor={color.value} className="text-sm text-gray-700 cursor-pointer">
                          {color.name}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">({color.count})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Brand Filter */}
          {filterOptions?.brands && filterOptions.brands.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => toggleSection("Brand")}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-semibold text-gray-900">Brand</h3>
                {expandedSections.includes("Brand") ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSections.includes("Brand") && (
                <div className="mt-3 space-y-2">
                  {filterOptions.brands.map((brand:any) => (
                    <div key={brand.value} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={brand.value}
                          checked={(activeFilters.brand || []).includes(brand.value)}
                          onCheckedChange={(checked) => handleFilterChange("brand", brand.value, checked as boolean)}
                        />
                        <label htmlFor={brand.value} className="text-sm text-gray-700 cursor-pointer">
                          {brand.name}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">({brand.count})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
