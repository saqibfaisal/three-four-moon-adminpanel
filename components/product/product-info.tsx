"use client"

import { useState } from "react"
import { Heart, Share2, Star, Truck, RotateCcw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/providers/cart-provider"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/services/productService"
import { wishlistService } from "@/services/wishlistService"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  // Extract available colors and sizes from variants or use defaults
  const availableColors = product.variants
    ?.filter((v) => v.name === "color")
    .map((v) => ({
      name: v.value,
      value: v.value.toLowerCase(),
    })) || [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Pink", value: "#EC4899" },
    { name: "Blue", value: "#3B82F6" },
  ]

  const availableSizes = product.variants?.filter((v) => v.name === "size").map((v) => v.value) || [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ]

  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { formatPrice } = useInternationalization()
  const { toast } = useToast()

  const handleAddToCart = () => {
    console.log("Adding to cart:", product)

    if (availableSizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart.",
        variant: "destructive",
      })
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.primary_image || product.images?.[0]?.image_url || "/placeholder.svg",
      color: product.color,
      size: selectedSize,
      quantity,
    })

    toast({
      title: "Added to cart",
      description: "Product has been added to your cart.",
    })
  }
  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await wishlistService.addToWishlist(product.id)
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  }
  const discountPercentage = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const rating = product.average_rating ? Number.parseFloat(product.average_rating) : 0
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < fullStars
                      ? "fill-yellow-400 text-yellow-400"
                      : i === fullStars && hasHalfStar
                        ? "fill-yellow-400/50 text-yellow-400"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.average_rating || "0"})</span>
          </div>
          <span className="text-sm text-gray-600">{product.review_count} reviews</span>
          <span className="text-sm text-gray-600">SKU: {product.sku}</span>
        </div>

        <div className="flex items-center gap-2">
          {discountPercentage > 0 && <Badge variant="destructive">-{discountPercentage}%</Badge>}
          {product.inventory_quantity > 0 && <Badge variant="secondary">In Stock</Badge>}
          {product.is_new_arrival && <Badge variant="outline">New Arrival</Badge>}
          {product.is_featured && <Badge variant="outline">Featured</Badge>}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-red-500">{formatPrice(product.price)}</span>
        {product.compare_price && product.compare_price > product.price && (
          <span className="text-xl text-gray-500 line-through">{formatPrice(product.compare_price)}</span>
        )}
      </div>

      {/* Short Description */}
      {product.short_description && <p className="text-gray-700">{product.short_description}</p>}

      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Color: {selectedColor.name}</h3>
          <div className="flex gap-2">
            {availableColors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 ${
                  selectedColor.name === color.name ? "border-black" : "border-gray-200"
                }`}
                style={{ backgroundColor: color.value.startsWith("#") ? color.value : color.name.toLowerCase() }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Size: {selectedSize}</h3>
            <Button variant="link" className="text-sm p-0 h-auto">
              Size Guide
            </Button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-3 border rounded text-sm font-medium ${
                  selectedSize === size ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-semibold mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-gray-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-2 border-x">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.inventory_quantity, quantity + 1))}
              className="px-3 py-2 hover:bg-gray-50"
              disabled={quantity >= product.inventory_quantity}
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {product.inventory_quantity > 0 ? `Only ${product.inventory_quantity} left in stock` : "Out of stock"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          size="lg"
          className="w-full bg-black hover:bg-gray-800"
          disabled={product.inventory_quantity === 0}
        >
          {product.inventory_quantity === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <div className="grid grid-cols-1 gap-3">
          <Button onClick={handleAddToWishlist} variant="outline" size="lg">
            <Heart className="h-4 w-4 mr-2" />
            Wishlist
          </Button>
        </div>
      </div>

      <Separator />

      {/* Product Details */}
      {(product.brand || product.material || product.care_instructions) && (
        <div className="space-y-2">
          {product.brand && (
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium">Brand:</span>
              <span>{product.brand}</span>
            </div>
          )}
          {product.material && (
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium">Material:</span>
              <span>{product.material}</span>
            </div>
          )}
          {product.care_instructions && (
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium">Care:</span>
              <span>{product.care_instructions}</span>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="h-4 w-4 text-green-600" />
          <span>Free shipping on orders over $49</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RotateCcw className="h-4 w-4 text-blue-600" />
          <span>30-day easy returns</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="h-4 w-4 text-purple-600" />
          <span>Secure payment guaranteed</span>
        </div>
      </div>
    </div>
  )
}
