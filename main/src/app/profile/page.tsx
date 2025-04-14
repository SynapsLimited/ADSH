"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, Camera, Save, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserContext } from "@/context/userContext"
import axios from "axios"

export default function UserProfile() {
  const { toast } = useToast()
  const router = useRouter()
  const { currentUser } = useUserContext()

  const [isLoading, setIsLoading] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "")
  const [isAvatarTouched, setIsAvatarTouched] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  useEffect(() => {
    if (!currentUser) {
      router.push('/')
      return
    }

    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${currentUser._id}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        })
        const { name, email, avatar } = response.data
        setFormData((prev) => ({ ...prev, name, email }))
        setAvatarPreview(avatar || "")
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [currentUser, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
      setIsAvatarTouched(true)
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatar || !currentUser) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("avatar", avatar)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/change-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      setAvatarPreview(response.data.avatar)
      setIsAvatarTouched(false)
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setIsLoading(true)

    try {
      const userData = { name: formData.name, email: formData.email }
      await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/edit-user`, userData, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const userData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      }
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/edit-user`, userData, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Password updated successfully. Please log in again.",
          variant: "default",
        })
        router.push('/logout')
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-700">
      <h1 className="text-3xl font-bold text-secondary mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
            </CardHeader>
            <CardContent className="-mt-16 flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                  <img
                    src={avatarPreview || "/placeholder.svg"}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-110"
                >
                  <Camera size={18} />
                  <span className="sr-only">Upload new avatar</span>
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleAvatarChange}
                />
              </div>

              {isAvatarTouched && (
                <Button
                  onClick={handleAvatarUpload}
                  className="mt-4 bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Save Picture
                    </>
                  )}
                </Button>
              )}

              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold text-secondary">{formData.name}</h2>
                <p className="text-gray-500 text-sm">{formData.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details Section */}
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="details">Account Details</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card className="border-none shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your account details here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="transition-all duration-300 focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="transition-all duration-300 focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card className="border-none shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="text-sm font-medium">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your current password"
                          className="pr-10 transition-all duration-300 focus:border-primary focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="text-sm font-medium">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your new password"
                          className="pr-10 transition-all duration-300 focus:border-primary focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmNewPassword" className="text-sm font-medium">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmNewPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your new password"
                          className="pr-10 transition-all duration-300 focus:border-primary focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Update Password
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}