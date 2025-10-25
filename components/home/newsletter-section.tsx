"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      })
      setEmail("")
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest fashion trends, exclusive deals, and style inspiration delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-4 max-w-md">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button type="submit" className="bg-white text-purple-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </form>

            <p className="text-sm mt-4 opacity-75">Join 100,000+ fashion lovers and get 15% off your first order</p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=250&h=300&fit=crop"
                alt="Fashion Model 1"
                width={250}
                height={300}
                className="rounded-2xl shadow-2xl"
              />
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=250&h=300&fit=crop"
                alt="Fashion Model 2"
                width={250}
                height={300}
                className="rounded-2xl shadow-2xl mt-8"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
