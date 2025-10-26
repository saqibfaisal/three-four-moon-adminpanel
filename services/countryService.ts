import { apiClient } from "@/lib/api"

export interface Country {
  id: number
  code: string
  name: string
  flag: string
  is_enabled: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CreateCountryData {
  code: string
  name: string
  flag: string
  is_enabled?: boolean
  sort_order?: number
}

export interface UpdateCountryData extends Partial<CreateCountryData> {}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

class CountryService {
  async getEnabledCountries(): Promise<{ countries: Country[] }> {
    try {
      const response = await apiClient.get<ApiResponse<Country[]>>("/countries")
      return {
        countries: response.data || [],
      }
    } catch (error) {
      console.error("Error fetching enabled countries:", error)
      throw error
    }
  }

  async getAllCountries(): Promise<{ countries: Country[] }> {
    try {
      const response = await apiClient.get<ApiResponse<Country[]>>("/countries/admin")
      return {
        countries: response.data || [],
      }
    } catch (error) {
      console.error("Error fetching all countries:", error)
      throw error
    }
  }

  async createCountry(data: CreateCountryData): Promise<{ country: Country }> {
    try {
      const response = await apiClient.post<ApiResponse<Country>>("/countries", data)
      return {
        country: response.data,
      }
    } catch (error) {
      console.error("Error creating country:", error)
      throw error
    }
  }

  async updateCountry(id: number, data: UpdateCountryData): Promise<{ country: Country }> {
    try {
      const response = await apiClient.put<ApiResponse<Country>>(`/countries/${id}`, data)
      return {
        country: response.data,
      }
    } catch (error) {
      console.error("Error updating country:", error)
      throw error
    }
  }

  async toggleCountryStatus(id: number): Promise<{ country: Country; message: string }> {
    try {
      const response = await apiClient.patch<ApiResponse<Country>>(`/countries/${id}/toggle`)
      return {
        country: response.data,
        message: response.message || "Status toggled successfully",
      }
    } catch (error) {
      console.error("Error toggling country status:", error)
      throw error
    }
  }

  async deleteCountry(id: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(`/countries/${id}`)
      return {
        message: response.message || "Country deleted successfully",
      }
    } catch (error) {
      console.error("Error deleting country:", error)
      throw error
    }
  }
}

export const countryService = new CountryService()
export default countryService