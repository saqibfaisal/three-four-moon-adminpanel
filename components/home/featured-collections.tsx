"use client"

import { useInternationalization } from "@/components/providers/internationalization-provider"
import Image from "next/image"

const collections = [
  {
    id: 1,
    name: "Summer Essentials",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=200&fit=crop",
    itemCount: 120,
  },
  {
    id: 2,
    name: "Workwear",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop",
    itemCount: 85,
  },
  {
    id: 3,
    name: "Evening Wear",
    image: "https://images.unsplash.com/photo-1566479179817-c0b2b2b5b5b5?w=300&h=200&fit=crop",
    itemCount: 65,
  },
  {
    id: 4,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
    itemCount: 200,
  },
]

export function FeaturedCollections() {
  const { translate } = useInternationalization()

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4">{translate("featured.collections")}</h2>

      <div className="grid grid-cols-2 gap-3">
        {collections.map((collection) => (
          <div key={collection.id} className="relative rounded-lg overflow-hidden">
            <Image
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              width={300}
              height={200}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3">
              <h3 className="text-white font-semibold text-sm">{collection.name}</h3>
              <p className="text-white/80 text-xs">{collection.itemCount} items</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
