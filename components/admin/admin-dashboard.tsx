"use client"

import { TrendingUp, Users, Package, DollarSign } from 'lucide-react'
import { useState, useEffect } from "react"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import { CategoryManagement } from "./category-management"
import { SliderManagement } from "./slider-management"
import { MediaManagement } from "./media-management"
import { ProductManagement } from "./product-management"
import { OrderManagement } from "./order-management";
import { CustomerManagement } from "./customer-management";
import { adminService, type AdminDashboard as AdminDashboardData } from "@/services/adminService"
import { Loader } from "@/components/ui/loader"
import { toast } from "sonner"

interface AdminDashboardProps {
  activeSection: string
}

export function AdminDashboard() {
  const { formatPrice } = useInternationalization()
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await adminService.getDashboard()
      setDashboardData(data)
    } catch (error) {
      toast.error("Failed to fetch dashboard data")
      console.error("Dashboard fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {formatPrice(dashboardData?.statistics.total_revenue || 0)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Orders</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData?.statistics.total_orders || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customers</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData?.statistics.total_users || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Products</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData?.statistics.total_products || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {dashboardData?.recent_orders?.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-2">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                      <p className="text-sm text-green-600">{order.status}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">No recent orders</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
              <div className="space-y-3">
                {dashboardData?.topProducts?.slice(0, 5).map((product:any) => (
                  <div key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-2">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold">{product.stock} in stock</p>
                      <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">No products available</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
