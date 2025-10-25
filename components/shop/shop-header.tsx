"use client"

import { SlidersHorizontal, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ShopHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h1 className="text-lg font-semibold">All Products</h1>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="icon">
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
