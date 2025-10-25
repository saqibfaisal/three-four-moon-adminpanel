"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, Trash2, Copy, Filter, ImageIcon, FileText, Music, Video } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface MediaFile {
  id: number
  filename: string
  original_name: string
  file_type: string
  file_size: number
  url: string
  alt_text?: string
  created_at: string
  updated_at: string
}

export function MediaManagement() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockFiles: MediaFile[] = [
        {
          id: 1,
          filename: "hero-banner-1.jpg",
          original_name: "summer-collection-hero.jpg",
          file_type: "image/jpeg",
          file_size: 245760,
          url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
          alt_text: "Summer collection hero banner",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          filename: "product-catalog.pdf",
          original_name: "2024-product-catalog.pdf",
          file_type: "application/pdf",
          file_size: 1024000,
          url: "/files/product-catalog.pdf",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 3,
          filename: "category-women.jpg",
          original_name: "womens-fashion-category.jpg",
          file_type: "image/jpeg",
          file_size: 180000,
          url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
          alt_text: "Women's fashion category",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 4,
          filename: "promo-video.mp4",
          original_name: "spring-collection-promo.mp4",
          file_type: "video/mp4",
          file_size: 5242880,
          url: "/videos/promo-video.mp4",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
      setFiles(mockFiles)
    } catch (error) {
      toast.error("Failed to fetch files")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (uploadedFiles: FileList) => {
    try {
      const newFiles: MediaFile[] = []

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        const newFile: MediaFile = {
          id: Date.now() + i,
          filename: `${Date.now()}-${file.name}`,
          original_name: file.name,
          file_type: file.type,
          file_size: file.size,
          url: URL.createObjectURL(file),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        newFiles.push(newFile)
      }

      setFiles((prev) => [...newFiles, ...prev])
      toast.success(`${newFiles.length} file(s) uploaded successfully`)
      setIsUploadDialogOpen(false)
    } catch (error) {
      toast.error("Failed to upload files")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      setFiles((prev) => prev.filter((file) => file.id !== id))
      setSelectedFiles((prev) => prev.filter((fileId) => fileId !== id))
      toast.success("File deleted successfully")
    } catch (error) {
      toast.error("Failed to delete file")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) return

    try {
      setFiles((prev) => prev.filter((file) => !selectedFiles.includes(file.id)))
      setSelectedFiles([])
      toast.success(`${selectedFiles.length} file(s) deleted successfully`)
    } catch (error) {
      toast.error("Failed to delete files")
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (fileType.startsWith("video/")) return <Video className="h-4 w-4" />
    if (fileType.startsWith("audio/")) return <Music className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const getFileTypeColor = (fileType: string) => {
    if (fileType.startsWith("image/")) return "bg-green-100 text-green-800"
    if (fileType.startsWith("video/")) return "bg-blue-100 text-blue-800"
    if (fileType.startsWith("audio/")) return "bg-purple-100 text-purple-800"
    return "bg-gray-100 text-gray-800"
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || file.file_type.startsWith(filterType)
    return matchesSearch && matchesType
  })

  const toggleFileSelection = (id: number) => {
    setSelectedFiles((prev) => (prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]))
  }

  const selectAllFiles = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map((file) => file.id))
    }
  }

  if (loading) {
    return <div className="p-6">Loading media files...</div>
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
          <p className="text-gray-600">Upload and manage your media files</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Media Files</DialogTitle>
            </DialogHeader>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drop files here</p>
              <p className="text-sm text-gray-600 mb-4">or click to browse</p>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Supported formats: Images, Videos, Audio, PDF, Documents</p>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-[200px] md:min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="application">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selectedFiles.length} selected</Badge>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* File Grid */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
              onChange={selectAllFiles}
              className="rounded"
            />
            <span className="text-sm text-gray-600">{filteredFiles.length} file(s) found</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                selectedFiles.includes(file.id) ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="rounded"
                />
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(file.url)} title="Copy URL">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* File Preview */}
              <div className="mb-3 aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                {file.file_type.startsWith("image/") ? (
                  <Image
                    src={file.url || "/placeholder.svg"}
                    alt={file.alt_text || file.original_name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">{getFileIcon(file.file_type)}</div>
                )}
              </div>

              {/* File Info */}
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-sm truncate" title={file.original_name}>
                    {file.original_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{file.filename}</p>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className={`text-xs ${getFileTypeColor(file.file_type)}`}>
                    {getFileIcon(file.file_type)}
                    <span className="ml-1">{file.file_type.split("/")[1]?.toUpperCase()}</span>
                  </Badge>
                  <span className="text-xs text-gray-500">{formatFileSize(file.file_size)}</span>
                </div>

                <p className="text-xs text-gray-400">{new Date(file.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No files found</p>
            {searchTerm && (
              <Button variant="ghost" onClick={() => setSearchTerm("")} className="mt-2">
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
