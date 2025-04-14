"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Eye, Trash2, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUserContext } from "@/context/userContext"
import axios from "axios"

export default function ProductsDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const { currentUser } = useUserContext()
  const token = currentUser?.token
  const userId = currentUser?._id

  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<any | null>(null)

  useEffect(() => {
    if (!token || !userId) {
      router.push('/')
    } else {
      const fetchProducts = async () => {
        setIsLoading(true)
        try {
          const response = await axios.get('/api/products', {
            headers: { Authorization: `Bearer ${token}` },
          })
          const userProducts = response.data.filter((product: any) => {
            const creatorId = typeof product.creator === 'object' ? product.creator._id : product.creator
            return creatorId === userId
          })
          setProducts(userProducts)
        } catch (error) {
          console.error('Error fetching products:', error)
          toast({
            title: "Error",
            description: "Failed to fetch products.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
      fetchProducts()
    }
  }, [token, userId, router, toast])

  const handleDelete = async (product: any) => {
    try {
      await axios.delete(`/api/products/${product.slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(products.filter((p) => p._id !== product._id))
      setDeleteConfirmProduct(null)
      toast({
        title: "Success",
        description: "Product deleted successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">Products Dashboard</h1>
        <Link href="/products/create">
          <Button variant="default" className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="mr-2 h-4 w-4" /> New Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="relative h-48 w-full">
              <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              <Badge variant="default" className="absolute top-2 right-2 bg-primary text-white">{product.category}</Badge>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-secondary mb-2 line-clamp-1">{product.name}</h2>
              <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.description}</p>

              {product.variations.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.variations.map((variation: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-gray-100">
                      {variation}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{formatDate(product.createdAt)}</span>
                <div className="flex space-x-2">
                  <Link href={`/products/${product.slug}`}>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/products/${product.slug}/edit`}>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-destructive"
                    onClick={() => setDeleteConfirmProduct(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmProduct} onOpenChange={() => setDeleteConfirmProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-destructive">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product "{deleteConfirmProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmProduct(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmProduct && handleDelete(deleteConfirmProduct)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}