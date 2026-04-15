import type { Member } from "@/types/member";

export const sampleMember: Member = {
  fullName: "John Pork",
  firstName: "John",
  lastName: "Pork",
  memberId: "2023-676767",
  program: "BS ORG",
  year: "3rd Year",
  tier: "Executive",
  guild: ["AI/ML Guild", "Web Dev Guild"],
  memberSince: "2025",
  membershipStatus: "Active Member",
  email: "johnpork@students.nu-laguna.edu.ph",
  photo: "https://randomuser.me/api/portraits",
  qrCode: null,
  emergencyContact: {
    name: "John Pork's Mom",
    number: "0967-123-4567",
  },
};

