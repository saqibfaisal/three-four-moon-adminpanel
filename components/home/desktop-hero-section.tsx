"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useInternationalization } from "@/components/providers/internationalization-provider"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { sliderService, type Slider } from "@/services/sliderService"
import { productService, type Product } from "@/services/productService"

export function DesktopHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [heroSlides, setHeroSlides] = useState<Slider[]>([])
  const [topTrends, setTopTrends] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { formatPrice } = useInternationalization()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (heroSlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [heroSlides.length])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [slidersData, trendsData] = await Promise.all([
        sliderService.getActiveSliders(),
        productService.getTrendingProducts(6)
      ])
      console.log('Fetched hero sliders:', slidersData)
      console.log('Fetched top trends:', trendsData)
      setHeroSlides(slidersData)
      setTopTrends(trendsData.products || [])
    } catch (error) {
      console.error("Failed to fetch hero section data:", error)
      // Fallback data
      setHeroSlides([
        {
          id: 1,
          title: "BACK-TO-SCHOOL",
          subtitle: "UP TO 90% OFF",
          description: "New season essentials",
          button_text: "SHOP NOW",
          button_url: "/shop",
          image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
          
          text_position: "center",
          is_active: true,
          sort_order: 1,
          created_at: "",
          updated_at: ""
        }
      ])
      setTopTrends([])
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-200 rounded-lg p-4 h-32 animate-pulse"></div>
            <div className="bg-gray-200 rounded-lg p-4 h-20 animate-pulse"></div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
          </div>
          <div className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Discount Codes */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="flex justify-around text-center mb-4">
                <div>
                  <div className="text-2xl font-bold">10%</div>
                  <div className="text-xs">OVER $69</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">15%</div>
                  <div className="text-xs">OVER $109</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">20%</div>
                  <div className="text-xs">OVER $139</div>
                </div>
              </div>
              <div className="text-sm mb-2">
                Code: <Badge className="bg-red-500">US24J2</Badge>
              </div>
              <div className="text-xs text-gray-600 mb-3">*Capped at $40</div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Collect</Button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">S</span>
              </div>
              <span className="font-semibold">SHEIN CLUB</span>
            </div>
            <div className="text-sm text-gray-700 mb-3">Extra discount on 100k+ items! Unlock savings!</div>
          </div>
        </div>

        {/* Main Hero Slider */}
        <div className="lg:col-span-2">
          <div className="relative h-96 rounded-lg overflow-hidden">
            {heroSlides.length > 0 && (
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="w-full flex-shrink-0 relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${ 'from-purple-400 to-pink-400'} opacity-90`} />
                    <Image 
                      src={slide.image_url || "/placeholder.svg"} 
                      alt={slide.title} 
                      fill 
                      className="object-cover" 
                    />
                    <div className={`absolute inset-0 flex items-center justify-center text-white ${
                      slide.text_position === 'left' ? 'text-left justify-start pl-8' :
                      slide.text_position === 'right' ? 'text-right justify-end pr-8' : 'text-center'
                    }`}>
                      <div>
                        <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                        {slide.subtitle && (
                          <div className="text-2xl font-bold mb-2 bg-yellow-400 text-black px-4 py-1 rounded-full inline-block">
                            {slide.subtitle}
                          </div>
                        )}
                        {slide.description && (
                          <p className="text-lg mb-4">{slide.description}</p>
                        )}
                        {slide.button_text && slide.button_url && (
                          <Link href={slide.button_url}>
                            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                              {slide.button_text}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {heroSlides.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar - Top Trends */}
        <div>
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-4">Top Trends</h3>
            <div className="grid grid-cols-2 gap-3">
              {topTrends.slice(0,4).map((trend) => (
                <Link key={trend.id} href={`/product/${trend.id}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Image
                      src={trend.primary_image || "/placeholder.svg"}
                      alt={trend.name}
                      width={100}
                      height={120}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="p-2">
                      <p className="text-xs text-gray-600 mb-1">#{trend.name}</p>
                      <p className="text-sm font-bold text-red-500">{formatPrice(trend.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
