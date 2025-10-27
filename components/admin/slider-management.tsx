"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react'
import { toast } from "sonner"
import Image from "next/image"
import { Loader } from "@/components/ui/loader"
import { sliderService, type Slider, type CreateSliderData } from "@/services/sliderService"

export function SliderManagement() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null)
  const [formData, setFormData] = useState<CreateSliderData>({ 
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    button_text: "",
    button_url: "",
    text_position: "left",
    is_active: true,
    sort_order: 0,
    start_date: new Date().toISOString().split('T')[0], // Default to today
    end_date: new Date().toISOString().split('T')[0], // Default to today
  })

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    try {
      setLoading(true)
      const data = await sliderService.getSliders()
      setSliders(data)
    } catch (error) {
      console.error("Failed to fetch sliders:", error)
      toast.error("Failed to fetch sliders")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Ensure all data is properly typed and is_active is always a boolean
      const submitData: CreateSliderData = {
        ...formData,
        is_active: !!formData.is_active, // Convert to boolean using double negation
        sort_order: Number(formData.sort_order) || 0,
      }

      if (editingSlider) {
        const updatedSlider = await sliderService.updateSlider(editingSlider.id, submitData)
        setSliders(prev => prev.map(slider => 
          slider.id === editingSlider.id ? updatedSlider : slider
        ))
        toast.success("Slider updated successfully")
      } else {
        const newSlider = await sliderService.createSlider(submitData)
        setSliders(prev => [...prev, newSlider])
        toast.success("Slider created successfully")
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to save slider:", error)
      toast.error("Failed to save slider")
    }
  }

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider)
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle || "",
      description: slider.description || "",
      image_url: slider.image_url,
      button_text: slider.button_text || "",
      button_url: slider.button_url || "",
      text_position: slider.text_position,
      is_active: slider.is_active ? true : false, // Explicit boolean conversion
      sort_order: slider.sort_order,
      start_date: slider.start_date ? slider.start_date.split('T')[0] : "",
      end_date: slider.end_date ? slider.end_date.split('T')[0] : "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this slider?")) return

    try {
      await sliderService.deleteSlider(id)
      setSliders(prev => prev.filter(slider => slider.id !== id))
      toast.success("Slider deleted successfully")
    } catch (error) {
      console.error("Failed to delete slider:", error)
      toast.error("Failed to delete slider")
    }
  }

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const updatedSlider = await sliderService.toggleSliderStatus(id, !currentStatus)
      setSliders(prev => prev.map(slider => 
        slider.id === id ? updatedSlider : slider
      ))
      toast.success("Slider status updated")
    } catch (error) {
      console.error("Failed to update slider status:", error)
      toast.error("Failed to update slider status")
    }
  }

  const moveSlider = async (id: number, direction: "up" | "down") => {
    const sortedSliders = [...sliders].sort((a, b) => a.sort_order - b.sort_order)
    const index = sortedSliders.findIndex(s => s.id === id)
    
    if (direction === "up" && index > 0) {
      const currentSlider = sortedSliders[index]
      const previousSlider = sortedSliders[index - 1]
      
      try {
        await sliderService.updateSliderOrder(currentSlider.id, previousSlider.sort_order)
        await sliderService.updateSliderOrder(previousSlider.id, currentSlider.sort_order)
        await fetchSliders()
        toast.success("Slider order updated")
      } catch (error) {
        console.error("Failed to update slider order:", error)
        toast.error("Failed to update slider order")
      }
    } else if (direction === "down" && index < sortedSliders.length - 1) {
      const currentSlider = sortedSliders[index]
      const nextSlider = sortedSliders[index + 1]
      
      try {
        await sliderService.updateSliderOrder(currentSlider.id, nextSlider.sort_order)
        await sliderService.updateSliderOrder(nextSlider.id, currentSlider.sort_order)
        await fetchSliders()
        toast.success("Slider order updated")
      } catch (error) {
        console.error("Failed to update slider order:", error)
        toast.error("Failed to update slider order")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      button_text: "",
      button_url: "",
      text_position: "left",
      is_active: true,
      sort_order: 0,
      start_date: "",
      end_date: "",
    })
    setEditingSlider(null)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slider Management</h1>
          <p className="text-gray-600">Manage homepage sliders and banners</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSlider ? "Edit Slider" : "Add New Slider"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <Image
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Preview"
                      width={300}
                      height={150}
                      className="rounded border object-cover"
                      onError={() => toast.error("Invalid image URL")}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Shop Now"
                  />
                </div>
                <div>
                  <Label htmlFor="button_url">Button URL</Label>
                  <Input
                    id="button_url"
                    value={formData.button_url}
                    onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                    placeholder="/shop"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="text_position">Text Position</Label>
                  <Select
                    value={formData.text_position}
                    onValueChange={(value: "left" | "center" | "right") =>
                      setFormData({ ...formData, text_position: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date (Optional)</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingSlider ? "Update" : "Create"} Slider
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sliders
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((slider, index) => (
                  <TableRow key={slider.id}>
                    <TableCell>
                      <Image
                        src={slider.image_url || "/placeholder.svg"}
                        alt={slider.title}
                        width={80}
                        height={40}
                        className="rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{slider.title}</div>
                        {slider.subtitle && <div className="text-sm text-gray-500">{slider.subtitle}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{slider.text_position}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={slider.is_active ? "default" : "secondary"}>
                        {slider.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {slider.start_date || slider.end_date ? (
                        <div className="text-sm">
                          {slider.start_date && <div>From: {new Date(slider.start_date).toLocaleDateString()}</div>}
                          {slider.end_date && <div>To: {new Date(slider.end_date).toLocaleDateString()}</div>}
                        </div>
                      ) : (
                        <span className="text-gray-400">No schedule</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{slider.sort_order}</span>
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSlider(slider.id, "up")}
                            disabled={index === 0}
                            className="h-4 w-4 p-0"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSlider(slider.id, "down")}
                            disabled={index === sliders.length - 1}
                            className="h-4 w-4 p-0"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => toggleStatus(slider.id, slider.is_active)}>
                          {slider.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(slider)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(slider.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {sliders
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((slider, index) => (
              <div key={slider.id} className="p-4 border-b last:border-b-0">
                <div className="flex gap-4 mb-3">
                  <Image
                    src={slider.image_url || "/placeholder.svg"}
                    alt={slider.title}
                    width={80}
                    height={40}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{slider.title}</p>
                    <p className="text-sm text-gray-500">{slider.subtitle}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant={slider.is_active ? "default" : "secondary"}>
                    {slider.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{slider.text_position}</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {slider.start_date || slider.end_date ? (
                    <>
                      {slider.start_date && <p>From: {new Date(slider.start_date).toLocaleDateString()}</p>}
                      {slider.end_date && <p>To: {new Date(slider.end_date).toLocaleDateString()}</p>}
                    </>
                  ) : (
                    <p>No schedule</p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span>Order: {slider.sort_order}</span>
                    <div className="flex flex-col">
                      <Button variant="ghost" size="icon" onClick={() => moveSlider(slider.id, "up")} disabled={index === 0} className="h-5 w-5">
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveSlider(slider.id, "down")} disabled={index === sliders.length - 1} className="h-5 w-5">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(slider.id, slider.is_active)}>
                      {slider.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(slider)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(slider.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
