"use client"

import { Package, Truck, CheckCircle, Clock, Heart, CreditCard, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import type { User, UserStats } from "@/services/userService"
import type { Order } from "@/services/orderService"
import Image from "next/image"
import Link from "next/link"

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: Clock },
}

interface ProfileOverviewProps {
  user: User
  stats: UserStats
  recentOrders: Order[]
  onRefresh: () => void
}

export function ProfileOverview({ user, stats, recentOrders, onRefresh }: ProfileOverviewProps) {
  const { formatPrice } = useInternationalization()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600">Here's what's happening with your account</p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</h3>
            <p className="text-gray-600">Total Orders</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats?.wishlistItems || 0}</h3>
            <p className="text-gray-600">Wishlist Items</p>
          </CardContent>
        </Card> */}

        <Card>
          <CardContent className="p-6 text-center">
            <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{formatPrice(stats?.totalSpent || 0)}</h3>
            <p className="text-gray-600">Total Spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats?.loyaltyPoints || 0}</h3>
            <p className="text-gray-600">Loyalty Points</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/profile?view=orders">View All Orders</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock
                const statusStyle =
                  statusConfig[order.status as keyof typeof statusConfig]?.color || "bg-gray-100 text-gray-800"
                const statusLabel = statusConfig[order.status as keyof typeof statusConfig]?.label || order.status

                return (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.order_number}</h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={statusStyle}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusLabel}
                        </Badge>
                        <p className="text-sm font-semibold mt-1">{formatPrice(order.total_amount)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 overflow-x-auto">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 flex-shrink-0">
                          <Image
                            src={item.product_image || "/placeholder.svg"}
                            alt={item.product_name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product_name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-sm text-gray-600 flex-shrink-0">+{order.items.length - 3} more</span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>View Details</Link>
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          Write Review
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders/${order.id}/track`}>Track Order</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
