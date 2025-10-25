import { apiClient as api } from "@/lib/api"

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  membershipTier: "bronze" | "silver" | "gold" | "platinum"
  createdAt: string
  updatedAt: string
}

export interface UserStats {
  totalOrders: number
  wishlistItems: number
  totalSpent: number
  loyaltyPoints: number
}

export interface Address {
  id: number
  type: "shipping" | "billing"
  firstName: string
  lastName: string
  company?: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: number
  type: "card" | "paypal"
  cardLast4?: string
  cardBrand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: string
}

class UserService {
  async getCurrentUser(): Promise<User> {
    return api.get("/users/profile")
    // console.log("User data loaded:", response)
    // return response
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return api.put("/users/profile", data)
    // return response.data
  }

  async getUserStats(): Promise<UserStats> {
    return api.get("/users/stats")
    // return response.data
  }

  async getAddresses(): Promise<Address[]> {
    return api.get("/users/addresses")
    // return response.data
  }

  async addAddress(address: Omit<Address, "id">): Promise<Address> {
    return api.post("/users/addresses", address)
    // return response.data
  }

  async updateAddress(id: number, address: Partial<Address>): Promise<Address> {
    return api.put(`/users/addresses/${id}`, address)
    // return response.data
  }

  async deleteAddress(id: number): Promise<void> {
    await api.delete(`/users/addresses/${id}`)
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return api.get("/users/payment-methods")
    // return response.data
  }

  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, "id" | "createdAt">): Promise<PaymentMethod> {
    return api.post("/users/payment-methods", paymentMethod)
    // return response.data
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await api.delete(`/users/payment-methods/${id}`)
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put("/users/change-password", {
      currentPassword,
      newPassword,
    })
  }

  async uploadAvatar(file: File): Promise<string> {
    console.log(file, "file2")

    const formData = new FormData()
    formData.append("avatar", file)

    // Debugging: confirm file FormData me gaya ya nahi
    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }

    const response = await fetch(`https://backend.threefourthmoon.com/api/users/avatar`, {
      method: "POST",
      body: formData,
      headers: {
        // ⚠️ Content-Type nahi lagana, browser khud lagayega
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to upload avatar: ${errorText}`)
    }

    const data = await response.json()
    return data.avatarUrl
  }


  async getUsers(): Promise<any> {
    return api.get("/users")
    // return response
  }
}

export const userService = new UserService()
