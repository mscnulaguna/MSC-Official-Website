import { useId, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Trash2, Edit, AlertCircle, Upload,
  Search, Building2, Globe, ExternalLink, Plus,
} from "lucide-react"
import { AdminLayout } from "@/components/ui/layout"

import type { Partner, PartnerFormData } from "@/types/partners.types"
import { API_BASE, DEV_MODE } from "@/constants/partners.constants"
import { fileToBase64 } from "@/utils/fileUtils"
import { usePartners } from "@/hooks/usePartners"
import { usePartnerForm } from "@/hooks/usePartnerForm"

// ============================================================================
// COMPONENTS
// ============================================================================

const TableSkeleton = () => (
  <div className="space-y-4">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="h-14 w-full bg-muted animate-pulse rounded-md" />
    ))}
  </div>
)

// ----------------------------------------------------------------------------
// LOGO UPLOAD FIELD (shared between Add and Edit modals)
// ----------------------------------------------------------------------------

interface LogoUploadFieldProps {
  previewUrl: string | null
  dragOver: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onPhotoChange: (file: File) => void
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onRemove: () => void
}

function LogoUploadField({
  previewUrl,
  dragOver,
  fileInputRef,
  onPhotoChange,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
}: LogoUploadFieldProps) {
  const uploadId = useId()

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        previewUrl
          ? "border-border bg-background"
          : dragOver
          ? "border-var[(--color-brand-blue)] bg-blue-50 dark:bg-blue-900/10"
          : "border-border hover:border-muted-foreground hover:bg-muted/30"
      }`}
    >
      {previewUrl ? (
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mx-auto mb-4 bg-white border border-border rounded-md p-2 flex items-center justify-center shadow-sm">
            <img src={previewUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>
              Change Logo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-destructive hover:bg-destructive/10"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={uploadId}
          className="flex flex-col items-center justify-center space-y-2 py-4 cursor-pointer"
        >
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Click or drag logo to upload</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, or SVG up to 2MB.</p>
        </label>
      )}
      <input
        ref={fileInputRef}
        id={uploadId}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={(e) => e.target.files?.[0] && onPhotoChange(e.target.files[0])}
        className="hidden"
      />
    </div>
  )
}

// ----------------------------------------------------------------------------
// PARTNER FORM FIELDS (shared between Add and Edit modals)
// ----------------------------------------------------------------------------

interface PartnerFormFieldsProps {
  formData: PartnerFormData
  onChange: (field: keyof PartnerFormData, value: string) => void
}

function PartnerFormFields({ formData, onChange }: PartnerFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Organization Name <span className="text-destructive">*</span></Label>
        <Input
          placeholder="e.g. Acme Corporation"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Website URL <span className="text-destructive">*</span></Label>
        <Input
          type="url"
          placeholder="https://example.com"
          value={formData.url}
          onChange={(e) => onChange("url", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Short Bio <span className="text-destructive">*</span></Label>
        <Textarea
          placeholder="Write a brief description about this partner..."
          value={formData.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          required
          className="min-h-[100px] resize-none"
        />
      </div>
    </>
  )
}

// ----------------------------------------------------------------------------
// ADD PARTNER MODAL
// ----------------------------------------------------------------------------

interface AddPartnerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

function AddPartnerModal({ isOpen, onOpenChange, onSuccess }: AddPartnerModalProps) {
  const {
    formData, previewUrl, dragOver, fileInputRef,
    handleInputChange, handlePhotoChange,
    handleDrop, handleDragOver, handleDragLeave, removeLogo,
  } = usePartnerForm({ isOpen })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let logoBase64 = ""
      if (formData.logoFile) {
        logoBase64 = await fileToBase64(formData.logoFile)
      }

      const payload = { name: formData.name, logo: logoBase64, url: formData.url, bio: formData.bio }

      if (DEV_MODE) {
        await new Promise((res) => setTimeout(res, 800))
        onSuccess()
        onOpenChange(false)
        return
      }

      const token = localStorage.getItem("token")
      if (!token) throw new Error("Missing authentication token")

      const res = await fetch(`${API_BASE}/partners`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error?.message || "Failed to add partner")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Partner</DialogTitle>
          <DialogDescription>Fill in the organization details below to create a new partner entry.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Partner Logo <span className="text-destructive">*</span></Label>
            <LogoUploadField
              previewUrl={previewUrl}
              dragOver={dragOver}
              fileInputRef={fileInputRef}
              onPhotoChange={handlePhotoChange}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onRemove={removeLogo}
            />
          </div>

          <PartnerFormFields formData={formData} onChange={handleInputChange} />

          <DialogFooter className="sm:justify-between pt-4 border-t border-border">
            <Button variant="outlineGrey" onClick={() => onOpenChange(false)} type="button" disabled={loading} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.logoFile} className="w-full sm:w-auto">
              {loading ? "Adding..." : "Add Partner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ----------------------------------------------------------------------------
// EDIT PARTNER MODAL
// ----------------------------------------------------------------------------

interface EditPartnerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  partner: Partner | null
  onSuccess: () => void
}

function EditPartnerModal({ isOpen, onOpenChange, partner, onSuccess }: EditPartnerModalProps) {
  const {
    formData, previewUrl, dragOver, fileInputRef,
    handleInputChange, handlePhotoChange,
    handleDrop, handleDragOver, handleDragLeave, removeLogo,
  } = usePartnerForm({
    isOpen,
    initialValues: partner
      ? { name: partner.name, url: partner.url, bio: partner.bio }
      : undefined,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Seed preview URL from existing partner logo (not a blob)
  const effectivePreview = previewUrl ?? (isOpen && partner?.logo ? partner.logo : null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partner) return
    setLoading(true)
    setError(null)

    try {
      const logoPayload = formData.logoFile
        ? await fileToBase64(formData.logoFile)
        : partner.logo

      const payload = { name: formData.name, logo: logoPayload, url: formData.url, bio: formData.bio }

      if (DEV_MODE) {
        await new Promise((res) => setTimeout(res, 800))
        onSuccess()
        onOpenChange(false)
        return
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Missing authentication token");
      }

      const res = await fetch(`${API_BASE}/partners/${partner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error?.message || "Failed to update partner")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Partner Info</DialogTitle>
          <DialogDescription>Adjust the organization details for {partner?.name}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Partner Logo</Label>
            <LogoUploadField
              previewUrl={effectivePreview}
              dragOver={dragOver}
              fileInputRef={fileInputRef}
              onPhotoChange={handlePhotoChange}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onRemove={removeLogo}
            />
          </div>

          <PartnerFormFields formData={formData} onChange={handleInputChange} />

          <DialogFooter className="sm:justify-between pt-4 border-t border-border">
            <Button variant="outlineGrey" onClick={() => onOpenChange(false)} type="button" disabled={loading} className="w-full sm:w-auto">
              Discard Changes
            </Button>
            <Button type="submit" disabled={loading || (!effectivePreview && !formData.logoFile)} className="w-full sm:w-auto">
              {loading ? "Saving..." : "Confirm Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function PartnersPage() {
  const {
    filteredPartners, loading, error,
    searchTerm, setSearchTerm,
    fetchPartners, deletePartner,
  } = usePartners()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)

  return (
    <AdminLayout>
      <div className="section-container section-padding py-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Partners</h1>
            <p className="text-muted-foreground mt-1">Manage organization partners and sponsors</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Button>
        </div>

        {/* Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search partners by name or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10"
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Table Card */}
        <Card className="shadow-none border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6"><TableSkeleton /></div>
            ) : filteredPartners.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-foreground">No partners found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add a new partner.</p>
              </div>
            ) : (
              <div className="max-h-[600px] overflow-y-auto relative rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background shadow-sm border-b border-border">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-left font-semibold">PARTNER</TableHead>
                      <TableHead className="text-left font-semibold">WEBSITE</TableHead>
                      <TableHead className="text-right pr-6 font-semibold w-[100px]">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="align-middle text-left py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-border bg-background">
                              <AvatarImage src={partner.logo} alt={partner.name} className="object-contain p-1" />
                              <AvatarFallback className="text-xs bg-muted text-muted-foreground font-semibold">
                                {partner.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col max-w-[300px]">
                              <span className="font-semibold text-foreground truncate">{partner.name}</span>
                              <span className="text-xs text-muted-foreground truncate" title={partner.bio}>{partner.bio}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle text-left">
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[200px] inline-block">
                              {partner.url.replace(/^https?:\/\//, "")}
                            </span>
                            <ExternalLink className="h-3 w-3 ml-0.5 opacity-50" />
                          </a>
                        </TableCell>
                        <TableCell className="text-right align-middle pr-6">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setEditingPartner(partner); setIsEditModalOpen(true) }}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePartner(partner.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <AddPartnerModal
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSuccess={fetchPartners}
        />
        <EditPartnerModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          partner={editingPartner}
          onSuccess={fetchPartners}
        />
      </div>
    </AdminLayout>
  )
}