import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  // Here you would typically save the order to your database
  console.log("Creating order with data:", body)

  const newOrder = {
    id: `mock_order_${Date.now()}`,
    order_number: `MOCK-${Date.now()}`,
    ...body,
  }

  return NextResponse.json({ order: newOrder })
}
