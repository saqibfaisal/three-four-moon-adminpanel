"use client"

import { ProductCard } from "@/components/ui/product-card"

const products = [
  {
    id: "8",
    name: "Vintage Band Tee",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=300&fit=crop",
    rating: 4.2,
  },
  {
    id: "9",
    name: "Pleated Mini Skirt",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=300&fit=crop",
    rating: 4.7,
  },
  {
    id: "10",
    name: "Cropped Cardigan",
    price: 38.99,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=300&fit=crop",
    rating: 4.4,
  },
  {
    id: "11",
    name: "Wide Leg Pants",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=300&fit=crop",
    rating: 4.6,
  },
  {
    id: "12",
    name: "Statement Earrings",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=300&fit=crop",
    rating: 4.3,
  },
  {
    id: "13",
    name: "Leather Ankle Boots",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=200&h=300&fit=crop",
    rating: 4.8,
  },
]

export function ProductGrid() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground mb-3">Showing 6 of 1,234 products</p>
        <button className="text-primary font-medium">Load More</button>
      </div>
    </div>
  )
}
