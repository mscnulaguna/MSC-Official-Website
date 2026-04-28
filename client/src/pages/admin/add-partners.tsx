import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Edit, AlertCircle, Upload, Search, Building2, Globe, ExternalLink, Plus } from 'lucide-react'
import { AdminLayout } from '@/components/ui/layout'

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.msc-nulaguna.org/v1'
const DEV_MODE = true // Set to true to skip API calls and simulate responses

const TIER_OPTIONS = [
  { label: 'All Tiers', value: 'all' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Silver', value: 'silver' },
  { label: 'Gold', value: 'gold' },
  { label: 'Platinum', value: 'platinum' },
]

const TIER_FORM_OPTIONS = TIER_OPTIONS.filter(opt => opt.value !== 'all')

interface Partner {
  id: string
  name: string
  logo: string
  url: string
  bio: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface PartnerFormData {
  name: string
  url: string
  bio: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  logoFile?: File
}

// ============================================================================
// FALLBACK DATA
// ============================================================================

const FALLBACK_PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    logo: '',
    url: 'https://acme.com',
    bio: 'A global leader in technology solutions.',
    tier: 'gold',
  },
  {
    id: '2',
    name: 'TechFlow Solutions',
    logo: '',
    url: 'https://techflow.io',
    bio: 'Innovating cloud architecture for modern teams.',
    tier: 'platinum',
  },
]

// ============================================================================
// UTILITIES
// ============================================================================

const getTierBadgeClass = (tier: string): string => {
  switch (tier.toLowerCase()) {
    case 'bronze': return 'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-950/20'
    case 'silver': return 'border-slate-400 text-slate-700 bg-slate-50 dark:bg-slate-900/20'
    case 'gold': return 'border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
    case 'platinum': return 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900/20'
    default: return 'border-border text-foreground'
  }
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

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
// ADD PARTNER MODAL
// ----------------------------------------------------------------------------

interface AddPartnerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

function AddPartnerModal({ isOpen, onOpenChange, onSuccess }: AddPartnerModalProps) {
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '', url: '', bio: '', tier: 'bronze', logoFile: undefined
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({ name: '', url: '', bio: '', tier: 'bronze', logoFile: undefined })
      setPreviewUrl(null)
      setError(null)
    }
  }, [isOpen])

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Please select a valid image file (JPG, PNG, SVG)')
    if (file.size > 2 * 1024 * 1024) return alert('File size must be less than 2MB')
    
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setFormData(prev => ({ ...prev, logoFile: file }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
    if (e.dataTransfer.files?.[0]) handlePhotoChange(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let logoBase64 = ''
      if (formData.logoFile) {
        logoBase64 = await fileToBase64(formData.logoFile)
      }

      const payload = {
        name: formData.name,
        logo: logoBase64,
        url: formData.url,
        bio: formData.bio,
        tier: formData.tier
      }

      if (DEV_MODE) {
        await new Promise(res => setTimeout(res, 800))
        onSuccess()
        onOpenChange(false)
        return
      }

      const res = await fetch(`${API_BASE}/partners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error?.message || 'Failed to add partner')
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
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
          {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="space-y-2">
            <Label>Partner Logo <span className="text-destructive">*</span></Label>
            <div
              onClick={() => !previewUrl && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                previewUrl ? 'border-border bg-background' : dragOver ? 'border-[var(--color-brand-blue)] bg-blue-50 dark:bg-blue-900/10 cursor-pointer' : 'border-border hover:border-muted-foreground hover:bg-muted/30 cursor-pointer'
              }`}
            >
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 bg-white border border-border rounded-md p-2 flex items-center justify-center shadow-sm">
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>Change Logo</Button>
                    <Button variant="ghost" size="sm" type="button" className="text-destructive hover:bg-destructive/10" onClick={(e) => {
                      e.stopPropagation()
                      setPreviewUrl(null)
                      setFormData(prev => ({ ...prev, logoFile: undefined }))
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}>Remove</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Click or drag logo to upload</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or SVG up to 2MB.</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={(e) => e.target.files?.[0] && handlePhotoChange(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Organization Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Acme Corporation" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Sponsorship Tier <span className="text-destructive">*</span></Label>
              <Select value={formData.tier} onValueChange={(val) => handleInputChange('tier', val as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIER_FORM_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Website URL <span className="text-destructive">*</span></Label>
            <Input type="url" placeholder="https://example.com" value={formData.url} onChange={(e) => handleInputChange('url', e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Short Bio <span className="text-destructive">*</span></Label>
            <Textarea 
              placeholder="Write a brief description about this partner..." 
              value={formData.bio} 
              onChange={(e) => handleInputChange('bio', e.target.value)} 
              required
              className="min-h-[100px] resize-none"
            />
          </div>

          <DialogFooter className="sm:justify-between pt-4 border-t border-border">
            <Button variant="outlineGrey" onClick={() => onOpenChange(false)} type="button" disabled={loading} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" disabled={loading || !formData.logoFile} className="w-full sm:w-auto">{loading ? 'Adding...' : 'Add Partner'}</Button>
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
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '', url: '', bio: '', tier: 'bronze', logoFile: undefined
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (partner && isOpen) {
      setFormData({
        name: partner.name,
        url: partner.url,
        bio: partner.bio,
        tier: partner.tier,
        logoFile: undefined
      })
      setPreviewUrl(partner.logo || null)
      setError(null)
    }
  }, [partner, isOpen])

  useEffect(() => {
    return () => { 
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl) 
    }
  }, [previewUrl])

  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Please select a valid image file')
    if (file.size > 2 * 1024 * 1024) return alert('File size must be less than 2MB')
    
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setFormData(prev => ({ ...prev, logoFile: file }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
    if (e.dataTransfer.files?.[0]) handlePhotoChange(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partner) return
    setLoading(true)
    setError(null)

    try {
      let logoPayload = partner.logo // Default to existing logo URL
      if (formData.logoFile) {
        logoPayload = await fileToBase64(formData.logoFile)
      }

      const payload = {
        name: formData.name,
        logo: logoPayload,
        url: formData.url,
        bio: formData.bio,
        tier: formData.tier
      }

      if (DEV_MODE) {
        await new Promise(res => setTimeout(res, 800))
        onSuccess()
        onOpenChange(false)
        return
      }

      const res = await fetch(`${API_BASE}/partners/${partner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error?.message || 'Failed to update partner')
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
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
          {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="space-y-2">
            <Label>Partner Logo</Label>
            <div
              onClick={() => !previewUrl && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                previewUrl ? 'border-border bg-background' : dragOver ? 'border-[var(--color-brand-blue)] bg-blue-50 dark:bg-blue-900/10 cursor-pointer' : 'border-border hover:border-muted-foreground hover:bg-muted/30 cursor-pointer'
              }`}
            >
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 bg-white border border-border rounded-md p-2 flex items-center justify-center shadow-sm">
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>Change Logo</Button>
                    <Button variant="ghost" size="sm" type="button" className="text-destructive hover:bg-destructive/10" onClick={(e) => {
                      e.stopPropagation()
                      setPreviewUrl(null)
                      setFormData(prev => ({ ...prev, logoFile: undefined }))
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}>Remove</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Click or drag logo to upload</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or SVG up to 2MB.</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={(e) => e.target.files?.[0] && handlePhotoChange(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Organization Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Acme Corporation" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Sponsorship Tier <span className="text-destructive">*</span></Label>
              <Select value={formData.tier} onValueChange={(val) => handleInputChange('tier', val as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIER_FORM_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Website URL <span className="text-destructive">*</span></Label>
            <Input type="url" placeholder="https://example.com" value={formData.url} onChange={(e) => handleInputChange('url', e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Short Bio <span className="text-destructive">*</span></Label>
            <Textarea 
              placeholder="Write a brief description about this partner..." 
              value={formData.bio} 
              onChange={(e) => handleInputChange('bio', e.target.value)} 
              required
              className="min-h-[100px] resize-none"
            />
          </div>

          <DialogFooter className="sm:justify-between pt-4 border-t border-border">
            <Button variant="outlineGrey" onClick={() => onOpenChange(false)} type="button" disabled={loading} className="w-full sm:w-auto">Discard Changes</Button>
            <Button type="submit" disabled={loading || (!previewUrl && !formData.logoFile)} className="w-full sm:w-auto">{loading ? 'Saving...' : 'Confirm Changes'}</Button>
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
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('all')

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)

  // --------------------------------------------------------------------------
  // API Calls
  // --------------------------------------------------------------------------

  const fetchPartners = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (DEV_MODE) {
        await new Promise(res => setTimeout(res, 800))
        setPartners(FALLBACK_PARTNERS)
        setLoading(false)
        return
      }

      const res = await fetch(`${API_BASE}/partners`)
      if (!res.ok) throw new Error('Failed to fetch partners')

      const contentType = res.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid API response')
      }

      const json = await res.json()
      setPartners(json.data || [])
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError('Failed to load partners. Showing fallback data.')
      setPartners(FALLBACK_PARTNERS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this partner?')) return

    try {
      if (DEV_MODE) {
        setPartners(prev => prev.filter(p => p.id !== id))
        return
      }

      const res = await fetch(`${API_BASE}/partners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (!res.ok) throw new Error('Failed to delete partner')
      
      // Refresh list
      fetchPartners()
    } catch (err) {
      console.error(err)
      alert("Failed to delete partner. Please try again.")
    }
  }

  // --------------------------------------------------------------------------
  // Derived State (Filtering)
  // --------------------------------------------------------------------------

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        partner.name.toLowerCase().includes(searchLower) ||
        partner.bio.toLowerCase().includes(searchLower)
      
      const matchesTier = tierFilter === 'all' || partner.tier === tierFilter
      
      return matchesSearch && matchesTier
    })
  }, [partners, searchTerm, tierFilter])

  // ============================================================================
  // RENDER LAYOUT
  // ============================================================================

  return (
    <AdminLayout>
      <div className="section-container section-padding py-8 max-w-6xl mx-auto">
        
        {/* Header with Add Button */}
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
        
        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input 
              placeholder="Search partners by name or bio..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full h-10 pl-10" 
            />
          </div>
          <div className="h-10">
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <div className="max-h-[600px] overflow-y-auto relative [&>div]:border-0 [&>div]:rounded-none rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background shadow-sm border-b border-border">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-left font-semibold">PARTNER</TableHead>
                      <TableHead className="text-left font-semibold">TIER</TableHead>
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
                          <Badge variant="outline" className={`px-3 py-1 font-medium capitalize ${getTierBadgeClass(partner.tier)}`}>
                            {partner.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-middle text-left">
                          <a 
                            href={partner.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[200px] inline-block">{partner.url.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="h-3 w-3 ml-0.5 opacity-50" />
                          </a>
                        </TableCell>
                        <TableCell className="text-right align-middle pr-6">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setEditingPartner(partner)
                                setIsEditModalOpen(true)
                              }}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeletePartner(partner.id)}
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

        {/* ==========================================
            MODALS
            ========================================== */}

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