'use client';

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Eye, Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUserContext } from "@/context/userContext";
import axios from "axios";
import { useTranslation } from 'react-i18next';

// Define the Post interface
interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  createdAt: string;
}

export default function BlogDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const { currentUser } = useUserContext();
  const userId = currentUser?._id;
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'sq' | 'en';

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categoryTranslationMap: Record<string, { sq: string; en: string }> = {
    Dairy: { sq: 'Bulmetore', en: 'Dairy' },
    'Ice Cream': { sq: 'Akullore', en: 'Ice Cream' },
    Pastry: { sq: 'Pastiçeri', en: 'Pastry' },
    Bakery: { sq: 'Furra', en: 'Bakery' },
    Packaging: { sq: 'Ambalazhe', en: 'Packaging' },
    Equipment: { sq: 'Pajisje', en: 'Equipment' },
    Other: { sq: 'Të tjera', en: 'Other' },
    'All Products': { sq: 'Të gjitha produktet', en: 'All Products' },
  };

  useEffect(() => {
    if (!currentUser || !userId) {
      router.push('/');
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Post[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/users/${userId}`, {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error",
          description: "Failed to fetch posts.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [currentUser, userId, router, toast]);

  const categories = useMemo(() => {
    return Array.from(new Set(posts.map((p) => p.category)));
  }, [posts]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || post.category === selectedCategory)
  );

  const handleDelete = async (post: Post) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post._id}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((p) => p._id !== post._id));
      setDeleteConfirmPost(null);
      toast({
        title: "Success",
        description: "Post deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return "Date unavailable";
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const defaultThumbnail = '/assets/Blog-default.webp';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="container mx-auto p-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Blog Posts Dashboard</h1>
          <Link href="/blog/posts/create">
            <Button variant="default" className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {categoryTranslationMap[category]?.[currentLanguage] || category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="relative h-48 w-full">
                <img
                  src={post.thumbnail || defaultThumbnail}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
                <Badge variant="default" className="absolute top-2 right-2 bg-primary text-white">
                  {categoryTranslationMap[post.category]?.[currentLanguage] || post.category}
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

        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No posts found.</p>
        )}

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
              <Button
                variant="destructive"
                onClick={() => deleteConfirmPost && handleDelete(deleteConfirmPost)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}