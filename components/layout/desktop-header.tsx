"use client"

import type React from "react"

import { Search, Heart, ShoppingBag, User, ChevronDown, Truck, RotateCcw, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CountrySelector } from "@/components/ui/country-selector"
import { useCart } from "@/components/providers/cart-provider"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function DesktopHeader() {
  const { totalItems } = useCart()
  const { currentConfig } = useInternationalization()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top Promotional Bar - SHEIN Style */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-gray-700">
                <Truck className="h-4 w-4 text-green-600" />
                <span className="font-medium">FREE STANDARD SHIPPING</span>
                <span className="text-xs text-gray-500">*CONDITIONS APPLY</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-gray-700">
                <RotateCcw className="h-4 w-4 text-blue-600" />
                <span className="font-medium">FREE RETURNS</span>
                <span className="text-xs text-gray-500">*CONDITIONS APPLY</span>
              </div>
              <div className="hidden xl:flex items-center gap-2 text-gray-700">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="font-medium">PRICE DROP</span>
                <span className="text-xs text-gray-500">PRICING & TARIFF FAQ</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CountrySelector />
              <Link href="/help" className="text-gray-600 hover:text-gray-900 text-sm">
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img src="/logo.jpg" width={80} height={50} alt="Logo" />
            </Link>
          </div>

          {/* Search Bar - SHEIN Style */}
          <div className="flex-1 max-w-2xl">
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

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white font-medium min-w-[20px]">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Menu - SHEIN Style */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-8 py-3 overflow-x-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/category/women">Women</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/category/men">Men</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/category/kids">Kids</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/just-for-you">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Just For You
              </Button>
            </Link>

            <Link href="/new-arrivals">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                New In
              </Button>
            </Link>

            <Link href="/sale">
              <Button variant="ghost" className="text-red-500 hover:text-red-600 font-medium">
                Sale
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                  Women Clothing <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/category/women/dresses">Dresses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/category/women/tops">Tops</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/category/women/bottoms">Bottoms</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/category/beachwear">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Beachwear
              </Button>
            </Link>

            <Link href="/category/kids">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Kids
              </Button>
            </Link>

            <Link href="/category/curve">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Curve
              </Button>
            </Link>

            <Link href="/category/men">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Men Clothing
              </Button>
            </Link>

            <Link href="/category/shoes">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Shoes
              </Button>
            </Link>

            <Link href="/category/underwear">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Underwear & Sleepwear
              </Button>
            </Link>

            <Link href="/category/home">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Home & Kitchen
              </Button>
            </Link>

            <Link href="/category/jewelry">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Jewelry & Accessories
              </Button>
            </Link>

            <Link href="/category/beauty">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Beauty & Health
              </Button>
            </Link>

            <Link href="/category/baby">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Baby & Maternity
              </Button>
            </Link>

            <Link href="/category/bags">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Bags & Luggage
              </Button>
            </Link>

            <Link href="/category/sports">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Sports & Outdoors
              </Button>
            </Link>

            <Link href="/category/home-textiles">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
                Home Textiles
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
