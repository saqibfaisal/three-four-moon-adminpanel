"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product, Review } from "@/services/productService"
import { productService } from "@/services/productService"

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      if (!product.id) return

      setLoading(true)
      try {
        const response = await productService.getProductReviews(Number.parseInt(product.id))
        setReviews(response.reviews)
        setReviewStats(response.statistics)
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [product.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({product.review_count || 0})</TabsTrigger>
        <TabsTrigger value="shipping">Information</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-4">Product Description</h3>

          {product.description ? (
            <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <p className="text-gray-700 mb-4">
              {product.short_description || "No description available for this product."}
            </p>
          )}

          {/* Product Specifications */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-semibold mb-3">Product Details</h4>
              <dl className="space-y-2">
                {product.brand && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Brand:</dt>
                    <dd className="font-medium">{product.brand}</dd>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Material:</dt>
                    <dd className="font-medium">{product.material}</dd>
                  </div>
                )}
                {product.color && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Color:</dt>
                    <dd className="font-medium">{product.color}</dd>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Size:</dt>
                    <dd className="font-medium">{product.size}</dd>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Weight:</dt>
                    <dd className="font-medium">{product.weight}g</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Dimensions:</dt>
                    <dd className="font-medium">{product.dimensions}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Care Instructions</h4>
              <p className="text-gray-700">
                {product.care_instructions || "Follow standard care instructions for this type of product."}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="space-y-6">
          {/* Review Statistics */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            {reviewStats && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-semibold">{reviewStats.average_rating} out of 5</span>
                <span className="text-gray-600">({reviewStats.total_reviews} reviews)</span>
              </div>
            )}
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 pb-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{review.first_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {review.first_name} {review.last_name?.charAt(0)}.
                        </span>
                        {review.is_verified_purchase && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{formatDate(review.created_at)}</span>
                      </div>
                      {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
                      {review.comment && <p className="text-gray-700 mb-2">{review.comment}</p>}
                      <button className="text-sm text-gray-600 hover:text-gray-900">
                        Helpful ({review.helpful_count || 0})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              <Button className="mt-4">Write a Review</Button>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="mt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Free Standard Shipping:</strong> On orders over $49 (5-7 business days)
              </p>
              <p>
                <strong>Express Shipping:</strong> $9.99 (2-3 business days)
              </p>
              <p>
                <strong>Next Day Delivery:</strong> $19.99 (Order by 2PM)
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Returns & Exchanges</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>30-Day Return Policy:</strong> Items can be returned within 30 days of delivery
              </p>
              <p>
                <strong>Free Returns:</strong> We provide prepaid return labels
              </p>
              <p>
                <strong>Exchange Policy:</strong> Free exchanges for different sizes or colors
              </p>
              <p>
                <strong>Condition:</strong> Items must be unworn with original tags attached
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
