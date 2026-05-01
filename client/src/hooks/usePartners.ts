import { useState, useEffect, useCallback, useMemo } from "react"
import type { Partner } from "@/types/partners.types"
import { API_BASE, DEV_MODE, FALLBACK_PARTNERS } from "@/constants/partners.constants"

interface UsePartnersReturn {
  partners: Partner[]
  filteredPartners: Partner[]
  loading: boolean
  error: string | null
  searchTerm: string
  setSearchTerm: (term: string) => void
  fetchPartners: () => Promise<void>
  deletePartner: (id: string) => Promise<void>
}

export function usePartners(): UsePartnersReturn {
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchPartners = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (DEV_MODE) {
        await new Promise((res) => setTimeout(res, 800))
        setPartners(FALLBACK_PARTNERS)
        return
      }

      const res = await fetch(`${API_BASE}/partners`)
      if (!res.ok) throw new Error("Failed to fetch partners")

      const contentType = res.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid API response")
      }

      const json = await res.json()
      setPartners(json.data || [])
    } catch (err: unknown) {
      console.error("Fetch error:", err)
      setError("Failed to load partners. Showing fallback data.")
      setPartners(FALLBACK_PARTNERS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  const deletePartner = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to remove this partner?")) return

      try {
        if (DEV_MODE) {
          setPartners((prev) => prev.filter((p) => p.id !== id))
          return
        }

        const res = await fetch(`${API_BASE}/partners/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!res.ok) throw new Error("Failed to delete partner")

        await fetchPartners()
      } catch (err) {
        console.error(err)
        alert("Failed to delete partner. Please try again.")
      }
    },
    [fetchPartners]
  )

  const filteredPartners = useMemo(() => {
    const lower = searchTerm.toLowerCase()
    return partners.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.bio.toLowerCase().includes(lower)
    )
  }, [partners, searchTerm])

  return {
    partners,
    filteredPartners,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchPartners,
    deletePartner,
  }
}