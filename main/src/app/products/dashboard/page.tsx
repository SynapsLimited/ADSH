'use client';

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Eye, Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUserContext } from "@/context/userContext";
import axios from "axios";

// Define the Product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  variations: string[];
  createdAt: string;
  slug: string;
  creator: string | { _id: string };
}

export default function ProductsDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const { currentUser } = useUserContext();
  const userId = currentUser?._id;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // Default to "all"

  useEffect(() => {
    if (!currentUser || !userId) {
      router.push("/");
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Product[]>("/api/products", {
          withCredentials: true, // Include cookies for authentication
        });
        const userProducts = response.data.filter((product) => {
          const creatorId = typeof product.creator === "object" ? product.creator._id : product.creator;
          return creatorId === userId;
        });
        setProducts(userProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to fetch products.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [currentUser, userId, router, toast]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || product.category === selectedCategory)
  );

  const handleDelete = async (product: Product) => {
    try {
      await axios.delete(`/api/products/${product.slug}`, {
        withCredentials: true, // Include cookies for authentication
      });
      setProducts(products.filter((p) => p._id !== product._id));
      setDeleteConfirmProduct(null);
      toast({
        title: "Success",
        description: "Product deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="container mx-auto p-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Products Dashboard</h1>
          <Link href="/products/create">
            <Button variant="default" className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="mr-2 h-4 w-4" /> New Product
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="relative h-48 w-full">
                <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <Badge variant="default" className="absolute top-2 right-2 bg-primary text-white">
                  {product.category}
                </Badge>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-secondary mb-2 line-clamp-1">{product.name}</h2>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.description}</p>
                {product.variations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.variations.map((variation, idx) => (
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

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No products found.</p>
        )}

        <Dialog open={!!deleteConfirmProduct} onOpenChange={() => setDeleteConfirmProduct(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl text-destructive">Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the product "{deleteConfirmProduct?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeleteConfirmProduct(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmProduct && handleDelete(deleteConfirmProduct)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}