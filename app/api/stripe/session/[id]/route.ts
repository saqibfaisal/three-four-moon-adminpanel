import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
 let val =  await params
  console.log(val)
  const sessionId = val.id
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json(session)
  } catch (error: any) {
    return new Response(`Error retrieving session: ${error.message}`, { status: 500 })
  }
}
