"use client"

import { TrendingDown, Truck } from "lucide-react"

export function PromotionalCards() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="flex-1 bg-orange-50 rounded-lg p-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <TrendingDown className="h-4 w-4 text-orange-600" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-900">Price Drop</h3>
          <p className="text-xs text-gray-600">Pricing & Tariff FAQ</p>
        </div>
      </div>

      <div className="flex-1 bg-green-50 rounded-lg p-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Truck className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-900">Free Shipping</h3>
          <p className="text-xs text-gray-600">*Conditions apply</p>
        </div>
      </div>
    </div>
  )
}
