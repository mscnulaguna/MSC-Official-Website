import { useState } from "react";
import ProfileSidebar from "@/components/ui/profile/profile-sidebar";
import FlippableIDCard from "@/components/ui/profile/flip-id";
import EnlargeModal from "@/components/ui/profile/enlarge-modal";
import { Button } from "@/components/ui/button";
import { Maximize2, QrCode } from "lucide-react";
import type { Member } from "@/types/member";

interface ProfilePageProps {
  member: Member;
}

export default function ProfilePage({ member }: ProfilePageProps) {
  const [showEnlargeQR, setShowEnlargeQR] = useState(false);

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-4 text-right">
        <h1 className="text-2xl font-bold">Digital Member ID</h1>
        <p className="text-sm mt-1">
          Click the card to flip and view emergency information
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 flex flex-col lg:flex-row gap-8 items-start">
        <div className="order-first lg:order-last w-full lg:w-auto lg:flex-1 flex flex-col items-center gap-5">
          <FlippableIDCard member={member} />

          <div className="flex gap-3">
            <Button
              onClick={() => setShowEnlargeQR(true)}
              className="hover:bg-[#0090d4] px-5 py-2.5 text-sm font-medium flex items-center gap-2"
            >
              <QrCode size={16} />
              Enlarge QR
            </Button>
          </div>
        </div>

        <div className="order-last lg:order-first w-full lg:w-auto">
          <ProfileSidebar member={member} />
        </div>
      </div>

      <EnlargeModal open={showEnlargeQR} onClose={() => setShowEnlargeQR(false)} title="QR Code">
        <div className="flex flex-col items-center gap-4 p-6">
          {member.qrCode && (
            <img src={member.qrCode} alt="QR Code" className="w-64 h-64 object-contain" />
          )}
          <p className="text-sm flex items-center gap-2">
            This QR code is for official member verification and activity tracking.
          </p>
        </div>
      </EnlargeModal>
    </div>
  );
}