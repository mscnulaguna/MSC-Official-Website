import { Shield, User, BookOpen, Hash, Mail, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Member } from "@/types/member";

interface QRInfoCardProps {
  member: Member;
  className?: string;
}

/**
 * QRInfoCard
 * Displays the member's QR code alongside the data it encodes.
 */
export default function QRInfoCard({ member, className = "" }: QRInfoCardProps) {
  const qrFields: { icon: React.ReactNode; label: string; value: string; color: string }[] = [
    { icon: <Hash size={13} />,     label: "Student ID", value: member.memberId,  color: "border-[#00A2ED]" },
    { icon: <User size={13} />,     label: "Full Name",  value: member.fullName,  color: "border-green-500" },
    { icon: <Mail size={13} />,     label: "Email",      value: member.email,     color: "border-red-400"   },
    { icon: <BookOpen size={13} />, label: "Program",    value: member.program,   color: "border-orange-400"},
    { icon: <Calendar size={13} />, label: "Year Level", value: member.year,      color: "border-purple-400"},
  ];

  return (
    <Card className={`shrink-0 border overflow-hidden ${className}`}>
      <CardContent className="p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-[#00A2ED]" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            QR Code &amp; Encoded Info
          </h3>
        </div>

        {/* QR image */}
        <div className="flex flex-col items-center gap-3">
          {member.qrCode ? (
            <div className="border border-gray-200 p-3 rounded-sm bg-white shadow-sm">
              <img
                src={member.qrCode}
                alt="Member QR Code"
                className="w-40 h-40 object-contain"
              />
            </div>
          ) : (
            <QRPlaceholder />
          )}
          <p className="text-[11px] text-muted-foreground text-center leading-snug max-w-xs">
            Scan this code for official member verification and activity tracking.
          </p>
        </div>

        <hr />

        {/* Encoded fields */}
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Encoded Information
          </p>
          <div className="grid grid-cols-1 gap-3">
            {qrFields.map((field) => (
              <div key={field.label} className={`border-l-2 pl-2 ${field.color}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 text-muted-foreground">
                  {field.icon}
                  {field.label}
                </p>
                <p className="text-sm font-semibold mt-0.5 break-all leading-tight">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guilds */}
        {member.guild && member.guild.length > 0 && (
          <>
            <hr />
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 text-muted-foreground">
                <Users size={13} />
                Guild Memberships
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {member.guild.map((g) => (
                  <Badge key={g} variant="outline" className="font-medium px-3 py-1 text-xs">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------

function QRPlaceholder() {
  const pattern = [
    [1,1,1,1,1,1,1,0,0],
    [1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,0],
    [0,1,0,0,1,1,0,1,1],
  ];
  return (
    <div className="border border-gray-200 p-3 rounded-sm bg-white shadow-sm">
      <div
        className="grid gap-0.5 w-40 h-40"
        style={{ gridTemplateColumns: "repeat(9, 1fr)" }}
      >
        {pattern.flat().map((cell, i) => (
          <div key={i} className={`rounded-[1px] ${cell ? "bg-gray-300" : "bg-white"}`} />
        ))}
      </div>
    </div>
  );
}