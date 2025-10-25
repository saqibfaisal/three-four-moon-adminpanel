import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { InternationalizationProvider } from "@/components/providers/internationalization-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Three Fourth Moon - Fashion Forward",
  description: "Discover the latest fashion trends with international shipping",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-container">
          <InternationalizationProvider>
            <AuthProvider>

              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </InternationalizationProvider>
        </div>
      </body>
    </html>
  )
}
