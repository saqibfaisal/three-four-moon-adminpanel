"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/authService"
import { Loader } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = authService.getToken()
    if (token) {
      router.replace("/admin")
    } else {
      router.replace("/auth/login")
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
  )
}