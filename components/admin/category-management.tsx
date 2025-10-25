"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus, ImageIcon } from 'lucide-react'
import { toast } from "sonner"
import Image from "next/image"
import { Loader } from "@/components/ui/loader"
import { categoryService, type Category, type CreateCategoryData, type UpdateCategoryData } from "@/services/categoryService"

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CreateCategoryData>({ 
    name: "",
    description: "",
    parent_id: undefined,
    image_url: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data:any = await categoryService.getCategories()
      setCategories(data.categories || [])
      
      const parents = (data.categories || []).filter((cat:any) => !cat.parent_id)
      setParentCategories(parents)
    } catch (error) {
      toast.error("Failed to fetch categories")
      console.error("Fetch categories error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const categoryData: CreateCategoryData | UpdateCategoryData | any = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        parent_id: formData.parent_id || undefined,
        image_url: formData.image_url?.trim() || undefined,
      }

      if (editingCategory) {
        const updatedCategory = await categoryService.updateCategory(editingCategory.id, categoryData)
        setCategories((prev) => prev.map((cat) => (cat.id === editingCategory.id ? updatedCategory : cat)))
        toast.success("Category updated successfully")
      } else {
        const newCategory = await categoryService.createCategory(categoryData)
        setCategories((prev) => [...prev, newCategory])
        toast.success("Category created successfully")
      }

      setIsDialogOpen(false)
      resetForm()
      
      await fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Failed to save category")
      console.error("Save category error:", error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      parent_id: category.parent_id,
      image_url: category.image_url || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return

    try {
      await categoryService.deleteCategory(id)
      setCategories((prev) => prev.filter((cat) => cat.id !== id))
      toast.success("Category deleted successfully")
      
      await fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category")
      console.error("Delete category error:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      parent_id: undefined,
      image_url: "",
    })
    setEditingCategory(null)
  }

  const getParentCategoryName = (parentId?: number) => {
    if (!parentId) return "-"
    const parent = categories.find((cat:any) => cat.id === parentId)
    return parent?.name || "Unknown"
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md md:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name (2-100 characters)"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional category description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="parent_id">Parent Category</Label>
                <Select
                  value={formData.parent_id?.toString() || ""}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    parent_id: value === "" ? undefined : parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO">No Parent (Top Level)</SelectItem>
                    {parentCategories
                      .filter(cat => editingCategory ? cat.id !== editingCategory.id : true)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <Image
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded border object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? "Update" : "Create"} Category
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No categories found</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Category
            </Button>
          </div>
        ) : (
          <>
            {/* Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Parent Category</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category:any) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {category.image_url ? (
                          <Image
                            src={category.image_url || "/placeholder.svg"}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">ID: {category.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {category.description || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getParentCategoryName(category.parent_id)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {category.product_count || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(category)}
                            title="Edit category"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete category"
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

            {/* Cards for Mobile */}
            <div className="md:hidden">
              {categories.map((category:any) => (
                <div key={category.id} className="border-b last:border-b-0 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {category.image_url ? (
                        <Image
                          src={category.image_url || "/placeholder.svg"}
                          alt={category.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-500">ID: {category.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} title="Edit category">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-700" title="Delete category">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {category.description && (
                      <div>
                        <p className="font-semibold text-gray-600">Description</p>
                        <p className="text-gray-800 truncate">{category.description}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-600">Parent Category</p>
                      <p className="text-gray-800">{getParentCategoryName(category.parent_id)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600">Products</p>
                      <p className="text-gray-800">{category.product_count || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
