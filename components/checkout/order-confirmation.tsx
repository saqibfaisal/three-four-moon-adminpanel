"use client"

import { CheckCircle, Package, Truck, CreditCard, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Image from "next/image"
import { useEffect, useState } from "react"
import { orderService } from "@/services/orderService"
import { useRouter } from "next/navigation"

interface Order {
  id: number
  order_number: string
  status: string
  total_amount: number
  created_at: string
  items: Array<{
    id: number
    product_name: string
    product_image: string
    quantity: number
    price: number
    total: number
  }>
  addresses: Array<{
    type: string
    first_name: string
    last_name: string
    address_line_1: string
    city: string
    state: string
    postal_code: string
  }>
}

interface OrderConfirmationProps {
  order: Order
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const { formatPrice } = useInternationalization()

  const shippingAddress = order.addresses.find((addr) => addr.type === "shipping")
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Download Receipt
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Share Order
          </Button>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order #{order.order_number}
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {order.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product_image || "/placeholder.svg?height=80&width=64"}
                        alt={item.product_name}
                        width={64}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{item.product_name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-semibold">{formatPrice(item.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700">
                  <p className="font-medium">
                    {shippingAddress.first_name} {shippingAddress.last_name}
                  </p>
                  <p>{shippingAddress.address_line_1}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Order confirmed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Shipped</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Delivered</span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Estimated Delivery</p>
                <p className="text-sm text-gray-600">
                  {estimatedDelivery.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.total_amount * 0.85)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>{formatPrice(order.total_amount * 0.15)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {/* <div className="space-y-3">
            <Button className="w-full bg-transparent" variant="outline">
              Track Your Order
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Continue Shopping
            </Button>
          </div> */}
        </div>
      </div>

      {/* Help Section */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline">Contact Support</Button>
              <Button variant="outline">View FAQ</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function OrderConfirmationAsync({ params }: any) {
  const [order, setOrder] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchOrder() {
      try {
        const singleOrder: any = await orderService.getOrder(params)
        setOrder(singleOrder.order)
      } catch (error) {
        // Optionally handle error, e.g. redirect or show message
        console.error("Order fetch error:", error)
        // router.push("/404") // Uncomment if you want to redirect on error
      }
    }
    fetchOrder()
  }, [params])

  if (!order) return null

  return <OrderConfirmation order={order} />
}