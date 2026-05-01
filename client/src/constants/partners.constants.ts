import { getApiBaseUrl } from "@/lib/api"
import type { Partner } from "@/types/partners.types"

export const API_BASE = getApiBaseUrl()

export const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true"

export const FALLBACK_PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Acme Corporation",
    logo: "",
    url: "https://acme.com",
    bio: "A global leader in technology solutions.",
  },
  {
    id: "2",
    name: "TechFlow Solutions",
    logo: "",
    url: "https://techflow.io",
    bio: "Innovating cloud architecture for modern teams.",
  },
]