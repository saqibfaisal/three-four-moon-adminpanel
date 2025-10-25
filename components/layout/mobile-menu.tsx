"use client"

import { X, Grid3X3, User, Settings, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Link from "next/link"
import { CountrySelector } from "../ui/country-selector"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuCategories = [
  { name: "Women", href: "/category/women", subcategories: ["Dresses", "Tops", "Bottoms", "Outerwear"] },
  { name: "Men", href: "/category/men", subcategories: ["Shirts", "Pants", "Jackets", "Accessories"] },
  { name: "Kids", href: "/category/kids", subcategories: ["Girls", "Boys", "Baby", "Shoes"] },
  { name: "Home", href: "/category/home", subcategories: ["Decor", "Kitchen", "Bedroom", "Bath"] },
  { name: "Beauty", href: "/category/beauty", subcategories: ["Makeup", "Skincare", "Hair", "Fragrance"] },
]

const quickLinks = [
  { name: "New Arrivals", href: "/new-arrivals" },
  { name: "Sale", href: "/sale" },
  { name: "Trending", href: "/trending" },
  // { name: "Gift Cards", href: "/gift-cards" },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { translate } = useInternationalization()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {/* User Section */}
          <div className="p-4 border-b">
            <Link href="/profile" onClick={onClose} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Welcome!</p>
                <p className="text-sm text-gray-600">Sign in for better experience</p>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3">Quick Access</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-gray-700 hover:text-gray-900"
                >
                  {link.name}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="p-4">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-1">
              {menuCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-3 text-gray-700 hover:text-gray-900"
                >
                  {category.name}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Account Links */}
          <div className="p-4 pb-[100px] border-t">
            <div className="space-y-2">
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 py-2 text-gray-700 hover:text-gray-900"
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 py-2 text-gray-700 hover:text-gray-900"
              >
                <Grid3X3 className="h-4 w-4" />
                My Orders
              </Link>
              <Link
                href="/profile/settings"
                onClick={onClose}
                className="flex items-center gap-3 py-2 text-gray-700 hover:text-gray-900"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <hr/>
              <CountrySelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
