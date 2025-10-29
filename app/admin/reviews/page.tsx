"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Check, X, Trash2, Filter } from "lucide-react"
import { adminService, type Review } from "@/services/adminService"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | "delete" | null>(null)
  const [filters, setFilters] = useState({
    status: "all" as "pending" | "approved" | "all",
    rating: "all",
    search: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [pagination.page, filters])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const filterParams: any = {
        status: filters.status,
      }
      if (filters.rating && filters.rating !== "all") {
        filterParams.rating = Number.parseInt(filters.rating)
      }
      if (filters.search) {
        filterParams.search = filters.search
      }
      const response = await adminService.getAllReviews(pagination.page, pagination.limit, filterParams)
      setReviews(response.reviews)
      setPagination(response.pagination)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: number) => {
    try {
      await adminService.approveReview(reviewId, true)
      toast({
        title: "Success",
        description: "Review approved successfully",
      })
      fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve review",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (reviewId: number) => {
    try {
      await adminService.approveReview(reviewId, false)
      toast({
        title: "Success",
        description: "Review rejected successfully",
      })
      fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject review",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (reviewId: number) => {
    try {
      await adminService.deleteReview(reviewId)
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
      fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  const confirmAction = () => {
    if (!selectedReview || !actionType) return

    switch (actionType) {
      case "approve":
        handleApprove(selectedReview.id)
        break
      case "reject":
        handleReject(selectedReview.id)
        break
      case "delete":
        handleDelete(selectedReview.id)
        break
    }

    setSelectedReview(null)
    setActionType(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Review Management</h1>
        <p className="text-gray-600">Manage and moderate product reviews</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value: "pending" | "approved" | "all") => {
                  setFilters({ ...filters, status: value })
                  setPagination({ ...pagination, page: 1 })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Reviews" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <Select
                value={filters.rating}
                onValueChange={(value) => {
                  setFilters({ ...filters, rating: value })
                  setPagination({ ...pagination, page: 1 })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search by user, product..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value })
                  setPagination({ ...pagination, page: 1 })
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">
              {filters.status === "pending" ? "No pending reviews" : "No reviews found"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">
                            {review.first_name} {review.last_name}
                          </CardTitle>
                          {review.is_approved ? (
                            <Badge variant="default" className="bg-green-600">
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-600 text-white">
                              Pending
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {review.email} • {formatDate(review.created_at)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {!review.is_approved && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => {
                              setSelectedReview(review)
                              setActionType("approve")
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {review.is_approved && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 hover:text-orange-700"
                            onClick={() => {
                              setSelectedReview(review)
                              setActionType("reject")
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Unapprove
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedReview(review)
                            setActionType("delete")
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">Product: {review.product_name}</span>
                        {review.is_verified_purchase && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      {review.title && (
                        <h4 className="font-semibold text-gray-900">{review.title}</h4>
                      )}
                      {review.comment && (
                        <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

      {/* Pagination */}
      {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          )}

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedReview && !!actionType} onOpenChange={() => {
        setSelectedReview(null)
        setActionType(null)
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" && "Approve Review"}
              {actionType === "reject" && "Unapprove Review"}
              {actionType === "delete" && "Delete Review"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve" && "This review will be published and visible to customers."}
              {actionType === "reject" && "This review will be hidden from customers."}
              {actionType === "delete" && "This action cannot be undone. The review will be permanently deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
