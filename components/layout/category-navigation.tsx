"use client"

import { useInternationalization } from "@/components/providers/internationalization-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"

const categories = [
  { id: "all", label: "All", href: "/" },
  { id: "women", label: "Women", href: "/category/women" },
  { id: "curve", label: "Curve", href: "/category/curve" },
  { id: "kids", label: "Kids", href: "/category/kids" },
  // { id: "quickship", label: "QuickShip", href: "/quickship" },
  { id: "men", label: "Men", href: "/category/men" },
  { id: "home", label: "Home", href: "/category/home" },
  { id: "beauty", label: "Beauty", href: "/category/beauty" },
]

export function CategoryNavigation() {
  const { currentConfig } = useInternationalization()
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-[73px] z-40">
      <div className="flex overflow-x-auto scrollbar-hide px-2 py-2">
        {categories.map((category) => (
          <Link key={category.id} href={category.href}>
            <button
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full mx-1 transition-colors ${
                pathname === category.href || (category.id === "all" && pathname === "/")
                  ? "bg-teal-500 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {category.label}
            </button>
          </Link>
        ))}
      </div>
    </nav>
  )
}
