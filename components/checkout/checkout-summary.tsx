"use client"

import { useState } from "react"
import { Shield, Truck, RotateCcw, Tag, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/providers/cart-provider"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface PromoCode {
  code: string
  discount: number
  type: "percentage" | "fixed"
}

export function CheckoutSummary() {
  const { items, totalPrice, isLoading } = useCart()
  const { formatPrice } = useInternationalization()
  const { toast } = useToast()

  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const shipping = totalPrice > 49 ? 0 : 5.99
  const taxRate = 0.08
  const tax = totalPrice * taxRate

  // Calculate promo discount
  const promoDiscount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? totalPrice * (appliedPromo.discount / 100)
      : appliedPromo.discount
    : 0

  const discountedSubtotal = totalPrice - promoDiscount
  const finalTotal = Math.max(0, discountedSubtotal + shipping + tax)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    setIsApplyingPromo(true)

    try {
      // Simulate API call to validate promo code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock promo codes for demo
      const mockPromoCodes: Record<string, PromoCode> = {
        SAVE10: { code: "SAVE10", discount: 10, type: "percentage" },
        WELCOME5: { code: "WELCOME5", discount: 5, type: "fixed" },
        FREESHIP: { code: "FREESHIP", discount: shipping, type: "fixed" },
      }

      const promo = mockPromoCodes[promoCode.toUpperCase()]

      if (promo) {
        setAppliedPromo(promo)
        toast({
          title: "Promo code applied!",
          description: `You saved ${promo.type === "percentage" ? `${promo.discount}%` : formatPrice(promo.discount)}`,
        })
      } else {
        toast({
          title: "Invalid promo code",
          description: "Please check your promo code and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error applying promo code",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode("")
    toast({
      title: "Promo code removed",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Order Summary
            <Badge variant="secondary">{items.length} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Items */}
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg?height=80&width=64"}
                    alt={item.name}
                    width={64}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 text-gray-900">{item.name}</h3>
                  <div className="text-xs text-gray-600 mt-1 space-x-2">
                    {item.color && <span>Color: {item.color}</span>}
                    {item.size && <span>Size: {item.size}</span>}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                    <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Promo Code */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={isApplyingPromo || !!appliedPromo}
                className="flex-1"
              />
              {appliedPromo ? (
                <Button variant="outline" onClick={handleRemovePromo} className="px-4 bg-transparent">
                  Remove
                </Button>
              ) : (
                <Button
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo || !promoCode.trim()}
                  className="px-4 bg-black hover:bg-gray-800"
                >
                  {isApplyingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                </Button>
              )}
            </div>

            {appliedPromo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-green-700">
                  <span className="text-sm font-medium">Promo code "{appliedPromo.code}" applied</span>
                  <span className="text-sm font-medium">
                    -
                    {appliedPromo.type === "percentage"
                      ? `${appliedPromo.discount}%`
                      : formatPrice(appliedPromo.discount)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(promoDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Free Shipping Banner */}
          {shipping === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700">
                <Truck className="h-4 w-4" />
                <span className="text-sm font-medium">🎉 You qualify for FREE shipping!</span>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700">
                <Tag className="h-4 w-4" />
                <span className="text-sm">Add {formatPrice(49 - totalPrice)} more for FREE shipping</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security & Trust Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why Shop With Us?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Secure SSL Encryption</div>
              <div className="text-gray-600">Your payment information is protected</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Fast & Free Shipping</div>
              <div className="text-gray-600">Free shipping on orders over $49</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Easy Returns</div>
              <div className="text-gray-600">30-day hassle-free return policy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
