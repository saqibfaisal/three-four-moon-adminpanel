"use client"

import { ProductCard } from "@/components/ui/product-card"
import { Button } from "@/components/ui/button"
import { useInternationalization } from "@/components/providers/internationalization-provider"

const trendingProducts = [
  {
    id: "1",
    name: "Oversized Blazer",
    price: 49.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
    rating: 4.5,
    discount: 44,
  },
  {
    id: "2",
    name: "High-Waist Jeans",
    price: 34.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop",
    rating: 4.8,
    discount: 42,
  },
  {
    id: "3",
    name: "Silk Scarf",
    price: 19.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=300&h=400&fit=crop",
    rating: 4.3,
    discount: 50,
  },
  {
    id: "4",
    name: "Platform Heels",
    price: 59.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop",
    rating: 4.6,
    discount: 40,
  },
  {
    id: "5",
    name: "Vintage Tee",
    price: 24.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop",
    rating: 4.2,
    discount: 29,
  },
  {
    id: "6",
    name: "Mini Skirt",
    price: 32.99,
    originalPrice: 54.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
    rating: 4.7,
    discount: 40,
  },
  {
    id: "7",
    name: "Cropped Cardigan",
    price: 38.99,
    originalPrice: 64.99,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
    rating: 4.4,
    discount: 40,
  },
  {
    id: "8",
    name: "Wide Leg Pants",
    price: 45.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
    rating: 4.6,
    discount: 43,
  },
]

export function TrendingGrid() {
  const { translate } = useInternationalization()

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Now</h2>
          <p className="text-xl text-gray-600">Don't miss out on these popular items</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            View All Trending Items
          </Button>
        </div>
      </div>
    </section>
  )
}
