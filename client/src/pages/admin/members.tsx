import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AdminLayout } from '@/components/ui/layout'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, Trash2, Edit, AlertCircle, Upload, Copy, Search, FileDown, X, Download } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { getApiBaseUrl } from '@/lib/api'

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE = getApiBaseUrl()
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'

const ROLE_OPTIONS = [
  { label: 'All Roles', value: 'all' },
  { label: 'Member', value: 'member' },
  { label: 'Officer', value: 'officer' },
  { label: 'Admin', value: 'admin' },
]

const STATUS_OPTIONS = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const COURSE_OPTIONS = [
  { label: 'Bachelor of Science in Accountancy', value: 'bsacct' },
  { label: 'Bachelor of Science in Accounting Information System', value: 'bsais' },
  { label: 'Bachelor of Science in Business Administration major in Marketing and Advertising', value: 'bsbamarketing' },
  { label: 'Bachelor of Science in Criminology', value: 'bscrim' },
  { label: 'Bachelor of Science in Information Technology', value: 'bsit' },
  { label: 'Bachelor of Science in Computer Science', value: 'bscs' },
  { label: 'Bachelor of Science in Information Systems', value: 'bsis' },
  { label: 'Bachelor of Science in Computer Engineering', value: 'bscpe' },
  { label: 'Bachelor of Science in Architecture', value: 'bsarch' },
  { label: 'Bachelor of Science in Civil Engineering', value: 'bsce' },
  { label: 'Bachelor of Science in Psychology', value: 'bspsych' },
  { label: 'Bachelor of Science in Exercise and Sports Science', value: 'bsess' },
  { label: 'Bachelor of Multimedia Arts', value: 'bma' },
  { label: 'Bachelor of Arts in Communication', value: 'bac' },
  { label: 'Bachelor of Science in Tourism Management', value: 'bstm' },
  { label: 'Master in Management', value: 'mm' },
  { label: 'Master in Information Technology', value: 'mit' },
  { label: 'Master of Arts in Education (English)', value: 'maeeeng' },
  { label: 'Master of Arts in Education (Filipino)', value: 'maeefil' },
  { label: 'Master of Arts in Education (Special Education)', value: 'maeesp' },
  { label: 'Master of Arts in Education (Educational Management)', value: 'maeeem' },
  { label: 'Doctor of Education major in Educational Management', value: 'dodem' },
  { label: 'Senior High School - HUMSS', value: 'shshumss' },
  { label: 'Senior High School - STEM', value: 'shsstem' },
  { label: 'Senior High School - ABM', value: 'shsabm' },
  { label: 'Senior High School - Sports Track', value: 'shssports' },
]

const ROLE_REGISTER_OPTIONS = [
  { label: 'Member', value: 'member' },
  { label: 'Officer', value: 'officer' },
  { label: 'Admin', value: 'admin' },
]

// ============================================================================
// FALLBACK/MOCK DATA
// ============================================================================

const FALLBACK_MEMBERS: User[] = [
  {
    id: '1',
    email: 'john.doe@university.edu',
    fullName: 'John Doe',
    studentId: 'STU001',
    yearLevel: 2,
    course: 'bscs',
    role: 'member',
    guilds: [],
    qrCode: 'QR001',
    memberSince: '2024-01-15',
    isActive: true,
  },
  {
    id: '2',
    email: 'jane.smith@university.edu',
    fullName: 'Jane Smith',
    studentId: 'STU002',
    yearLevel: 3,
    course: 'bsit',
    role: 'officer',
    guilds: [],
    qrCode: 'QR002',
    memberSince: '2024-02-20',
    isActive: false,
  },
]

// ============================================================================
// INTERFACES
// ============================================================================

interface User {
  id: string
  email: string
  fullName: string
  studentId: string
  yearLevel: number
  course: string
  role: 'member' | 'officer' | 'admin'
  guilds: any[]
  qrCode: string
  memberSince: string
  isActive?: boolean
  requiresPasswordChange?: boolean
  created_at?: string
}

interface RegisterFormData {
  fullName: string
  email: string
  studentId: string
  yearLevel: string
  course: string
  role: 'member' | 'officer' | 'admin'
  photoFile?: File
}

interface SuccessState {
  email: string
  password: string
  fullName: string
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getRoleBadgeClass = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'member': return 'border-green-500 text-green-700 dark:text-green-400'
    case 'officer':
    case 'admin':
    case 'staff': return 'border-blue-500 text-blue-700 dark:text-blue-400'
    default: return ''
  }
}

const generateTemporaryPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

// ============================================================================
// COMPONENTS
// ============================================================================

// TABLE SKELETON
const TableSkeleton = () => (
  <div className="space-y-4">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
    ))}
  </div>
)

// HEADER SECTION
function MembersHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground">Members</h1>
      <p>Manage organization members and registrations</p>
    </div>
  )
}

// BULK IMPORT MODAL
function BulkImportModal({ onImportComplete }: { onImportComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsedCount, setParsedCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDownloadTemplate = () => {
    const csvContent = 
      "email,fullName,studentId,yearLevel,course,role\n" +
      "sample@students.nu-laguna.edu.ph,Juan Dela Cruz,2026-000000,1,bsit,member\n";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'msc_members_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const parseAndValidateCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
    if (lines.length < 2) return { error: 'File is empty or missing data rows.' }

    const headers = lines[0].split(',').map((h) => h.trim())
    const requiredHeaders = ['email', 'fullName', 'studentId', 'yearLevel', 'course', 'role']
    const missingHeaders = requiredHeaders.filter((req) => !headers.includes(req))

    if (missingHeaders.length > 0) {
      return { error: `Missing required columns: ${missingHeaders.join(', ')}` }
    }

    const errors: string[] = []
    let validCount = 0

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((cell) => cell.replace(/^"|"$/g, '').trim())
      
      let hasMissingData = false
      headers.forEach((header, index) => {
        if (requiredHeaders.includes(header) && !row[index]) {
          hasMissingData = true
        }
      })

      if (hasMissingData) {
        errors.push(`Row ${i + 1} is missing required data.`)
      } else {
        validCount++
      }
    }

    if (errors.length > 0) {
      const errorSummary = errors.length > 3 
        ? `${errors.slice(0, 3).join(', ')} ...and ${errors.length - 3} more errors.` 
        : errors.join(', ')
      return { error: `Data Validation Failed: ${errorSummary}` }
    }

    return { count: validCount }
  }

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.')
      setFile(null)
      setParsedCount(0)
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a smaller file.')
      setFile(null)
      setParsedCount(0)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { error, count } = parseAndValidateCSV(text)
      
      if (error) {
        setError(error)
        setFile(null)
        setParsedCount(0)
      } else {
        setError(null)
        setFile(selectedFile)
        setParsedCount(count || 0)
      }
    }
    reader.onerror = () => {
      setError('Failed to read file.')
      setFile(null)
    }
    reader.readAsText(selectedFile)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0])
  }

  const handleSubmit = async () => {
    if (!file || parsedCount === 0) return
    setLoading(true)
    setError(null)

    try {
      // Read CSV and build JSON payload per API contract: { users: [...] }
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '')
      const headers = lines[0].split(',').map(h => h.trim())
      const users: any[] = []
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(/,(?=(?:(?:[^\"]*\"){2})*[^\"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim())
        if (row.length !== headers.length) continue
        const obj: any = {}
        headers.forEach((h, idx) => { obj[h] = row[idx] })
        // normalize types
        if (obj.yearLevel) obj.yearLevel = parseInt(obj.yearLevel as string)
        users.push(obj)
      }

      if (DEV_MODE) {
        await new Promise((res) => setTimeout(res, 800))
        setResult({ success: true, message: 'Import completed successfully', sent: users.length, failed: 0, errors: [] })
        onImportComplete()
        return
      }

      const res = await fetch(`${API_BASE}/admin/users/bulk/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ users }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Failed to bulk import users.')

      setResult(data)
      onImportComplete()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setError(null)
    setResult(null)
    setParsedCount(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) handleReset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline"><FileDown className="w-4 h-4 mr-2" /> Bulk Import</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Import Members</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing member data. Required columns: <span className="font-mono text-xs text-foreground bg-muted px-1 py-0.5 rounded">email, fullName, studentId, yearLevel, course, role</span>
            <br />
            <span className="text-xs text-muted-foreground mt-2 block">Note: Role must be 'member', 'officer', or 'admin'.</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {!result && (
            <Card className="bg-muted/30 shadow-none py-0 overflow-hidden">
              <CardHeader className="px-4 py-3 items-center">
                <div>
                  <CardTitle className="text-sm">Need a starting point?</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Download the formatted CSV template.
                  </CardDescription>
                </div>
                <CardAction className="self-center mt-0">
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate} type="button">
                    <Download className="w-4 h-4 mr-2" />
                    Template
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && result.success ? (
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {result.message}. Successfully processed {result.sent} records.
              </AlertDescription>
            </Alert>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground hover:bg-muted/30'
              }`}
            >
              {file && parsedCount > 0 ? (
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    Ready to import {parsedCount} member(s)
                  </p>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleReset(); }} className="mt-2 text-red-600 hover:text-red-700">
                    <X className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Select CSV File or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB</p>
                  <p className="text-xs text-muted-foreground">CSV format only</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outlineGrey" onClick={() => setIsOpen(false)} disabled={loading}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {!result && (
            <Button onClick={handleSubmit} disabled={!file || parsedCount === 0 || loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// EDIT MEMBER MODAL
interface EditMemberModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  member: User | null
  onUpdateComplete: (updatedData: RegisterFormData) => Promise<void>
}

function EditMemberModal({ isOpen, onOpenChange, member, onUpdateComplete }: EditMemberModalProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '', email: '', studentId: '', yearLevel: '', course: '', role: 'member', photoFile: undefined,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.fullName,
        email: member.email,
        studentId: member.studentId,
        yearLevel: String(member.yearLevel),
        course: member.course,
        role: member.role as any,
        photoFile: undefined
      })
      setPreviewUrl(null)
      setError(null)
    }
  }, [member, isOpen])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Please select a valid image file (JPG or PNG)')
    if (file.size > 5 * 1024 * 1024) return alert('File size must be less than 5MB')
    
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setFormData((prev) => ({ ...prev, photoFile: file }))
  }

  const handlePhotoClick = () => fileInputRef.current?.click()
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
    if (e.dataTransfer.files?.[0]) handlePhotoChange(e.dataTransfer.files[0])
  }

  const handleRemovePhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setFormData((prev) => ({ ...prev, photoFile: undefined }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onUpdateComplete(formData)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member Information</DialogTitle>
          <DialogDescription>Adjust the details for {member?.fullName} below.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>
          )}

          {/* ROW 1: PHOTO UPLOAD */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div
              onClick={!previewUrl ? handlePhotoClick : undefined}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                previewUrl ? 'border-border' : dragOver ? 'border-primary bg-primary/5 cursor-pointer' : 'border-border hover:border-muted-foreground hover:bg-muted/30 cursor-pointer'
              }`}
            >
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <div 
                    className="relative w-36 h-36 mx-auto mb-4 group rounded-full overflow-hidden border-4 border-muted cursor-pointer"
                    onClick={handlePhotoClick}
                  >
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                      <Upload className="h-6 w-6 text-white mb-1" />
                      <span className="text-white text-xs font-medium">Change</span>
                    </div>
                  </div>
                  <Button variant="outlineDestructive" size="sm" onClick={handleRemovePhoto} type="button">
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Drag or click to update photo</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. Will be cropped 1:1.</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => e.target.files?.[0] && handlePhotoChange(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* ROW 2: NAME & EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="doej@students.nu-laguna.edu.ph" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
            </div>
          </div>

          {/* ROW 3: STUDENT ID & YEAR LEVEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Student ID</Label>
              <Input placeholder="2026-000000" value={formData.studentId} onChange={(e) => handleInputChange('studentId', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Year Level</Label>
              <Input placeholder="1" type="number" min="1" max="4" value={formData.yearLevel} onChange={(e) => handleInputChange('yearLevel', e.target.value)} required />
            </div>
          </div>

          {/* ROW 4: COURSE & ROLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={formData.course} onValueChange={(val) => handleInputChange('course', val)}>
                <SelectTrigger><SelectValue placeholder="Select course..." /></SelectTrigger>
                <SelectContent>
                  {COURSE_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(val) => handleInputChange('role', val as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLE_REGISTER_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border sm:justify-between">
            <Button variant="outlineGrey" onClick={() => onOpenChange(false)} type="button" disabled={loading} className="w-full sm:w-auto">
              Discard Changes
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Saving...' : 'Confirm Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// MEMBERS TAB CONTENT
function MembersTab({
  members, loading, error, selectedMembers, onSelectMember, onSelectAll,
  onEditMember, onDeleteMember, onCopyCredentials, onSendEmails, onResetPassword,
  searchTerm, onSearchChange, roleFilter, onRoleFilterChange, statusFilter, onStatusFilterChange,
}: any) {
  return (
    <div className="space-y-6">
      {/* SEARCH + FILTER ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input placeholder="Search members by name, email, or student ID..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="w-full h-10 pl-10" />
        </div>
        <div className="h-10">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="h-10">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedMembers.size > 0 && (
        <Card>
          <CardContent className="py-3 px-6 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{selectedMembers.size} selected</p>
            <div className="flex gap-2">
              <Button onClick={onCopyCredentials}>Copy Credentials</Button>
              <Button onClick={onSendEmails}>Send Emails</Button>
              <Button onClick={onResetPassword}>Reset Password</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>
      )}

      <div className="space-y-4">
        <div><h3 className="text-lg font-semibold text-foreground">Recent Members</h3></div>
        <Separator />
        
        {/* FIX: Removed overflow-hidden from Card, let the div handle scrolling smoothly */}
        <Card className="shadow-none">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6"><TableSkeleton /></div>
            ) : members.length === 0 ? (
              <div className="text-center py-12"><p className="text-muted-foreground">No members found</p></div>
            ) : (
              // FIX: Removed default border-border here, used target selector to kill Shadcn's inner Table border
              <div className="max-h-[600px] overflow-y-auto relative [&>div]:border-0 [&>div]:rounded-none rounded-md">
                <Table>
                  {/* FIX: Set a solid bg-background so scrolling rows are hidden behind it */}
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    {/* Added hover:bg-transparent so headers don't look weirdly active */}
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[50px] text-center">
                        <input type="checkbox" checked={selectedMembers.size === members.length && members.length > 0} onChange={(e) => onSelectAll(e.target.checked)} className="rounded border-border" />
                      </TableHead>
                      <TableHead className="text-left font-semibold">NAME</TableHead>
                      <TableHead className="text-left font-semibold">STUDENT ID</TableHead>
                      <TableHead className="text-left font-semibold">EMAIL</TableHead>
                      <TableHead className="text-left font-semibold">COURSE</TableHead>
                      <TableHead className="text-left font-semibold">ROLE</TableHead>
                      <TableHead className="text-left font-semibold">DATE JOINED</TableHead>
                      <TableHead className="text-right pr-6 font-semibold">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member: User) => (
                      <TableRow key={member.id}>
                        <TableCell className="align-middle text-center">
                          <input type="checkbox" checked={selectedMembers.has(member.id)} onChange={() => onSelectMember(member.id)} className="rounded border-border" />
                        </TableCell>
                        <TableCell className="align-middle text-left">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(member.fullName)}</AvatarFallback></Avatar>
                            <span className="font-medium text-foreground">{member.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground align-middle text-left">{member.studentId}</TableCell>
                        <TableCell className="text-muted-foreground align-middle text-left">{member.email}</TableCell>
                        <TableCell className="text-muted-foreground align-middle text-left uppercase">{member.course}</TableCell>
                        <TableCell className="align-middle text-left">
                          <Badge variant="outline" className={`px-3 py-1.5 text-sm font-medium ${getRoleBadgeClass(member.role)}`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground align-middle text-left">{formatDate(member.memberSince)}</TableCell>
                        <TableCell className="text-right align-middle pr-6">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => onEditMember(member.id)} className="text-blue-600 hover:text-blue-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onDeleteMember(member.id)} className="text-red-600 hover:text-red-700">
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
      </div>
    </div>
  )
}

// REGISTER MEMBER TAB CONTENT
interface RegisterTabProps {
  loading: boolean
  error: string | null
  successState: SuccessState | null
  onReset: () => void
  onRegisterAnother: () => void
  onSubmit: (formData: RegisterFormData) => Promise<void>
  onImportComplete: () => void
}

function RegisterMemberTab({ loading, error, successState, onReset, onRegisterAnother, onSubmit, onImportComplete }: RegisterTabProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '', email: '', studentId: '', yearLevel: '', course: '', role: 'member', photoFile: undefined,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Please select a valid image file (JPG or PNG)')
    if (file.size > 5 * 1024 * 1024) return alert('File size must be less than 5MB')
    
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setFormData((prev) => ({ ...prev, photoFile: file }))
  }

  const handlePhotoClick = () => fileInputRef.current?.click()
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
    if (e.dataTransfer.files?.[0]) handlePhotoChange(e.dataTransfer.files[0])
  }

  const handleRemovePhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setFormData((prev) => ({ ...prev, photoFile: undefined }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  if (successState) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-xl font-bold text-foreground">Account Created</h3>
                <p className="text-sm text-muted-foreground">Share these credentials with the member.</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">EMAIL</Label>
              <Card className="border-border/60 bg-background">
                <CardContent className="py-2 px-3 flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">{successState.email}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(successState.email)}><Copy className="h-4 w-4" /></Button>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">TEMPORARY PASSWORD</Label>
              <Card className="border-border/60 bg-background">
                <CardContent className="py-2 px-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-foreground">{successState.password}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(successState.password)}><Copy className="h-4 w-4" /></Button>
                  </div>
                  <p className="text-xs text-muted-foreground">The member must change their password on first login</p>
                </CardContent>
              </Card>
            </div>
            <Separator />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => copyToClipboard(`Email: ${successState.email}\nPassword: ${successState.password}`)}>
                <Copy className="h-4 w-4 mr-2" /> Copy All Credentials
              </Button>
              <Button onClick={onRegisterAnother} className="bg-green-600 hover:bg-green-700">Register Another</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Register New Member</CardTitle>
            <CardDescription>Fill in the details below to create a new member account.</CardDescription>
          </div>
          <CardAction>
            <BulkImportModal onImportComplete={onImportComplete} />
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>
            )}

            {/* ROW 1: PHOTO UPLOAD */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div
                onClick={!previewUrl ? handlePhotoClick : undefined}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  previewUrl ? 'border-border' : dragOver ? 'border-primary bg-primary/5 cursor-pointer' : 'border-border hover:border-muted-foreground hover:bg-muted/30 cursor-pointer'
                }`}
              >
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative w-36 h-36 mx-auto mb-4 group rounded-full overflow-hidden border-4 border-muted cursor-pointer"
                      onClick={handlePhotoClick}
                    >
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                        <Upload className="h-6 w-6 text-white mb-1" />
                        <span className="text-white text-xs font-medium">Change</span>
                      </div>
                    </div>
                    <Button variant="outlineDestructive" size="sm" onClick={handleRemovePhoto} type="button">
                      Remove Photo
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Drag or click to upload photo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. Will be cropped 1:1.</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => e.target.files?.[0] && handlePhotoChange(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            {/* ROW 2: NAME & EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input placeholder="doej@students.nu-laguna.edu.ph" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
              </div>
            </div>

            {/* ROW 3: STUDENT ID & YEAR LEVEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input placeholder="2026-000000" value={formData.studentId} onChange={(e) => handleInputChange('studentId', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Year Level</Label>
                <Input placeholder="1" type="number" min="1" max="4" value={formData.yearLevel} onChange={(e) => handleInputChange('yearLevel', e.target.value)} required />
              </div>
            </div>

            {/* ROW 4: COURSE & ROLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select value={formData.course} onValueChange={(val) => handleInputChange('course', val)}>
                  <SelectTrigger><SelectValue placeholder="Select course..." /></SelectTrigger>
                  <SelectContent>
                    {COURSE_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(val) => handleInputChange('role', val as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLE_REGISTER_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-left text-xs text-muted-foreground">
              A temporary password will be auto-generated
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-4 w-full">
              <Button variant="outlineGrey" onClick={onReset} type="button" disabled={loading} className="flex-none w-1/4">Cancel</Button>
              <Button variant="destructive" disabled={loading} className="flex-1">{loading ? 'Creating...' : 'Create Account'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MembersPage() {
  const [allMembers, setAllMembers] = useState<User[]>(FALLBACK_MEMBERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [successState, setSuccessState] = useState<SuccessState | null>(null)

  const [activeTab, setActiveTab] = useState('members')

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<User | null>(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: '1', pageSize: '50',
        ...(roleFilter && roleFilter !== 'all' && { role: roleFilter }),
      })

      const token = localStorage.getItem('token')
      if (!token) throw new Error('Missing authentication token')

      const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      if (!res.ok) throw new Error('Failed to fetch members')

      const json = await res.json()
      setAllMembers(json.data || [])
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to load members. Showing fallback data.')
      setAllMembers(FALLBACK_MEMBERS)
    } finally {
      setLoading(false)
    }
  }, [roleFilter]) 

  const filteredMembers = useMemo(() => {
    return allMembers.filter((member) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        member.fullName.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.studentId.toLowerCase().includes(searchLower)
      
      const matchesRole = roleFilter === 'all' || member.role.toLowerCase() === roleFilter.toLowerCase()
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? member.isActive !== false : member.isActive === false)
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [allMembers, searchTerm, roleFilter, statusFilter])

  useEffect(() => {
    if (activeTab === 'members') fetchMembers()
  }, [activeTab, fetchMembers])

  const handleSelectMember = (id: string) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      return newSet
    })
  }

  const handleSelectAll = (selectAll: boolean) => {
    setSelectedMembers(selectAll ? new Set(filteredMembers.map((m) => m.id)) : new Set())
  }

  const handleEditMember = (id: string) => {
    const memberToEdit = allMembers.find(m => m.id === id)
    if (memberToEdit) {
      setEditingMember(memberToEdit)
      setIsEditModalOpen(true)
    }
  }

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setAllMembers((prev) => prev.filter((m) => m.id !== id))
    }
  }

  const handleCopyCredentials = async () => {
    const credentialsList = allMembers.filter((m) => selectedMembers.has(m.id)).map((m) => `${m.email}`).join('\n')
    await copyToClipboard(credentialsList)
  }

  const handleSendEmails = () => console.log('Sending emails to:', Array.from(selectedMembers))
  const handleResetPassword = () => console.log('Resetting passwords for:', Array.from(selectedMembers))

  const handleRegisterMember = async (formData: RegisterFormData) => {
    setRegisterLoading(true)
    setRegisterError(null)

    try {
      const tempPassword = generateTemporaryPassword()
      const payload = {
        email: formData.email, password: tempPassword, fullName: formData.fullName,
        studentId: formData.studentId, yearLevel: parseInt(formData.yearLevel), course: formData.course,
        role: formData.role,
      }

      if (DEV_MODE) {
        setSuccessState({ email: formData.email, password: tempPassword, fullName: formData.fullName })
        return
      }

      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }, 
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error?.message || 'Registration failed')
      }

      setSuccessState({ email: formData.email, password: tempPassword, fullName: formData.fullName })
      fetchMembers()
    } catch (err: any) {
      setRegisterError(err.message || 'Failed to register member')
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleUpdateMemberSubmit = async (formData: RegisterFormData) => {
    if (!editingMember) return;

    // Only send fields allowed by the API contract for updating a user
    const payload = {
      fullName: formData.fullName,
      yearLevel: parseInt(formData.yearLevel),
      course: formData.course,
    }

    if (DEV_MODE) {
      setAllMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...payload } : m))
      return
    }

    const res = await fetch(`${API_BASE}/admin/users/${editingMember.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error?.message || 'Failed to update member')
    }

    fetchMembers()
  }

  return (
    <AdminLayout>
      <div className="section-container section-padding py-12">
        <div>
          <MembersHeader />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center w-full mb-8">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="register">Register Member</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="members" className="mt-6">
              <MembersTab
                members={filteredMembers} loading={loading} error={error} selectedMembers={selectedMembers}
                onSelectMember={handleSelectMember} onSelectAll={handleSelectAll} onEditMember={handleEditMember}
                onDeleteMember={handleDeleteMember} onCopyCredentials={handleCopyCredentials}
                onSendEmails={handleSendEmails} onResetPassword={handleResetPassword}
                searchTerm={searchTerm} onSearchChange={setSearchTerm} roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
              />
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <RegisterMemberTab
                loading={registerLoading} error={registerError} successState={successState}
                onReset={() => { setSuccessState(null); setRegisterError(null) }}
                onRegisterAnother={() => { setSuccessState(null); setRegisterError(null) }}
                onSubmit={handleRegisterMember}
                onImportComplete={fetchMembers}
              />
            </TabsContent>
          </Tabs>

          <EditMemberModal 
            isOpen={isEditModalOpen} 
            onOpenChange={setIsEditModalOpen} 
            member={editingMember}
            onUpdateComplete={handleUpdateMemberSubmit}
          />
        </div>
      </div>
    </AdminLayout>
  )
}