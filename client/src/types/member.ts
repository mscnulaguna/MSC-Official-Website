export interface EmergencyContact {
  name: string;
  number: string;
}

export interface Member {
  fullName: string;
  firstName: string;
  lastName: string;
  memberId: string;
  program: string;
  year: string;
  tier: "General" | "Officer" | "Core" | "Executive";
  guild: string[] | null;
  memberSince: string;
  membershipStatus: string;
  email: string;
  photo: string;
  qrCode: string | null;
  emergencyContact: EmergencyContact;
}