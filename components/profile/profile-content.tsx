"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { userService, User as UserType, type UserStats, type Address, type PaymentMethod } from "@/services/userService"
import { orderService, type Order } from "@/services/orderService"
import { wishlistService, type WishlistItem } from "@/services/wishlistService"
import { useToast } from "@/hooks/use-toast"
import { ProfileOverview } from "./profile-overview"
import { ProfileOrders } from "./profile-orders"
import { ProfileWishlist } from "./profile-wishlist"
import { ProfileAddresses } from "./profile-addresses"
import { ProfilePaymentMethods } from "./profile-payment-methods"
import { ProfileSettings } from "./profile-settings"

interface ProfileContentProps {
  activeView: string
}

export function ProfileContent({ activeView }: ProfileContentProps) {
  const { user: authUser, logout } = useAuth()
  const [user, setUser] = useState<UserType | null>(null)

  const { formatPrice } = useInternationalization()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  console.log(user, "auser")
  const loadUserProfile = async () => {
    try {
      const userData = await userService.getCurrentUser()
      console.log("User data loaded1:", userData)
      setUser(userData)
    } catch (error) {
      console.error("Failed to load user profile:", error)
    }
  }
  useEffect(() => {
    if (authUser) {
      loadUserProfile()
    }
  }, [authUser])
  useEffect(() => {
    if (user) {
      loadData()
    }

  }, [user, activeView])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, ordersData] = await Promise.all([
        userService.getUserStats(),
        orderService.getOrders(),
      ])
      console.log(statsData, ordersData)
      setStats(statsData)
      setRecentOrders(ordersData.orders)

      // Load additional data based on active view
      if (activeView === "wishlist") {
        const wishlistData: any = await wishlistService.getWishlist()
        setWishlistItems(wishlistData)
      } else if (activeView === "addresses") {
        const addressesData = await userService.getAddresses()
        setAddresses(addressesData)
      } else if (activeView === "payment") {
        const paymentData = await userService.getPaymentMethods()
        setPaymentMethods(paymentData)
      }
      setLoading(false)

    } catch (error) {
      setLoading(false)

      console.error("Failed to load profile data:", error)
      toast({
        title: "Error loading data",
        description: "Failed to load profile information. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    switch (activeView) {
      case "overview":
        return <ProfileOverview user={user!} stats={stats!} recentOrders={recentOrders} onRefresh={loadData} />
      case "orders":
        return <ProfileOrders />
      case "wishlist":
        return <ProfileWishlist items={wishlistItems} onRefresh={loadData} />
      case "addresses":
        return <ProfileAddresses addresses={addresses} onRefresh={loadData} />
      case "payment":
        return <ProfilePaymentMethods methods={paymentMethods} onRefresh={loadData} />
      case "settings":
        return <ProfileSettings user={user!} onRefresh={loadData} />
      default:
        return <ProfileOverview user={user!} stats={stats!} recentOrders={recentOrders} onRefresh={loadData} />
    }
  }

  return renderContent()
}
