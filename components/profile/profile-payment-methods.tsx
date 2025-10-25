"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Plus, Edit, Trash2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { userService, type PaymentMethod } from "@/services/userService"

interface ProfilePaymentMethodsProps {
  methods: PaymentMethod[]
  onRefresh: () => void
}

export function ProfilePaymentMethods({ methods, onRefresh }: ProfilePaymentMethodsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "card" as "card" | "paypal",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: "",
    isDefault: false,
  })
  const { toast } = useToast()

  const resetForm = () => {
    setFormData({
      type: "card",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      nameOnCard: "",
      isDefault: false,
    })
    setEditingMethod(null)
  }

  const handleOpenDialog = (method?: PaymentMethod) => {
    if (method) {
      setEditingMethod(method)
      setFormData({
        type: method.type,
        cardNumber: method.lastFour ? `****-****-****-${method.lastFour}` : "",
        expiryMonth: method.expiryMonth || "",
        expiryYear: method.expiryYear || "",
        cvv: "",
        nameOnCard: method.nameOnCard || "",
        isDefault: method.isDefault,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join("-")
    } else {
      return v
    }
  }

  const getCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\D/g, "")
    if (number.startsWith("4")) return "Visa"
    if (number.startsWith("5") || number.startsWith("2")) return "Mastercard"
    if (number.startsWith("3")) return "American Express"
    if (number.startsWith("6")) return "Discover"
    return "Card"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        cardNumber: formData.cardNumber.replace(/\D/g, ""),
      }

      if (editingMethod) {
        await userService.updatePaymentMethod(editingMethod.id, payload)
        toast({
          title: "Payment method updated",
          description: "Your payment method has been updated successfully.",
        })
      } else {
        await userService.addPaymentMethod(payload)
        toast({
          title: "Payment method added",
          description: "Your new payment method has been added successfully.",
        })
      }
      handleCloseDialog()
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMethod = async (methodId: number) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return

    setLoading(true)
    try {
      await userService.deletePaymentMethod(methodId)
      toast({
        title: "Payment method deleted",
        description: "The payment method has been removed from your account.",
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (methodId: number) => {
    setLoading(true)
    try {
      await userService.setDefaultPaymentMethod(methodId)
      toast({
        title: "Default payment method updated",
        description: "This payment method is now your default.",
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default payment method.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
            <p className="text-gray-600">Manage your saved payment methods</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingMethod ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Payment Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === "card" && (
                  <>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                        placeholder="1234-5678-9012-3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Month</Label>
                        <Select
                          value={formData.expiryMonth}
                          onValueChange={(value) => handleInputChange("expiryMonth", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="expiryYear">Year</Label>
                        <Select
                          value={formData.expiryYear}
                          onValueChange={(value) => handleInputChange("expiryYear", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="YY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i
                              return (
                                <SelectItem key={year} value={String(year).slice(-2)}>
                                  {String(year).slice(-2)}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => handleInputChange("isDefault", checked)}
                  />
                  <Label htmlFor="isDefault">Set as default payment method</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingMethod ? "Update" : "Add Payment Method"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Your payment information is secure</p>
              <p className="text-xs text-blue-700">We use industry-standard encryption to protect your data.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods List */}
      {methods.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payment methods saved</h3>
            <p className="text-gray-600 mb-6">Add a payment method to make checkout faster and easier.</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methods.map((method) => (
            <Card key={method.id} className={method.isDefault ? "ring-2 ring-blue-500" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-lg">
                      {method.type === "card" ? getCardBrand(method.lastFour || "") : "PayPal"}
                    </CardTitle>
                  </div>
                  {method.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {method.type === "card" ? (
                  <div>
                    <p className="font-medium text-gray-900">•••• •••• •••• {method.lastFour}</p>
                    <p className="text-sm text-gray-600">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                    {method.nameOnCard && <p className="text-sm text-gray-600">{method.nameOnCard}</p>}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-gray-900">PayPal Account</p>
                    <p className="text-sm text-gray-600">Connected payment method</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(method)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {!method.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)} disabled={loading}>
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMethod(method.id)}
                    disabled={loading || method.isDefault}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
