"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const activeFilters = [
  { id: "1", label: "Dresses", type: "category" },
  { id: "2", label: "$20-$50", type: "price" },
  { id: "3", label: "Size M", type: "size" },
]

export function ProductFilters() {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium">Active Filters:</span>
        <Button variant="ghost" size="sm" className="text-xs">
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <Badge key={filter.id} variant="secondary" className="gap-1">
            {filter.label}
            <X className="h-3 w-3 cursor-pointer" />
          </Badge>
        ))}
      </div>
    </div>
  )
}
