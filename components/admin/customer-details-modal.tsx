"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  phone: string
}

interface CustomerDetailsModalProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
}

export function CustomerDetailsModal({ customer, isOpen, onClose }: CustomerDetailsModalProps) {
  if (!customer) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Details for customer {customer.firstName} {customer.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium text-gray-500 col-span-1">ID</p>
            <p className="text-sm text-gray-900 col-span-3">{customer.id}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium text-gray-500 col-span-1">Name</p>
            <p className="text-sm text-gray-900 col-span-3">
              {customer.firstName} {customer.lastName}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium text-gray-500 col-span-1">Email</p>
            <p className="text-sm text-gray-900 col-span-3">{customer.email}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium text-gray-500 col-span-1">Phone</p>
            <p className="text-sm text-gray-900 col-span-3">{customer.phone}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium text-gray-500 col-span-1">Joined</p>
            <p className="text-sm text-gray-900 col-span-3">
              {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
