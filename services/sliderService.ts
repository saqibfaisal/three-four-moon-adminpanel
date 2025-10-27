import { apiClient } from "@/lib/api"

export interface Slider {
  id: number
  title: string
  subtitle?: string
  description?: string
  image_url: string
  button_text?: string
  button_url?: string
  text_position: "left" | "center" | "right"
  background_color?: string
  text_color?: string
  is_active: boolean
  sort_order: number
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface CreateSliderData {
  title: string
  subtitle?: string
  description?: string
  image_url: string
  button_text?: string
  button_url?: string
  text_position?: "left" | "center" | "right"
  background_color?: string
  text_color?: string
  is_active?: boolean
  sort_order?: number
  start_date?: string
  end_date?: string
}

export interface UpdateSliderData extends Partial<CreateSliderData> {}

class SliderService {
  async getSliders(): Promise<Slider[]> {
    return apiClient.get<Slider[]>("/sliders")
  }

  async getActiveSliders(): Promise<Slider[]> {
    return apiClient.get<Slider[]>("/sliders/active")
  }

  async getSliderById(id: number): Promise<Slider> {
    return apiClient.get<Slider>(`/sliders/${id}`)
  }

  async createSlider(data: CreateSliderData): Promise<Slider> {
    return apiClient.post<Slider>("/sliders", data)
  }

  async updateSlider(id: number, data: UpdateSliderData): Promise<Slider> {
    return apiClient.put<Slider>(`/sliders/${id}`, data)
  }

  async deleteSlider(id: number): Promise<void> {
    return apiClient.delete<void>(`/sliders/${id}`)
  }

  async updateSliderOrder(id: number, sortOrder: number): Promise<Slider> {
    return apiClient.put<Slider>(`/sliders/${id}/order`, { sort_order: sortOrder })
  }

  async toggleSliderStatus(id: number, isActive: boolean): Promise<Slider> {
    return apiClient.put<Slider>(`/sliders/${id}/status`, { is_active: isActive })
  }
}

export const sliderService = new SliderService()
