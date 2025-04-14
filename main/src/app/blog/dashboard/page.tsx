"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Eye, Trash2, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
// Explicit Shadcn/UI imports
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUserContext } from "@/context/userContext"
import axios from "axios"

export default function BlogDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const { currentUser } = useUserContext()
  const token = currentUser?.token
  const userId = currentUser?._id

  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<any | null>(null)

  useEffect(() => {
    if (!token || !userId) {
      router.push('/')
    } else {
      const fetchPosts = async () => {
        setIsLoading(true)
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setPosts(response.data)
        } catch (error) {
          console.error('Error fetching posts:', error)
          toast({
            title: "Error",
            description: "Failed to fetch posts.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
      fetchPosts()
    }
  }, [token, userId, router, toast])

  const handleDelete = async (post: any) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPosts(posts.filter((p) => p._id !== post._id))
      setDeleteConfirmPost(null)
      toast({
        title: "Success",
        description: "Post deleted successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: "Error",
        description: "Failed to delete post.",
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
        <h1 className="text-3xl font-bold text-secondary">Blog Posts Dashboard</h1>
        <Link href="/blog/posts/create">
          <Button variant="default" className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="relative h-48 w-full">
              <Image src={post.thumbnail || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              <Badge variant="default" className="absolute top-2 right-2 bg-primary text-white">
                {post.category}
              </Badge>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-secondary mb-2 line-clamp-1">{post.title}</h2>
              <p className="text-gray-600 mb-4 text-sm line-clamp-2">{post.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                <div className="flex space-x-2">
                  <Link href={`/blog/posts/${post._id}`}>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/blog/posts/${post._id}/edit`}>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-destructive"
                    onClick={() => setDeleteConfirmPost(post)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deleteConfirmPost} onOpenChange={() => setDeleteConfirmPost(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-destructive">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the post "{deleteConfirmPost?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmPost(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirmPost && handleDelete(deleteConfirmPost)}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}