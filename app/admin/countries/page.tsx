"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Globe } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

interface Country {
  id: number
  code: string
  name: string
  flag: string
  is_enabled: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface CountryFormProps {
  formData: {
    code: string
    name: string
    flag: string
    is_enabled: boolean
    sort_order: number
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    code: string
    name: string
    flag: string
    is_enabled: boolean
    sort_order: number
  }>>
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  editingCountry: Country | null
}

const CountryForm: React.FC<CountryFormProps> = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  editingCountry 
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="code">Country Code</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="e.g., UAE"
          required
        />
      </div>
      <div>
        <Label htmlFor="name">Country Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., United Arab Emirates"
          required
        />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="flag">Flag Emoji</Label>
        <Input
          id="flag"
          value={formData.flag}
          onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
          placeholder="🇦🇪"
          required
        />
      </div>
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
          min="0"
        />
      </div>
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="is_enabled"
        checked={formData.is_enabled}
        onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
      />
      <Label htmlFor="is_enabled">Enabled</Label>
    </div>

    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit">
        {editingCountry ? "Update" : "Create"} Country
      </Button>
    </div>
  </form>
)

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    flag: "",
    is_enabled: true,
    sort_order: 0,
  })

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/countries/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch countries")
      }

      const result = await response.json()
      if (result.success) {
        setCountries(result.data)
      }
    } catch (error) {
      console.error("Error fetching countries:", error)
      toast({
        title: "Error",
        description: "Failed to fetch countries",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCountry 
        ? `${process.env.NEXT_PUBLIC_API_URL}/countries/${editingCountry.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/countries`
      
      const method = editingCountry ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingCountry ? "update" : "create"} country`)
      }

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: `Country ${editingCountry ? "updated" : "created"} successfully`,
        })
        
        fetchCountries()
        resetForm()
        setIsCreateOpen(false)
        setIsEditOpen(false)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingCountry ? "update" : "create"} country`,
        variant: "destructive",
      })
    }
  }

  const toggleCountryStatus = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/countries/${id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to toggle country status")
      }

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        fetchCountries()
      }
    } catch (error) {
      console.error("Error toggling country status:", error)
      toast({
        title: "Error",
        description: "Failed to toggle country status",
        variant: "destructive",
      })
    }
  }

  const deleteCountry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this country?")) {
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/countries/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete country")
      }

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: "Country deleted successfully",
        })
        fetchCountries()
      }
    } catch (error) {
      console.error("Error deleting country:", error)
      toast({
        title: "Error",
        description: "Failed to delete country",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      flag: "",
      is_enabled: true,
      sort_order: 0,
    })
    setEditingCountry(null)
  }

  const openEditDialog = (country: Country) => {
    setEditingCountry(country)
    setFormData({
      code: country.code,
      name: country.name,
      flag: country.flag,
      is_enabled: country.is_enabled,
      sort_order: country.sort_order,
    })
    setIsEditOpen(true)
  }

  const handleCancel = () => {
    resetForm()
    setIsCreateOpen(false)
    setIsEditOpen(false)
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading countries...</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Countries Management</h1>
          <p className="text-muted-foreground">
            Manage countries available for selection
          </p>
        </div>
        
        {/* <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Country</DialogTitle>
            </DialogHeader>
            <CountryForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              editingCountry={editingCountry}
            />
          </DialogContent>
        </Dialog> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Countries ({countries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow key={country.id}>
                  <TableCell className="text-2xl">{country.flag}</TableCell>
                  <TableCell className="font-medium">{country.code}</TableCell>
                  <TableCell>{country.name}</TableCell>
                  <TableCell>
                    <Badge variant={country.is_enabled ? "default" : "secondary"}>
                      {country.is_enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell>{country.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(country)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCountryStatus(country.id)}
                      >
                        <Switch checked={country.is_enabled} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCountry(country.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Country</DialogTitle>
          </DialogHeader>
          <CountryForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingCountry={editingCountry}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}