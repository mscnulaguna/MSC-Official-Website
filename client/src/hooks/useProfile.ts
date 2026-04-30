import { useState, useEffect, useCallback } from "react";
import type { Member } from "@/types/member";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api/v1";

/** Maps API role → Member role (display tier) */
const roleMap: Record<string, Member["tier"]> = {
  admin:   "Executive",
  officer: "Officer",
  member:  "General",
};

/** e.g. 1 → "1st Year", 2 → "2nd Year" */
function formatYear(n: number): string {
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return `${n}${suffix} Year`;
}

/**
 * emergencyContact from the API may be:
 *  - already an object { name, number }
 *  - a plain string "Name / 09171234567"
 *  - null / undefined
 */

function mapUser(u: Record<string, unknown>): Member {
  const guilds = (u.guilds as { id: string; name: string; slug: string }[]) ?? [];
  const fullName = String(u.fullName ?? "");
  const nameParts = fullName.trim().split(/\s+/);
  const lastName  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const firstName = nameParts.slice(0, -1).join(" ") || fullName;

  return {
    id:               String(u.id ?? ""),
    memberId:         String(u.studentId ?? ""),
    fullName,
    firstName,
    lastName,
    email:            String(u.email ?? ""),
    program:          String(u.course ?? ""),
    year:             u.yearLevel ? formatYear(Number(u.yearLevel)) : "",
    tier:             roleMap[String(u.role ?? "member")] ?? "General",
    memberSince:      u.memberSince
                        ? new Date(String(u.memberSince)).toLocaleDateString("en-PH", {
                            year: "numeric", month: "long", day: "numeric",
                          })
                        : "",
    membershipStatus: u.isActive ? "Active" : "Inactive",
    photo:            String(u.profilePhoto ?? ""),
    qrCode:           u.qrCode ? String(u.qrCode) : null,
    emergencyContact: {
      name:   u.emergencyContact ? String(u.emergencyContact) : "—",
      number: u.contactNumber    ? String(u.contactNumber)    : "—",
    },
    guild:            guilds.length > 0 ? guilds.map((g) => g.name) : null,
  };
}

// ---------------------------------------------------------------------------

export interface UseProfileReturn {
  member: Member | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  uploadPhoto: (file: File) => Promise<void>;
  updateEmergencyContact: (name: string, number: string) => Promise<void>; 
}

export function useProfile(token: string): UseProfileReturn {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        throw new Error(String(body.message ?? `HTTP ${res.status}`));
      }
      const data = (await res.json()) as { user: Record<string, unknown> };
      setMember(mapUser(data.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchProfile();
  }, [fetchProfile, token]);

  const uploadPhoto = useCallback(
    async (file: File) => {
      const form = new FormData();
      form.append("photo", file);

      const res = await fetch(`${API_BASE}/users/me/photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        console.log("profile response:", body);
        throw new Error(String(body.message ?? `HTTP ${res.status}`));
      }

      await fetchProfile();
    },
    [token, fetchProfile]
  );

  const updateEmergencyContact = useCallback(
    async (name: string, number: string) => {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emergencyContact: name, contactNumber: number }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        throw new Error(String(body.message ?? `HTTP ${res.status}`));
      }

      // PATCH returns the same { user: {...} } shape — reuse mapUser directly
      const data = (await res.json()) as { user: Record<string, unknown> };
      setMember(mapUser(data.user));
    },
    [token]
  );

  return { member, loading, error, refetch: fetchProfile, uploadPhoto, updateEmergencyContact };
}