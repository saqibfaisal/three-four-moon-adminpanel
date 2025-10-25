import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { orderService } from "@/services/orderService"

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing")
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
  })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const stripe = getStripe() // ✅ runtime pe banega

  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const checkoutData = JSON.parse(session.client_reference_id!)
    console.log("Creating order from webhook:", checkoutData)

    await orderService.createOrder(checkoutData)
  }

  return NextResponse.json({ received: true })
}
