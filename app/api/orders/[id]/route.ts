import { NextResponse } from "next/server"

// Mock data - replace with your actual database logic
const mockOrders = [
  {
    id: "1",
    order_number: "MOCK-12345",
    total_amount: 150.0,
    status: "delivered",
    payment_status: "paid",
    created_at: "2024-07-20T14:48:00.000Z",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    item_count: 2,
    items: [
      {
        id: "prod-001",
        product_name: "Classic T-Shirt",
        quantity: 1,
        price: 50.0,
        image_url: "/placeholder.svg",
      },
      {
        id: "prod-002",
        product_name: "Denim Jeans",
        quantity: 1,
        price: 100.0,
        image_url: "/placeholder.svg",
      },
    ],
    shipping_address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip_code: "12345",
      country: "USA",
    },
    billing_address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip_code: "12345",
      country: "USA",
    },
  },
]

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  // In a real app, you'd fetch this from your database
  const order = mockOrders.find((o) => o.id === id)

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  // If the order doesn't have items, add some mock ones.
  // This is to simulate a full order object if you're just using basic mock data.
  if (!order.items) {
    order.items = [
      {
        id: `prod-${Date.now()}`,
        product_name: "Sample Product",
        quantity: 1,
        price: order.total_amount,
        image_url: "/placeholder.svg",
      },
    ]
  }

  return NextResponse.json({ order })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()
  const { status } = body

  // In a real app, you'd update this in your database
  const orderIndex = mockOrders.findIndex((o) => o.id === id)

  if (orderIndex === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  mockOrders[orderIndex].status = status

  return NextResponse.json({ order: mockOrders[orderIndex] })
}
