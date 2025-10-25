"use client"

import type React from "react"

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const { currentConfig } = useInternationalization()
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      })
      setEmail("")
    }
  }

  const footerSections = [
    {
      title: "Customer Service",
      links: [
        // { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        // { name: "Size Guide", href: "/size-guide" },
        { name: "Shipping Info", href: "/shipping" },
        { name: "Returns & Exchanges", href: "/returns" },
        { name: "Track Your Order", href: "/track-order" },
      ],
    },
    // {
    //   title: "About Us",
    //   links: [
    //     { name: "Our Story", href: "/about" },
    //     { name: "Careers", href: "/careers" },
    //     { name: "Press", href: "/press" },
    //     { name: "Sustainability", href: "/sustainability" },
    //     { name: "Affiliate Program", href: "/affiliate" },
    //     { name: "Wholesale", href: "/wholesale" },
    //   ],
    // },
    {
      title: "Shop",
      links: [
        { name: "Women", href: "/category/women" },
        { name: "Men", href: "/category/men" },
        { name: "Kids", href: "/category/kids" },
        { name: "Home & Living", href: "/category/home" },
        // { name: "Beauty", href: "/category/beauty" },
        // { name: "Sale", href: "/sale" },
      ],
    },
    // {
    //   title: "Legal",
    //   links: [
    //     { name: "Privacy Policy", href: "/privacy" },
    //     { name: "Terms of Service", href: "/terms" },
    //     { name: "Cookie Policy", href: "/cookies" },
    //     { name: "Accessibility", href: "/accessibility" },
    //     { name: "Intellectual Property", href: "/ip" },
    //     { name: "Student Discount", href: "/student" },
    //   ],
    // },
  ]

  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "PayPal", icon: "🅿️" },
    { name: "Apple Pay", icon: "📱" },
    { name: "Google Pay", icon: "🔵" },
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay in the Loop</h2>
            <p className="text-gray-600">Get the latest deals, trends, and exclusive offers delivered to your inbox</p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 border-gray-300 focus:border-black focus:ring-black"
                required
              />
              <Button type="submit" className="h-12 px-8 bg-black hover:bg-gray-800 text-white font-medium">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/">
              <h3 className="text-xl font-bold text-gray-900 mb-4">THREE FOURTH MOON</h3>
            </Link>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Your destination for the latest fashion trends at unbeatable prices. Quality, style, and affordability in
              every piece.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>123 Fashion Street, Style City, SC 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>1-800-FASHION (1-800-327-4466)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>support@threefourthmoon.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-900 mb-3">Follow Us</p>
              <div className="flex gap-3">
                <Link
                  href="https://facebook.com"
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Facebook className="h-4 w-4 text-gray-600" />
                </Link>
                <Link
                  href="https://twitter.com"
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Twitter className="h-4 w-4 text-gray-600" />
                </Link>
                <Link
                  href="https://instagram.com"
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Instagram className="h-4 w-4 text-gray-600" />
                </Link>
                <Link
                  href="https://youtube.com"
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Youtube className="h-4 w-4 text-gray-600" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-gray-900 mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Trust Badges */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Shopping</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Free Shipping Over $49</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <span>Easy Returns</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">We Accept:</span>
            <div className="flex items-center gap-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="w-8 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-xs"
                >
                  {method.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © 2025 Three Fourth Moon. All rights reserved. | Made with ❤️ for fashion lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
