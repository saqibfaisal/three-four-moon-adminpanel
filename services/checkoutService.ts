import { apiClient as api } from "@/lib/api"
import Stripe from "stripe"

export interface AddressData {
  first_name: string
  last_name: string
  address_line_1: string
  address_line_2?: string
  email?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
}

export interface CheckoutData {
  shipping_address: AddressData
  billing_address?: AddressData
  payment_method: string
  notes?: string
  items: any[]
  order_id?: string
}

export interface OrderResult {
  order: {
    id: string
    order_number: string
  }
}

export interface CheckoutSession {
  id: string
  url: string
}

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
})

export const checkoutService = {
  async validateAddress(address: Partial<AddressData>): Promise<{ valid: boolean; suggestions?: any }> {
    // Mock validation
    return await Promise.resolve({ valid: true })
  },

  async createOrder(checkoutData: CheckoutData): Promise<OrderResult> {
    try {
      return api.post("/orders/create", checkoutData) 
    } catch (error) {
      throw new Error("Failed to create order")
    }
  },

  async createCheckoutSession(checkoutData: CheckoutData): Promise<CheckoutSession> {
    try {
      // Map country names to ISO country codes for Stripe
      const countryToISOMapping: Record<string, string> = {
        'UAE': 'AE',
        'Germany': 'DE',
        'UK': 'GB',
        'USA': 'US',
        'Pakistan': 'PK'
      }

      const countryCode = countryToISOMapping[checkoutData.shipping_address.country] || 'US'

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: checkoutData.items.map(item => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.image]
            },
                        unit_amount: Math.round(item.price * 100), 
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation/${checkoutData.order_id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        customer_email: checkoutData.shipping_address.email,
        shipping_address_collection: {
          allowed_countries: [countryCode as any],
        },
      })

      return { id: session.id, url: session.url! }
    } catch (error: any) {
      throw new Error(`Failed to create Stripe checkout session: ${error.message}`)
    }
  },
}