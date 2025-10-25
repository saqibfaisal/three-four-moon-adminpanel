"use client"

import { Search, Heart, ShoppingBag, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import Link from "next/link"
import { useState } from "react"
import { MobileMenu } from "./mobile-menu"

export function MobileHeader() {
  const { totalItems } = useCart()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => setShowMenu(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 text-center">
             <Link href="/">
              <img src="/logo.jpg" width={80} height={50} alt="Logo" />
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-gray-600 relative">
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
      </header>

      <MobileMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
    </>
  )
}
