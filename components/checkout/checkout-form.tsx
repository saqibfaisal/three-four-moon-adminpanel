"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Truck, MapPin, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { checkoutService, type CheckoutData } from "@/services/checkoutService"

interface FormData {
  email: string
  firstName: string
  lastName: string
  address: string
  addressLine2: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  billingAddressSame: boolean
  billingFirstName: string
  billingLastName: string
  billingAddress: string
  billingAddressLine2: string
  billingCity: string
  billingState: string
  billingZipCode: string
  billingCountry: string
  billingPhone: string
  saveAddress: boolean
  notes: string
}

export function CheckoutForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    billingAddressSame: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingAddressLine2: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "US",
    billingPhone: "",
    saveAddress: false,
    notes: "",
  })

  const { toast } = useToast()
  const { items, clearCart, totalPrice } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
      }))
    }
  }, [user])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.firstName && formData.lastName)
      case 2:
        return !!(formData.address && formData.city && formData.state && formData.zipCode && formData.phone)
      default:
        return false
    }
  }

  const handleNextStep = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (currentStep === 2) {
      // Validate shipping address
      setIsLoading(true)
      try {
        const addressData = {
          address_line_1: formData.address,
          address_line_2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.zipCode,
          country: formData.country,
        }

        const validation = await checkoutService.validateAddress(addressData)
        if (!validation.valid && validation.suggestions) {
          toast({
            title: "Address validation",
            description: "Please verify your address details",
            variant: "destructive",
          })
          return
        }
      } catch (error) {
        console.error("Address validation error:", error)
        // Continue anyway - validation is optional
      } finally {
        setIsLoading(false)
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(2)) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsProcessingOrder(true)

    try {
      // Create order
      const checkoutData: CheckoutData = {
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_line_1: formData.address,
          address_line_2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
          email: formData.email,
        },
        payment_method: paymentMethod,
        notes: formData.notes,
        items: items,
      }

      // Add billing address if different
      if (!formData.billingAddressSame) {
        checkoutData.billing_address = {
          first_name: formData.billingFirstName,
          last_name: formData.billingLastName,
          address_line_1: formData.billingAddress,
          address_line_2: formData.billingAddressLine2,
          city: formData.billingCity,
          state: formData.billingState,
          postal_code: formData.billingZipCode,
          country: formData.billingCountry,
          phone: formData.billingPhone,
          email: formData.email,
        }
      }

      const orderResult = await checkoutService.createOrder(checkoutData)
      if (paymentMethod === 'stripe') {
        const session = await checkoutService.createCheckoutSession({...checkoutData,order_id:orderResult.order.id})
        // Redirect to Stripe Checkout
        router.push(session.url)
        // await clearCart()
      } else {

        // Clear cart and redirect to success page

        toast({
          title: "Order placed successfully!",
          description: `Order #${orderResult.order.order_number} has been created.`,
        })
        await clearCart()

        router.push(`/order-confirmation/${orderResult.order.id}`)
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Order failed",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingOrder(false)
    }
  }

  const steps = [
    { id: 1, title: "Contact Information", icon: MapPin, completed: currentStep > 1 },
    { id: 2, title: "Shipping Address", icon: Truck, completed: currentStep > 2 },
    { id: 3, title: "Payment", icon: Check, completed: currentStep > 3 },
  ]

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : currentStep >= step.id
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.completed ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium text-center ${currentStep >= step.id ? "text-black" : "text-gray-600"}`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${step.completed || currentStep > step.id ? "bg-green-500" : currentStep === step.id ? "bg-black" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form  className="space-y-6">
        {/* Step 1: Contact Information */}
        {currentStep >= 1 && (
          <Card className={currentStep === 1 ? "ring-2 ring-black" : ""}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > 1 ? "bg-green-500 text-white" : "bg-black text-white"
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={currentStep !== 1}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    required
                    disabled={currentStep !== 1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    required
                    disabled={currentStep !== 1}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Shipping Address */}
        {currentStep >= 2 && (
          <Card className={currentStep === 2 ? "ring-2 ring-black" : ""}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > 2 ? "bg-green-500 text-white" : "bg-black text-white"
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
                </div>
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  required
                  disabled={currentStep !== 2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="addressLine2">Apartment, suite, etc. (optional)</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc."
                  disabled={currentStep !== 2}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                    disabled={currentStep !== 2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State / Province *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State / Province"
                    required
                    disabled={currentStep !== 2}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="ZIP code"
                    required
                    disabled={currentStep !== 2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    required
                    disabled={currentStep !== 2}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  required
                  disabled={currentStep !== 2}
                  className="mt-1"
                />
              </div>

              {user && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveAddress"
                    name="saveAddress"
                    checked={formData.saveAddress}
                    onCheckedChange={(checked) => handleSelectChange("saveAddress", !!checked)}
                    disabled={currentStep !== 2}
                  />
                  <Label htmlFor="saveAddress" className="text-sm">
                    Save this address for future orders
                  </Label>
                </div>
              )}

              {/* Billing Address */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="billingAddressSame"
                    name="billingAddressSame"
                    checked={formData.billingAddressSame}
                    onCheckedChange={(checked) => handleSelectChange("billingAddressSame", !!checked)}
                    disabled={currentStep !== 2}
                  />
                  <Label htmlFor="billingAddressSame" className="text-sm">
                    Billing address is the same as shipping address
                  </Label>
                </div>

                {!formData.billingAddressSame && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-medium">Billing Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingFirstName">First Name *</Label>
                        <Input
                          id="billingFirstName"
                          name="billingFirstName"
                          value={formData.billingFirstName}
                          onChange={handleInputChange}
                          placeholder="First name"
                          required={!formData.billingAddressSame}
                          disabled={currentStep !== 2}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingLastName">Last Name *</Label>
                        <Input
                          id="billingLastName"
                          name="billingLastName"
                          value={formData.billingLastName}
                          onChange={handleInputChange}
                          placeholder="Last name"
                          required={!formData.billingAddressSame}
                          disabled={currentStep !== 2}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billingAddress">Street Address *</Label>
                      <Input
                        id="billingAddress"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        placeholder="Enter billing address"
                        required={!formData.billingAddressSame}
                        disabled={currentStep !== 2}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingCity">City *</Label>
                        <Input
                          id="billingCity"
                          name="billingCity"
                          value={formData.billingCity}
                          onChange={handleInputChange}
                          placeholder="City"
                          required={!formData.billingAddressSame}
                          disabled={currentStep !== 2}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingZipCode">ZIP Code *</Label>
                        <Input
                          id="billingZipCode"
                          name="billingZipCode"
                          value={formData.billingZipCode}
                          onChange={handleInputChange}
                          placeholder="ZIP code"
                          required={!formData.billingAddressSame}
                          disabled={currentStep !== 2}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Order Notes (optional)</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for your order..."
                  disabled={currentStep !== 2}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment Method */}
        {currentStep >= 3 && (
          <Card className={currentStep === 3 ? "ring-2 ring-black" : ""}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > 3 ? "bg-green-500 text-white" : "bg-black text-white"
                  }`}
                >
                  {currentStep > 3 ? <Check className="w-4 h-4" /> : "3"}
                </div>
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${paymentMethod === "stripe" ? "border-black ring-2 ring-black" : "border-gray-200"}`}
                  onClick={() => setPaymentMethod("stripe")}
                >
                  <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === "stripe"} onChange={() => {}} className="form-radio h-4 w-4 text-black border-gray-300 focus:ring-black" />
                  <Label htmlFor="stripe" className="font-medium">Credit / Debit Card (Stripe)</Label>
                </div>
                {["pk", "pakistan"].includes(formData.country?.toLowerCase()) &&  (
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${paymentMethod === "cod" ? "border-black ring-2 ring-black" : "border-gray-200"}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => {}} className="form-radio h-4 w-4 text-black border-gray-300 focus:ring-black" />
                    <Label htmlFor="cod" className="font-medium">Cash on Delivery (COD)</Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="md:flex justify-between gap-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-8 w-full md:w-auto"
                  disabled={isLoading || isProcessingOrder}
                
                >
                  Previous Step
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto px-8 bg-black hover:bg-gray-800 w-full md:w-auto mt-4 md:mt-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    `Continue to ${steps[currentStep]?.title}`
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="ml-auto px-8 bg-green-600 hover:bg-green-700  w-full md:w-auto mt-4 md:mt-0"
                  disabled={isProcessingOrder}
                  onClick={handleSubmit}
                >
                  {isProcessingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
