"use client"

import React, { useState, useEffect } from "react"
import "react-quill-new/dist/quill.snow.css"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/context/userContext"
import axios from "axios"
import { useTranslation } from "react-i18next"
import "@/css/blog.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

const CreatePost = () => {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [category, setCategory] = useState("Uncategorized")
  const [description, setDescription] = useState("")
  const [descriptionEn, setDescriptionEn] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [addTranslation, setAddTranslation] = useState(false)

  const router = useRouter()
  const { currentUser } = useUserContext()
  const token = currentUser?.token

  useEffect(() => {
    if (!token) router.push("/")
  }, [token, router])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ]

  const POST_CATEGORIES = [
    "Uncategorized",
    "Dairy",
    "Ice Cream",
    "Bakery",
    "Pastry",
    "Packaging",
    "Equipment",
    "Other",
  ]

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("category", category)
      formData.append("description", description)
      if (addTranslation) {
        formData.append("title_en", titleEn)
        formData.append("description_en", descriptionEn)
      }
      if (thumbnail) formData.append("thumbnail", thumbnail)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 201) router.push("/blog/dashboard")
    } catch (err: any) {
      setError(t("createPost.error") + ": " + (err.response?.data?.message || err.message))
    }
  }

  return (
    <section data-aos="fade-up" className="create-post">
      <div className="container">
        <h2>{t("createPost.title")}</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form className="form create-post-form" onSubmit={createPost}>
          <input
            type="text"
            placeholder={t("createPost.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {POST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t(`createPost.postCategories.${cat}`)}
              </option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
            placeholder={t("createPost.descriptionPlaceholder")}
          />
          <div className="custom-file-input-container">
            <input
              className="custom-file-input"
              type="file"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              accept="image/png, image/jpg, image/jpeg"
            />
          </div>
          <div className="custom-checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={addTranslation}
                onChange={() => setAddTranslation(!addTranslation)}
              />
              {t("createPost.addTranslation")}
            </label>
          </div>
          {addTranslation && (
            <>
              <input
                type="text"
                placeholder={t("createPost.titleEnPlaceholder")}
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
              />
              <ReactQuill
                modules={modules}
                formats={formats}
                value={descriptionEn}
                onChange={setDescriptionEn}
                placeholder={t("createPost.descriptionEnPlaceholder")}
              />
            </>
          )}
          <button type="submit" className="btn btn-primary btn-submit">
            {t("createPost.createButton")}
          </button>
        </form>
      </div>
    </section>
  )
}

export default CreatePost