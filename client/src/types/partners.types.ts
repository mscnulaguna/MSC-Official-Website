export interface Partner {
  id: string
  name: string
  logo: string
  url: string
  bio: string
}

export interface PartnerFormData {
  name: string
  url: string
  bio: string
  logoFile?: File
}