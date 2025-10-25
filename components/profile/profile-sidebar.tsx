"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Package, Heart, MapPin, CreditCard, Settings, LogOut, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/providers/auth-provider"
import { userService, type User as UserType } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const menuItems = [
  { id: "overview", label: "Account Overview", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  // { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
]

const membershipColors = {
  bronze: "bg-orange-100 text-orange-800",
  silver: "bg-gray-100 text-gray-800",
  gold: "bg-yellow-100 text-yellow-800",
  platinum: "bg-purple-100 text-purple-800",
}

interface ProfileSidebarProps {
  activeItem: string
  onItemChange: (item: string) => void
}

export function ProfileSidebar({ activeItem, onItemChange }: ProfileSidebarProps) {
  const { user: authUser, logout } = useAuth()
  const [user, setUser] = useState<UserType | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (authUser) {
      loadUserProfile()
    }
  }, [authUser])

  const loadUserProfile = async () => {
    try {
      const userData = await userService.getCurrentUser()
      console.log("User data loaded:", userData)
      setUser(userData)
    } catch (error) {
      console.error("Failed to load user profile:", error)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log(file,"file");
    
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const avatarUrl = await userService.uploadAvatar(file)
      setUser((prev) => (prev ? { ...prev, avatar: avatarUrl } : null))
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* User Info */}
      <div className="text-center mb-6 pb-6 border-b">
        <div className="relative inline-block">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage src={`https://backend.threefourthmoon.com${user.avatar}` || "/placeholder.svg"} />
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <Label
            htmlFor="avatar-upload"
            className="absolute bottom-3 right-0 bg-black text-white rounded-full p-1 cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <Upload className="h-3 w-3" />
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={isUploading}
            />
          </Label>
        </div>
        <h2 className="font-semibold text-gray-900">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-600">{user.email}</p>
        {/* <div className="mt-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${membershipColors[user.membershipTier]}`}
          >
            {user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)} Member
          </span>
        </div> */}
      </div>

      {/* Menu Items */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeItem === item.id ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-6 pt-6 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
