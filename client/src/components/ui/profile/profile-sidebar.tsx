import { useRef, type ChangeEvent } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";

import { Mail, Hash, CalendarDays, ShieldCheck, Camera } from "lucide-react";

import type { Member } from "@/types/member";



interface ProfileSidebarProps {

  member: Member;

  onPhotoChange?: (file: File) => void;

}



export default function ProfileSidebar({ member, onPhotoChange }: ProfileSidebarProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);



  const initials = member.fullName

    .split(" ")

    .slice(0, 2)

    .map((n) => n[0])

    .join("");



  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (file) {

      onPhotoChange?.(file);

    }

    // Reset so the same file can be re-selected if needed

    e.target.value = "";

  };



  // Top row: 2-column grid

  const topFields = [

    { icon: <Hash size={13} />, label: "MEMBER ID", value: member.memberId, color: "border-[#00A2ED]" },

    { icon: <CalendarDays size={13} />, label: "MEMBER SINCE", value: member.memberSince, color: "border-green-500" },

  ];



  // Bottom rows: full-width each

  const bottomFields = [

    { icon: <ShieldCheck size={13} />, label: "MEMBERSHIP STATUS", value: member.membershipStatus, color: "border-yellow-400" },

    { icon: <Mail size={13} />, label: "EMAIL", value: member.email, color: "border-red-400" },

  ];



  const FieldItem = ({

    field,

  }: {

    field: { icon: React.ReactNode; label: string; value: string; color: string };

  }) => (

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



  return (

    <Card className="w-full lg:w-100 shrink-0 border overflow-hidden">

      <CardContent className="p-6 flex flex-col items-center text-center gap-4">

        {/* Avatar with change photo icon */}

        <div className="relative mt-2">

          <Avatar className="w-28 h-28 ring-2 ring-gray-200">

            <AvatarImage src={member.photo} alt={member.fullName} className="object-cover" />

            <AvatarFallback className="text-2xl font-bold">

              {initials}

            </AvatarFallback>

          </Avatar>



          {/* Small camera icon button */}

          <button

            type="button"

            onClick={() => fileInputRef.current?.click()}

            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200

                       shadow-md flex items-center justify-center cursor-pointer

                       hover:bg-gray-50 transition-colors duration-150"

            aria-label="Change profile photo"

          >

            <Camera size={14} className="text-gray-600" />

          </button>



          {/* Hidden file input */}

          <input

            ref={fileInputRef}

            type="file"

            accept="image/*"

            className="hidden"

            onChange={handleFileChange}

          />

        </div>



        {/* Name & Program */}

        <div>

          <h2 className="text-xl font-bold">{member.fullName}</h2>

          <p className="text-sm text-muted-foreground">{member.program}</p>

        </div>



        <hr className="w-full" />



        {/* Fields */}

        <div className="w-full flex flex-col gap-5 text-left">

          {/* Top row: 2 columns */}

          <div className="grid grid-cols-2 gap-x-4">

            {topFields.map((field) => (

              <FieldItem key={field.label} field={field} />

            ))}

          </div>



          {/* Bottom rows: full width each */}

          {bottomFields.map((field) => (

            <FieldItem key={field.label} field={field} />

          ))}

        </div>



        {member.guild && (

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