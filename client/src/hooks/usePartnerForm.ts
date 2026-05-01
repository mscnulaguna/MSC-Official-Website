import { useState, useEffect, useRef } from "react"
import type { PartnerFormData } from "@/types/partners.types"
import { validateImageFile } from "@/utils/fileUtils"

interface UsePartnerFormOptions {
  /** Initial values to seed the form (e.g. when editing). */
  initialValues?: Partial<PartnerFormData>
  /** Called when the modal/dialog closes so the form can reset. */
  isOpen?: boolean
}

interface UsePartnerFormReturn {
  formData: PartnerFormData
  previewUrl: string | null
  dragOver: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleInputChange: (field: keyof PartnerFormData, value: string) => void
  handlePhotoChange: (file: File) => void
  handleDrop: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  removeLogo: () => void
  reset: () => void
}

const DEFAULT_FORM: PartnerFormData = {
  name: "",
  url: "",
  bio: "",
  logoFile: undefined,
}

export function usePartnerForm({
  initialValues,
  isOpen,
}: UsePartnerFormOptions = {}): UsePartnerFormReturn {
  const [formData, setFormData] = useState<PartnerFormData>({
    ...DEFAULT_FORM,
    ...initialValues,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Seed form when initialValues change (e.g. opening edit modal with partner data)
  useEffect(() => {
    if (initialValues && isOpen) {
      setFormData({ ...DEFAULT_FORM, ...initialValues, logoFile: undefined })
    }
  }, [isOpen, initialValues]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Revoke blob URLs on unmount or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (file: File) => {
    const error = validateImageFile(file)
    if (error) {
      alert(error)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setFormData((prev) => ({ ...prev, logoFile: file }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (e.dataTransfer.files?.[0]) handlePhotoChange(e.dataTransfer.files[0])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const removeLogo = () => {
    setPreviewUrl(null)
    setFormData((prev) => ({ ...prev, logoFile: undefined }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const reset = () => {
    setFormData(DEFAULT_FORM)
    setPreviewUrl(null)
    setDragOver(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return {
    formData,
    previewUrl,
    dragOver,
    fileInputRef,
    handleInputChange,
    handlePhotoChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeLogo,
    reset,
  }
}