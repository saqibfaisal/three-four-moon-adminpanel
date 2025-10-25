"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Trash2, Grid, List, Search, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import { useCart } from "@/components/providers/cart-provider"
import { wishlistService, type WishlistItem } from "@/services/wishlistService"
import Image from "next/image"
import Link from "next/link"

export function ProfileWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date_added")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)

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
      setSelectedItems((prev) => prev.filter((id) => id !== productId))
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

  const handleMoveToCart = async (item: WishlistItem) => {
    try {
      await wishlistService.moveToCart(item.product_id)
      setWishlistItems((prev) => prev.filter((wishItem) => wishItem.product_id !== item.product_id))
      setSelectedItems((prev) => prev.filter((id) => id !== item.product_id))

      toast({
        title: "Moved to cart",
        description: `${item.name} has been moved to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move item to cart",
        variant: "destructive",
      })
    }
  }

  const handleBulkAddToCart = async () => {
    if (selectedItems.length === 0) return

    try {
      setBulkLoading(true)
      await wishlistService.bulkAddToCart(selectedItems)

      toast({
        title: "Added to cart",
        description: `${selectedItems.length} items have been added to your cart`,
      })

      setSelectedItems([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add items to cart",
        variant: "destructive",
      })
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkRemove = async () => {
    if (selectedItems.length === 0) return

    try {
      setBulkLoading(true)
      await wishlistService.bulkRemove(selectedItems)
      setWishlistItems((prev) => prev.filter((item) => !selectedItems.includes(item.product_id)))
      setSelectedItems([])

      toast({
        title: "Items removed",
        description: `${selectedItems.length} items have been removed from your wishlist`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove items from wishlist",
        variant: "destructive",
      })
    } finally {
      setBulkLoading(false)
    }
  }

  const handleClearWishlist = async () => {
    if (!confirm("Are you sure you want to clear your entire wishlist?")) return

    try {
      await wishlistService.clearWishlist()
      setWishlistItems([])
      setSelectedItems([])
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
      })
    }
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredAndSortedItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredAndSortedItems.map((item) => item.product_id))
    }
  }

  const filteredAndSortedItems = wishlistItems
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price_low":
          return Number.parseFloat(a.price) - Number.parseFloat(b.price)
        case "price_high":
          return Number.parseFloat(b.price) - Number.parseFloat(a.price)
        case "date_added":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">{wishlistItems.length} items saved</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>

          {wishlistItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearWishlist}
              className="text-red-600 hover:text-red-700 bg-transparent"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search wishlist items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_added">Date Added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleBulkAddToCart} disabled={bulkLoading}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkRemove}
                disabled={bulkLoading}
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Select All */}
      {filteredAndSortedItems.length > 0 && (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedItems.length === filteredAndSortedItems.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-gray-600">Select all ({filteredAndSortedItems.length} items)</span>
        </div>
      )}

      {/* Wishlist Items */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredAndSortedItems.map((item) => (
          <div key={item.id} className={`bg-white rounded-lg border ${viewMode === "grid" ? "p-4" : "p-4 flex gap-4"}`}>
            <div className="flex items-start gap-3">
              {/* <Checkbox
                checked={selectedItems.includes(item.product_id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedItems((prev) => [...prev, item.product_id])
                  } else {
                    setSelectedItems((prev) => prev.filter((id) => id !== item.product_id))
                  }
                }}
              /> */}

              <div className={viewMode === "grid" ? "flex-1" : "flex-shrink-0"}>
                <div
                  className={`relative ${viewMode === "grid" ? "aspect-square mb-4" : "w-24 h-24"} bg-gray-100 rounded-lg overflow-hidden`}
                >
                  <Image src={item.primary_image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  {item.is_on_sale === 1 && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product_id}`}>
                    <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.product_id)}
                  className="text-red-600 hover:text-red-700 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900">{formatPrice(Number.parseFloat(item.price))}</span>
                {item.compare_price && Number.parseFloat(item.compare_price) > Number.parseFloat(item.price) && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(Number.parseFloat(item.compare_price))}
                  </span>
                )}
              </div>

              {item.average_rating && Number.parseFloat(item.average_rating) > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(Number.parseFloat(item.average_rating!))
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">({item.review_count})</span>
                </div>
              )}

              <p className="text-xs text-gray-500 mb-3">Added {new Date(item.created_at).toLocaleDateString()}</p>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleAddToCart(item)} className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                {/* <Button size="sm" variant="outline" onClick={() => handleMoveToCart(item)}>
                  Move to Cart
                </Button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedItems.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <X className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  )
}
