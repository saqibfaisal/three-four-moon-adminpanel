"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Image from "next/image"

// Full order detail based on ordersdataref.json
interface OrderDetail {
  id: number
  order_number: string
  user_id: number
  email: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: string
  tax_amount: string
  shipping_amount: string
  discount_amount: string
  total_amount: string
  currency: string
  notes: string | null
  created_at: string
  user_name: string
  item_count: number
  items: {
    id: number
    product_id: number
    quantity: number
    price: string
    total: string
    product_name: string
    product_sku: string
    product_image: string
  }[]
  addresses: any[]
}

interface OrderDetailsModalProps {
  order: OrderDetail | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const { formatPrice } = useInternationalization()

  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order #{order.order_number} - {new Date(order.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto p-4">
          {/* Left Column - Order Info */}
          <div className="md:col-span-1 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Customer</h3>
              <div className="text-sm text-gray-600">
                <p>{order.user_name}</p>
                <p>{order.email}</p>
              </div>
            </div>
            {order.addresses?.map((address) => (
              <div key={address.id}>
                <h3 className="font-semibold text-lg mb-2">
                  {address.type === "shipping" ? "Shipping Address" : "Billing Address"}
                </h3>
                <div className="text-sm text-gray-600">
                  <p>
                    {address.first_name} {address.last_name}
                  </p>
                  <p>{address.address_line_1}</p>
                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p>{address.country}</p>
                  <p>{address.phone}</p>
                </div>
              </div>
            ))}
            <div>
              <h3 className="font-semibold text-lg mb-2">Order Status</h3>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Payment</h3>
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Method:</span> {order.payment_method}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge className={getStatusColor(order.payment_status)}>{order.payment_status}</Badge>
                </p>
              </div>
            </div>
            {order.notes && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Items and Summary */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-2">Items ({order.item_count})</h3>
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">SKU: {item.product_sku}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {formatPrice(parseFloat(item.price), order.currency as any)}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(parseFloat(item.total), order.currency as any)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-2">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(parseFloat(order.subtotal), order.currency as any)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(parseFloat(order.shipping_amount), order.currency as any)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(parseFloat(order.tax_amount), order.currency as any)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>- {formatPrice(parseFloat(order.discount_amount), order.currency as any)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>{formatPrice(parseFloat(order.total_amount), order.currency as any)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}