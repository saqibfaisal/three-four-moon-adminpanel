"use client"
import { Clock, Truck, Shield, RotateCcw } from "lucide-react"

export function PromotionalBanner() {
  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-sm opacity-90">On orders over $49</p>
          </div>

          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="h-8 w-8" />
            </div>
            <h3 className="font-semibold mb-2">Easy Returns</h3>
            <p className="text-sm opacity-90">30-day return policy</p>
          </div>

          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-semibold mb-2">Secure Payment</h3>
            <p className="text-sm opacity-90">100% secure checkout</p>
          </div>

          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="font-semibold mb-2">24/7 Support</h3>
            <p className="text-sm opacity-90">Customer service</p>
          </div>
        </div>
      </div>
    </div>
  )
}
