"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Image from "next/image"
import { Clock, Package, Truck, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: Clock },
}

interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  sku: string;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface OrderDetail {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: string;
}


interface OrderDetailsProps {
  order: OrderDetail
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const { formatPrice } = useInternationalization()
  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock
  const statusStyle = statusConfig[order.status as keyof typeof statusConfig]?.color || "bg-gray-100 text-gray-800"
  const statusLabel = statusConfig[order.status as keyof typeof statusConfig]?.label || order.status

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="mb-1">Order #{order.order_number}</CardTitle>
            <p className="text-sm text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <Badge className={statusStyle}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {statusLabel}
            </Badge>
            <p className="text-lg font-semibold mt-1">{formatPrice(order.total_amount)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Items in this order</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.product_id} className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Image
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div className="text-gray-600 space-y-1">
              <p>{order.shipping_address.name}</p>
              <p>{order.shipping_address.street}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}</p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
            <div className="space-y-2 text-gray-600">
               <div className="flex justify-between">
                <span>Payment Method</span>
                <span>{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-gray-900 text-lg">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
        <Separator />
         <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" asChild>
            <Link href="/profile?view=orders">Back to Orders</Link>
          </Button>
          {order.status === 'shipped' && (
            <Button asChild>
              <Link href={`/orders/${order.id}/track`}>Track Order</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
