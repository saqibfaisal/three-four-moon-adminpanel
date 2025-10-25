"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MobileSearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="p-4 bg-white border-b lg:hidden">
      <form onSubmit={handleSearch} className="relative">
        <Input
          placeholder="Search for items and brands..."
          className="w-full pl-4 pr-12 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
