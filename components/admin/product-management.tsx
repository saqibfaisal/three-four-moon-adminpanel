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
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Package } from 'lucide-react'
import { toast } from "sonner"
import Image from "next/image"
import { productService, type Product } from "@/services/productService"
import { Loader } from "@/components/ui/loader"
import { categoryService, type Category } from "@/services/categoryService"

interface ProductFormData {
  name: string
  slug: string
  description: string
  short_description: string
  sku: string
  price: number
  compare_price: number
  cost_price: number
  inventory_quantity: number
  weight: number
  dimensions: string
  material: string
  care_instructions: string
  brand: string
  color: string
  size: string
  gender: "men" | "women" | "unisex" | "kids"
  country: string
  is_active: boolean
  is_featured: boolean
  is_trending: boolean
  is_new_arrival: boolean
  is_on_sale: boolean
  primary_image: string
  category_ids: number[]
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    sku: "",
    price: 0,
    compare_price: 0,
    cost_price: 0,
    inventory_quantity: 0,
    weight: 0,
    dimensions: "",
    material: "",
    care_instructions: "",
    brand: "",
    color: "",
    size: "",
    gender: "unisex",
    country: "",
    is_active: true,
    is_featured: false,
    is_trending: false,
    is_new_arrival: false,
    is_on_sale: false,
    primary_image: "",
    category_ids: [],
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data: any = await productService.getProducts()
      setProducts(Array.isArray(data.products) ? data.products : [])
    } catch (error) {
      toast.error("Failed to fetch products")
      console.error("Fetch products error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const productData: any = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name)
      }

      if (editingProduct) {
        const updatedProduct = await productService.updateProduct(editingProduct.id, productData)
        setProducts((prev) => prev.map((product) => (product.id === editingProduct.id ? updatedProduct : product)))
        toast.success("Product updated successfully")
      } else {
        const newProduct = await productService.createProduct(productData)
        setProducts((prev) => [...prev, newProduct])
        toast.success("Product created successfully")
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to save product")
      console.error("Save product error:", error)
    } finally {
      setSubmitting(false) // ✅ loader band
      fetchProducts()
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      short_description: product.short_description || "",
      sku: product.sku || "",
      price: product.price || 0,
      compare_price: product.compare_price || 0,
      cost_price: product.cost_price || 0,
      inventory_quantity: product.inventory_quantity || 0,
      weight: product.weight || 0,
      dimensions: product.dimensions || "",
      material: product.material || "",
      care_instructions: product.care_instructions || "",
      brand: product.brand || "",
      color: product.color || "",
      size: product.size || "",
      gender: product.gender || "unisex",
      country: product?.country || "Pakistan",
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      is_trending: product.is_trending ?? false,
      is_new_arrival: product.is_new_arrival ?? false,
      is_on_sale: product.is_on_sale ?? false,
      primary_image: product.primary_image || "",
      category_ids: [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await productService.deleteProduct(id)
      setProducts((prev) => prev.filter((product) => product.id !== id))
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
      console.error("Delete product error:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      sku: "",
      price: 0,
      compare_price: 0,
      cost_price: 0,
      inventory_quantity: 0,
      weight: 0,
      dimensions: "",
      material: "",
      care_instructions: "",
      brand: "",
      color: "",
      size: "",
      gender: "unisex",
      country: "Pakistan",
      is_active: true,
      is_featured: false,
      is_trending: false,
      is_new_arrival: false,
      is_on_sale: false,
      primary_image: "",
      category_ids: [],
    })
    setEditingProduct(null)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 p-1">
              {/* Basic Information */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="compare_price">Compare Price</Label>
                    <Input
                      id="compare_price"
                      type="number"
                      step="0.01"
                      value={formData.compare_price}
                      onChange={(e) =>
                        setFormData({ ...formData, compare_price: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_price">Cost Price</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) => setFormData({ ...formData, cost_price: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              {/* Inventory & Shipping */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Inventory & Shipping</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inventory_quantity">Inventory Quantity *</Label>
                    <Input
                      id="inventory_quantity"
                      type="number"
                      value={formData.inventory_quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, inventory_quantity: Number.parseInt(e.target.value) || 0 })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: "men" | "women" | "unisex" | "kids") =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                      <SelectItem value="kids">Kids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="e.g., S, M, L, XL"
                  />
                </div>

                <div>
                  <Label htmlFor="care_instructions">Care Instructions</Label>
                  <Textarea
                    id="care_instructions"
                    value={formData.care_instructions}
                    onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              {/* Image */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Product Image</h3>
                <div>
                  <Label htmlFor="primary_image">Primary Image URL</Label>
                  <Input
                    id="primary_image"
                    type="url"
                    value={formData.primary_image}
                    onChange={(e) => setFormData({ ...formData, primary_image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.primary_image && (
                    <div className="mt-2">
                      <Image
                        src={formData.primary_image || "/placeholder.svg"}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="rounded border object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Flags */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Product Flags</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_trending"
                      checked={formData.is_trending}
                      onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                    />
                    <Label htmlFor="is_trending">Trending</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_new_arrival"
                      checked={formData.is_new_arrival}
                      onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                    />
                    <Label htmlFor="is_new_arrival">New Arrival</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_on_sale"
                      checked={formData.is_on_sale}
                      onChange={(e) => setFormData({ ...formData, is_on_sale: e.target.checked })}
                    />
                    <Label htmlFor="is_on_sale">On Sale</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAE">UAE</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="Pakistan">Pakistan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={submitting}>
                   {submitting ? <Loader className="mr-2 h-4 w-4" /> : null}
                  {editingProduct ? "Update" : "Create"} Product
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
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.primary_image ? (
                        <Image
                          src={product.primary_image || "/placeholder.svg"}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500 max-w-[200px] truncate">{product.short_description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{product.sku}</code>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${product.price}</div>
                      {product.compare_price && product.compare_price > product.price && (
                        <div className="text-sm text-gray-500 line-through">${product.compare_price}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        (product.inventory_quantity || 0) > 10
                          ? "default"
                          : (product.inventory_quantity || 0) > 0
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {product.inventory_quantity || 0} in stock
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
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
          {products.map((product: any) => (
            <div key={product.id} className="p-4 border-b last:border-b-0">
              <div className="flex gap-4">
                {product.primary_image ? (
                  <Image
                    src={product.primary_image || "/placeholder.svg"}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] bg-gray-200 rounded flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sku}</p>
                    </div>
                    <p className="font-semibold text-gray-900">${product.price}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={
                        (product.inventory_quantity || 0) > 10
                          ? "default"
                          : (product.inventory_quantity || 0) > 0
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {product.inventory_quantity || 0} in stock
                    </Badge>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-1 mt-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
