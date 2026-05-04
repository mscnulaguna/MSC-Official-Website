import { useRef, useState, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Hash, CalendarDays, ShieldCheck, Camera, Loader2 } from "lucide-react";
import type { Member } from "@/types/member.types";
import Mike from "@/assets/icons/mike.png";

interface ProfileSidebarProps {
  member: Member;
  onPhotoChange?: (file: File) => Promise<void>;
}

export default function ProfileSidebar({ member, onPhotoChange }: ProfileSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const initials = member.fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onPhotoChange) return;

    setUploading(true);
    setUploadError(null);
    try {
      await onPhotoChange(file);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const topFields: FieldData[] = [
    { icon: <Hash size={13} />,        label: "MEMBER ID",     value: member.memberId,    color: "border-[#00A2ED]" },
    { icon: <CalendarDays size={13} />, label: "MEMBER SINCE",  value: member.memberSince, color: "border-green-500" },
  ];

  const bottomFields: FieldData[] = [
    { icon: <ShieldCheck size={13} />, label: "MEMBERSHIP STATUS", value: member.membershipStatus, color: "border-yellow-400" },
    { icon: <Mail size={13} />,        label: "EMAIL",              value: member.email,            color: "border-red-400" },
  ];

  return (
    <Card className="w-full lg:w-100 shrink-0 border overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        {/* Avatar */}
        <div className="relative mt-2">
          <Avatar className="w-28 h-28 ring-2 ring-gray-200">
            <AvatarImage src={Mike} alt={member.fullName} className="object-cover" />
            <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>

          <button
            type="button"
            onClick={() => !uploading && fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200
                       shadow-md flex items-center justify-center cursor-pointer
                       hover:bg-gray-50 transition-colors duration-150 disabled:cursor-not-allowed"
            aria-label={uploading ? "Uploading photo…" : "Change profile photo"}
          >
            {uploading
              ? <Loader2 size={14} className="text-gray-600 animate-spin" />
              : <Camera size={14} className="text-gray-600" />}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {uploadError && (
          <p className="text-xs text-red-500 -mt-2">{uploadError}</p>
        )}

        {/* Name & Program */}
        <div>
          <h2 className="text-xl font-bold">{member.fullName}</h2>
          <p className="text-sm text-muted-foreground">{member.program}</p>
        </div>

        <hr className="w-full" />

        {/* Fields */}
        <div className="w-full flex flex-col gap-5 text-left">
          <div className="grid grid-cols-2 gap-x-4">
            {topFields.map((f) => <FieldItem key={f.label} field={f} />)}
          </div>
          {bottomFields.map((f) => <FieldItem key={f.label} field={f} />)}
        </div>

        {/* Guild badges */}
        {member.guild && member.guild.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {member.guild.map((g) => (
              <Badge key={g} variant="outline" className="font-medium px-3 py-1">
                {g}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------

type FieldData = { icon: React.ReactNode; label: string; value: string; color: string };

function FieldItem({ field }: { field: FieldData }) {
  return (
    <div className={`border-l-2 pl-2 ${field.color}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 text-muted-foreground">
        {field.icon}
        {field.label}
      </p>
      <p className="text-sm font-semibold mt-0.5 break-all leading-tight">
        {field.value}
      </p>
    </div>
  );
}