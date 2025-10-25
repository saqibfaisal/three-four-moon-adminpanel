"use client"

import { useState } from "react"
import { Trash2, Heart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/components/providers/cart-provider"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Image from "next/image"
import Link from "next/link"

export function CartContent() {
  const { items, updateQuantity, removeItem } = useCart()
  const { formatPrice } = useInternationalization()
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some items to get started</p>
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Select All Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Checkbox checked={selectedItems.length === items.length} onCheckedChange={toggleSelectAll} />
        <span className="font-medium">Select All ({items.length} items)</span>
      </div>

      {/* Cart Items */}
      <div className="divide-y">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="p-4">
            <div className="flex gap-4">
              <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => toggleSelectItem(item.id)} />

              <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={80}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{item.name}</h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  {item.color && <span>Color: {item.color}</span>}
                  {item.size && <span>Size: {item.size}</span>}
                </div>

                <div className="flex flex-col items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-red-500">{formatPrice(item.price)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 border-x min-w-[3rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    {/* <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                      <Heart className="h-4 w-4" />
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
