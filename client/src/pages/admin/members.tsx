import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Layout } from '@/components/ui/layout/Layout'
//import { Combobox } from '@/components/ui/combobox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, Trash2, ExternalLink, AlertCircle, Upload, Copy, Search } from 'lucide-react'
import { getInitials } from '@/lib/utils'

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.msc-nulaguna.org/v1'
const DEV_MODE = true // Set to true to skip API calls and show success state instantly

const ROLE_OPTIONS = [
  { label: 'All Roles', value: 'all' },
  { label: 'Member', value: 'member' },
  { label: 'Officer', value: 'officer' },
  { label: 'Admin', value: 'admin' },
  { label: 'Partner', value: 'partner' },
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
  { label: 'Partner', value: 'partner' },
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
    course: 'Computer Science',
    role: 'member',
    guilds: [],
    qrCode: 'QR001',
    memberSince: '2024-01-15',
  },
  {
    id: '2',
    email: 'jane.smith@university.edu',
    fullName: 'Jane Smith',
    studentId: 'STU002',
    yearLevel: 3,
    course: 'Information Technology',
    role: 'officer',
    guilds: [],
    qrCode: 'QR002',
    memberSince: '2024-02-20',
  },
  {
    id: '3',
    email: 'alex.johnson@university.edu',
    fullName: 'Alex Johnson',
    studentId: 'STU003',
    yearLevel: 1,
    course: 'Engineering',
    role: 'member',
    guilds: [],
    qrCode: 'QR003',
    memberSince: '2024-03-10',
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
}

interface UsersResponse {
  data: User[]
  total: number
  page: number
  pageSize: number
}

interface RegisterFormData {
  fullName: string
  email: string
  studentId: string
  yearLevel: string
  course: string
  role: 'member' | 'officer' | 'partner'
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
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getRoleBadgeClass = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'member':
      return 'border-green-500 text-green-700 dark:text-green-400'
    case 'partner':
      return 'border-yellow-500 text-yellow-700 dark:text-yellow-400'
    case 'officer':
    case 'admin':
    case 'staff':
      return 'border-blue-500 text-blue-700 dark:text-blue-400'
    default:
      return ''
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
    {Array(5)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
      ))}
  </div>
)

// HEADER SECTION
function MembersHeader() {
  return (
    <div className="space-y-2 mb-8">
      <h1 className="text-3xl font-bold text-foreground">Members</h1>
      <p className="text-muted-foreground">Manage organization members and registrations</p>
    </div>
  )
}

// MEMBERS TAB CONTENT
interface MembersTabProps {
  members: User[]
  loading: boolean
  error: string | null
  selectedMembers: Set<string>
  onSelectMember: (id: string) => void
  onSelectAll: (all: boolean) => void
  onEditMember: (id: string) => void
  onDeleteMember: (id: string) => void
  onCopyCredentials: () => void
  onSendEmails: () => void
  onResetPassword: () => void
  searchTerm: string
  onSearchChange: (term: string) => void
  roleFilter: string
  onRoleFilterChange: (role: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

function MembersTab({
  members,
  loading,
  error,
  selectedMembers,
  onSelectMember,
  onSelectAll,
  onEditMember,
  onDeleteMember,
  onCopyCredentials,
  onSendEmails,
  onResetPassword,
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}: MembersTabProps) {
  return (
    <div className="space-y-6">
      {/* SEARCH + FILTER ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search members by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10"
          />
        </div>

        {/* Role Filter */}
        <div className="h-10">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="h-10">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* BULK ACTION BAR */}
      {selectedMembers.size > 0 && (
        <Card className="bg-muted/50 border-border">
          <CardContent className="py-3 px-6 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{selectedMembers.size} selected</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={onCopyCredentials}>
                Copy Credentials
              </Button>
              <Button size="sm" onClick={onSendEmails}>
                Send Emails
              </Button>
              <Button size="sm" onClick={onResetPassword}>
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ERROR STATE */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* RECENT MEMBERS SECTION */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Members</h3>
        </div>
        <Separator />

        {/* TABLE */}
        <Card className="pr-6">
          <CardContent className="pt-6">
            {loading ? (
              <TableSkeleton />
            ) : members.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No members found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px] text-center">
                        <input
                          type="checkbox"
                          checked={selectedMembers.size === members.length && members.length > 0}
                          onChange={(e) => onSelectAll(e.target.checked)}
                          className="rounded border-border"
                        />
                      </TableHead>
                      <TableHead className="text-center">NAME</TableHead>
                      <TableHead className="text-center">STUDENT ID</TableHead>
                      <TableHead className="text-center">EMAIL</TableHead>
                      <TableHead className="text-center">COURSE</TableHead>
                      <TableHead className="text-center">ROLE</TableHead>
                      <TableHead className="text-center">DATE JOINED</TableHead>
                      <TableHead className="text-right pr-6">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="align-middle">
                          <input
                            type="checkbox"
                            checked={selectedMembers.has(member.id)}
                            onChange={() => onSelectMember(member.id)}
                            className="rounded border-border"
                          />
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(member.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{member.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground align-middle">{member.studentId}</TableCell>
                        <TableCell className="text-muted-foreground align-middle">{member.email}</TableCell>
                        <TableCell className="text-muted-foreground align-middle">{member.course}</TableCell>
                        <TableCell className="align-middle">
                          <Badge variant="outline" className={`px-3 py-1.5 text-sm font-medium ${getRoleBadgeClass(member.role)}`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground align-middle">
                          {formatDate(member.memberSince)}
                        </TableCell>
                        <TableCell className="text-right align-middle">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditMember(member.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteMember(member.id)}
                              className="text-red-600 hover:text-red-700"
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
}

function RegisterMemberTab({ loading, error, successState, onReset, onRegisterAnother, onSubmit }: RegisterTabProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    studentId: '',
    yearLevel: '',
    course: '',
    role: 'member',
    photoFile: undefined,
  })
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePhotoChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG or PNG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }
    setFormData((prev) => ({
      ...prev,
      photoFile: file,
    }))
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handlePhotoChange(files[0])
    }
  }

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoFile: undefined,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
            {/* SUCCESS HEADER */}
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

            {/* EMAIL CARD */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">EMAIL</Label>
              <Card className="border-border/60 bg-background">
                <CardContent className="py-2 px-3 flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">{successState.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(successState.email)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* PASSWORD CARD */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">TEMPORARY PASSWORD</Label>
              <Card className="border-border/60 bg-background">
                <CardContent className="py-2 px-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-foreground">{successState.password}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(successState.password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The member must change their password on first login
                  </p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  copyToClipboard(`Email: ${successState.email}\nPassword: ${successState.password}`)
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All Credentials
              </Button>
              <Button onClick={onRegisterAnother} className="bg-green-600 hover:bg-green-700">
                Register Another
              </Button>
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
          <h3 className="text-lg font-bold text-foreground">Register New Member</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details below to create a new member account
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* ROW 1: PHOTO UPLOAD */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div
                onClick={handlePhotoClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground hover:bg-muted/30'
                }`}
              >
                {formData.photoFile ? (
                  <div className="space-y-3">
                    <div className="text-green-600 font-medium text-sm">✓ File selected</div>
                    <p className="text-sm font-medium text-foreground break-all">{formData.photoFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(formData.photoFile.size / 1024).toFixed(2)} KB</p>
                    <Button
                      variant="outlineDestructive"
                      size="sm"
                      onClick={handleRemovePhoto}
                      type="button"
                    >
                      Remove Photo
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Drag or click to upload photo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
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
                <Input
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="doej@students.nu-laguna.edu.ph"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ROW 3: STUDENT ID & YEAR LEVEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input
                  placeholder="2026-000000"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Year Level</Label>
                <Input
                  placeholder="1"
                  type="number"
                  min="1"
                  max="4"
                  value={formData.yearLevel}
                  onChange={(e) => handleInputChange('yearLevel', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ROW 4: COURSE & ROLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select value={formData.course} onValueChange={(val) => handleInputChange('course', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => handleInputChange('role', val as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_REGISTER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-left text-xs text-muted-foreground">
              A temporary password will be auto-generated
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-4 w-full">
              <Button variant="outlineGrey" onClick={onReset} type="button" disabled={loading} className="flex-none w-1/4">
                Cancel
              </Button>
              <Button variant="destructive" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
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
  // ---- MEMBERS TAB STATE ----
  const [members, setMembers] = useState<User[]>(FALLBACK_MEMBERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // ---- REGISTER TAB STATE ----
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [successState, setSuccessState] = useState<SuccessState | null>(null)

  // ---- TABS STATE ----
  const [activeTab, setActiveTab] = useState('members')

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (activeTab === 'members') {
      fetchMembers()
    }
  }, [activeTab, roleFilter, statusFilter])

  // ============================================================================
  // FETCH HANDLERS
  // ============================================================================

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: '1',
        pageSize: '50',
        ...(roleFilter && roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter }),
      })

      const res = await fetch(`${API_BASE}/users?${params.toString()}`)

      if (!res.ok) {
        throw new Error('Failed to fetch members')
      }

      const contentType = res.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid API response')
      }

      const json = await res.json()
      const data = json.data || []

      // Apply search filter locally
      const filtered = data.filter(
        (member: User) =>
          member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      )

      setMembers(filtered)
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to load members. Showing fallback data.')
      // Keep fallback data visible
      setMembers(FALLBACK_MEMBERS)
    } finally {
      setLoading(false)
    }
  }, [roleFilter, statusFilter, searchTerm])

  // ============================================================================
  // MEMBER ACTIONS
  // ============================================================================

  const handleSelectMember = (id: string) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedMembers(new Set(members.map((m) => m.id)))
    } else {
      setSelectedMembers(new Set())
    }
  }

  const handleEditMember = (id: string) => {
    console.log('Edit member:', id)
    // TODO: Implement edit functionality
  }

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers((prev) => prev.filter((m) => m.id !== id))
    }
  }

  const handleCopyCredentials = async () => {
    const credentialsList = members
      .filter((m) => selectedMembers.has(m.id))
      .map((m) => `${m.email}`)
      .join('\n')

    await copyToClipboard(credentialsList)
  }

  const handleSendEmails = () => {
    console.log('Sending emails to:', Array.from(selectedMembers))
    // TODO: Implement email sending
  }

  const handleResetPassword = () => {
    console.log('Resetting passwords for:', Array.from(selectedMembers))
    // TODO: Implement password reset
  }

  // ============================================================================
  // REGISTRATION HANDLERS
  // ============================================================================

  const handleRegisterMember = async (formData: RegisterFormData) => {
    setRegisterLoading(true)
    setRegisterError(null)

    try {
      const tempPassword = generateTemporaryPassword()

      const payload = {
        email: formData.email,
        password: tempPassword,
        fullName: formData.fullName,
        studentId: formData.studentId,
        yearLevel: parseInt(formData.yearLevel),
        course: formData.course,
      }

      // Skip API call in dev mode for UI testing
      if (DEV_MODE) {
        setSuccessState({
          email: formData.email,
          password: tempPassword,
          fullName: formData.fullName,
        })
        return
      }

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error?.message || 'Registration failed')
      }

      const contentType = res.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid API response')
      }

      // Parse response (not used, but validates JSON)
      await res.json()

      // Show success state
      setSuccessState({
        email: formData.email,
        password: tempPassword,
        fullName: formData.fullName,
      })

      // Refresh members list
      fetchMembers()
    } catch (err: any) {
      console.error('Registration error:', err)
      setRegisterError(err.message || 'Failed to register member')
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleResetRegisterForm = () => {
    setSuccessState(null)
    setRegisterError(null)
  }

  const handleRegisterAnother = () => {
    setSuccessState(null)
    setRegisterError(null)
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Layout hideFooter>
      <div className="section-container section-padding py-12">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <MembersHeader />

          {/* TABS */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="register">Register Member</TabsTrigger>
            </TabsList>

            {/* MEMBERS TAB */}
            <TabsContent value="members" className="mt-6">
              <MembersTab
                members={members}
                loading={loading}
                error={error}
                selectedMembers={selectedMembers}
                onSelectMember={handleSelectMember}
                onSelectAll={handleSelectAll}
                onEditMember={handleEditMember}
                onDeleteMember={handleDeleteMember}
                onCopyCredentials={handleCopyCredentials}
                onSendEmails={handleSendEmails}
                onResetPassword={handleResetPassword}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </TabsContent>

            {/* REGISTER MEMBER TAB */}
            <TabsContent value="register" className="mt-6">
              <RegisterMemberTab
                loading={registerLoading}
                error={registerError}
                successState={successState}
                onReset={handleResetRegisterForm}
                onRegisterAnother={handleRegisterAnother}
                onSubmit={handleRegisterMember}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}
