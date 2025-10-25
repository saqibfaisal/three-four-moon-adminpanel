"use client"

import { useState } from "react"
import { Tag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/providers/cart-provider"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Link from "next/link"

export function CartSummary() {
  const { items, totalPrice } = useCart()
  const { formatPrice } = useInternationalization()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const shipping = totalPrice > 49 ? 0 : 5.99
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice - discount + shipping + tax

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(totalPrice * 0.1)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={applyPromoCode}>
            Apply
          </Button>
        </div>
        {discount > 0 && (
          <p className="text-sm text-green-600 mt-2">Promo code applied! You saved {formatPrice(discount)}</p>
        )}
      </div>

      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} items)</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-green-50 p-3 rounded-lg mb-6">
        <p className="text-sm text-green-700">
          {shipping === 0
            ? "🎉 You qualify for FREE shipping!"
            : `Add ${formatPrice(49 - totalPrice)} more for FREE shipping`}
        </p>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button size="lg" className="w-full bg-black hover:bg-gray-800">
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>

      {/* Security Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-600">🔒 Secure checkout with SSL encryption</p>
      </div>
    </div>
  )
}
