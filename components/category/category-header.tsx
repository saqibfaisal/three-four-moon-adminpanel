"use client"

import { Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryHeaderProps {
  totalCategories: number
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export function CategoryHeader({ totalCategories, viewMode, onViewModeChange }: CategoryHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">All Categories</h1>
        <p className="text-gray-600">
          {totalCategories > 0 ? `Browse ${totalCategories.toLocaleString()} categories` : "No categories found"}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={viewMode === "grid" ? "text-gray-900" : "text-gray-400"}
          onClick={() => onViewModeChange("grid")}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={viewMode === "list" ? "text-gray-900" : "text-gray-400"}
          onClick={() => onViewModeChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
