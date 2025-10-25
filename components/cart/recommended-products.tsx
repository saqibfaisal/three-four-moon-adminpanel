"use client"

import { ProductCard } from "@/components/ui/product-card"

const recommendedProducts = [
  {
    id: "rec-1",
    name: "Matching Belt",
    price: 12.99,
    originalPrice: 24.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop",
    rating: 4.4,
    discount: 48,
  },
  {
    id: "rec-2",
    name: "Statement Earrings",
    price: 8.99,
    originalPrice: 16.99,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop",
    rating: 4.6,
    discount: 47,
  },
  {
    id: "rec-3",
    name: "Summer Sandals",
    price: 19.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop",
    rating: 4.3,
    discount: 50,
  },
  {
    id: "rec-4",
    name: "Crossbody Bag",
    price: 16.99,
    originalPrice: 32.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop",
    rating: 4.7,
    discount: 48,
  },
]

export function RecommendedProducts() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Look</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
