export type TeamMember = {
  name: string
  role: string
  photoSrc?: string
  facebookUrl?: string
  linkedInUrl?: string
  microsoftLearnUrl?: string 
}

export type TeamDepartment = {
  label: string
  description: string
  members: TeamMember[]
}