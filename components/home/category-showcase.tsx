"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: "women",
    name: "Women's Fashion",
    description: "Discover the latest trends",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    itemCount: "10,000+ items",
    href: "/category/women",
  },
  {
    id: "men",
    name: "Men's Style",
    description: "Elevate your wardrobe",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    itemCount: "5,000+ items",
    href: "/category/men",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Complete your look",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
    itemCount: "3,000+ items",
    href: "/category/accessories",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600">Find exactly what you're looking for</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-[4/5] overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={400}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-200 mb-2">{category.description}</p>
                  <p className="text-sm text-gray-300 mb-4">{category.itemCount}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="group-hover:bg-white group-hover:text-black transition-colors"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
