"use client"

import { Home, Grid3X3, TrendingUp, ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNavigation() {
  const { totalItems } = useCart()
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Home", href: "/", active: pathname === "/" },
    { icon: Grid3X3, label: "Category", href: "/category", active: pathname.startsWith("/category") },
    { icon: TrendingUp, label: "Trends", href: "/trending", active: pathname === "/trending" },
    { icon: ShoppingBag, label: "Cart", href: "/cart", badge: totalItems, active: pathname === "/cart" },
    { icon: User, label: "Me", href: "/profile", active: pathname.startsWith("/profile") },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative ${
                item.active ? "text-teal-500" : "text-gray-600"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <Badge className="absolute -top-1 d-flex items-center justify-center -right-1 h-4 w-4 rounded-full p-0 text-xs bg-red-500">
                  {item.badge}
                </Badge>
              ):null}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}
