"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserContext } from "@/context/userContext"
import axios from "axios"

export default function CreateProduct() {
  const { toast } = useToast()
  const router = useRouter()
  const { currentUser } = useUserContext()
  const token = currentUser?.token

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    variations: "",
  })
  const [images, setImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push('/')
    }
  }, [token, router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setImages(Array.from(files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("category", formData.category)
      data.append("description", formData.description)
      if (formData.variations) {
        const variationsArray = formData.variations
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v)
        data.append("variations", JSON.stringify(variationsArray))
      }
      images.forEach((image) => {
        data.append("images", image)
      })

      const response = await axios.post("/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Product created successfully.",
          variant: "default",
        })
        router.push("/products/dashboard")
      }
    } catch (error: any) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create product.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-secondary">
            Create New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Enter category (e.g., Dairy, Bakery)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variations">Variations (comma-separated)</Label>
              <Input
                id="variations"
                name="variations"
                value={formData.variations}
                onChange={handleInputChange}
                placeholder="e.g., 500g, 1kg, 2kg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Product Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Create Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}