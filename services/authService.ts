import { apiClient } from "@/lib/api"

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", credentials)
      if (response.token) {
        localStorage.setItem("token", response.token)
        apiClient.setToken(response.token)
      }
      return response
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/register", data)
      if (response.token) {
        localStorage.setItem("token", response.token)
        apiClient.setToken(response.token)
      }
      return response
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  }

  async logout(): Promise<{ message: string }> {
    try {
      await apiClient.post("/auth/logout")
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem("token")
      apiClient.setToken(null)
    }
    return { message: "Logged out successfully" }
  }

  async getCurrentUser(): Promise<{ user: User }> {
    try {
      return await apiClient.get<{ user: User }>("/auth/me")
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get user data")
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>("/auth/forgot-password", { email })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to send reset email")
    }
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>("/auth/reset-password", { token, password })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to reset password")
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
