"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/authService"
import { Loader, Menu } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = authService.getToken()
    if (!token) {
      router.replace("/auth/login")
    } else {
      setIsAuthenticating(false)
    }
  }, [router])

  if (isAuthenticating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="lg:ml-64">
        <header className="flex items-center justify-between p-4 border-b lg:hidden sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10">
          <h1 className="text-lg font-semibold">Admin</h1>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <Menu className="h-6 w-6" />
          </button>
        </header>
        {children}
      </main>
    </div>
  )
}
