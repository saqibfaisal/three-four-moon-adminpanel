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
  },
  {
    id: "2",
    order_number: "MOCK-67890",
    total_amount: 75.5,
    status: "pending",
    payment_status: "unpaid",
    created_at: "2024-07-21T10:30:00.000Z",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    item_count: 1,
  },
  {
    id: "3",
    order_number: "MOCK-11223",
    total_amount: 250.0,
    status: "shipped",
    payment_status: "paid",
    created_at: "2024-07-22T09:00:00.000Z",
    first_name: "Peter",
    last_name: "Jones",
    email: "peter.jones@example.com",
    item_count: 3,
  },
]

export async function GET() {
  // In a real app, you'd fetch this from your database
  return NextResponse.json({ orders: mockOrders })
}
