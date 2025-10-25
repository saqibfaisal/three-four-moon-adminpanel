"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import { useCart } from "@/components/providers/cart-provider"
import { wishlistService, type WishlistItem } from "@/services/wishlistService"
import Image from "next/image"
import Link from "next/link"

export function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const { toast } = useToast()
  const { formatPrice } = useInternationalization()
  const { addItem } = useCart()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await wishlistService.getWishlist()
      setWishlistItems(response.items)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wishlist items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (productId: number) => {
    try {
      await wishlistService.removeFromWishlist(productId)
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId))
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      addItem({
        id: item.product_id,
        name: item.name,
        price: Number.parseFloat(item.price),
        image: item.primary_image || "/placeholder.svg",
        quantity: 1,
      })

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const filteredItems = wishlistItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 space-y-4">
              <div className="h-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">Save items you love to your wishlist and shop them later</p>
        <Link href="/shop">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist ({wishlistItems.length} items)</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search wishlist items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
            <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <Image src={item.primary_image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              {item.is_on_sale === 1 && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(item.product_id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-700 bg-white/80 hover:bg-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Link href={`/product/${item.product_id}`}>
                <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
              </Link>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{formatPrice(Number.parseFloat(item.price))}</span>
                {item.compare_price && Number.parseFloat(item.compare_price) > Number.parseFloat(item.price) && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(Number.parseFloat(item.compare_price))}
                  </span>
                )}
              </div>

              {item.average_rating && Number.parseFloat(item.average_rating) > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(Number.parseFloat(item.average_rating!)) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">({item.review_count})</span>
                </div>
              )}

              <p className="text-xs text-gray-500">Added {new Date(item.created_at).toLocaleDateString()}</p>

              <Button onClick={() => handleAddToCart(item)} className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
