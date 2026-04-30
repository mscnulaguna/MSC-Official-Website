import { useState } from "react";
import ProfileSidebar from "@/components/ui/profile/profile-sidebar";
import FlippableIDCard from "@/components/ui/profile/flip-id";
import EnlargeModal from "@/components/ui/profile/enlarge-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Loader2, AlertCircle, Pencil } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { token } = useAuth();
  const { member, loading, error, uploadPhoto, updateEmergencyContact } = useProfile(token ?? "");

  const [showEnlargeQR, setShowEnlargeQR]   = useState(false);
  const [showEditEC, setShowEditEC]         = useState(false);
  const [ecName, setEcName]                 = useState("");
  const [ecNumber, setEcNumber]             = useState("");
  const [saving, setSaving]                 = useState(false);
  const [saveError, setSaveError]           = useState<string | null>(null);

  const openEditEC = () => {
    if (!member) return;
    setEcName(member.emergencyContact.name === "—" ? "" : member.emergencyContact.name);
    setSaveError(null);
    setShowEditEC(true);
  };

  const handleSaveEC = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateEmergencyContact(ecName.trim(), ecNumber.trim());
      setShowEditEC(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="animate-spin" size={20} />
        <span className="text-sm">Loading your profile...</span>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm text-muted-foreground max-w-xs">
            {error ?? "Unable to load profile. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="animate-spin" size={20} />
        <span className="text-sm">Loading your profile...</span>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm text-muted-foreground max-w-xs">
            {error ?? "Unable to load profile. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="animate-spin" size={20} />
        <span className="text-sm">Loading your profile...</span>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm text-muted-foreground max-w-xs">
            {error ?? "Unable to load profile. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-4 text-right">
        <h1 className="text-2xl font-bold">Digital Member ID</h1>
        <p className="text-sm mt-1">Click the card to flip and view emergency information</p>
      </div>
 
      <div className="max-w-6xl mx-auto px-6 pb-16 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Sidebar */}
        <div className="order-2 lg:order-1 w-full lg:w-auto">
          <ProfileSidebar member={member} onPhotoChange={uploadPhoto} />
        </div>

        {/* Center: Flippable ID card */}
        <div className="order-1 lg:order-2 w-full lg:flex-1 flex flex-col items-center gap-5">
          <FlippableIDCard member={member} />
          <div className="flex gap-3">
            <Button
              onClick={() => setShowEnlargeQR(true)}
              className="hover:bg-[#0090d4] px-5 py-2.5 text-sm font-medium flex items-center gap-2"
            >
              <QrCode size={16} />
              Enlarge QR
            </Button>
            <Button
              onClick={openEditEC}
              className="px-5 py-2.5 text-sm font-medium flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit Emergency Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Enlarge QR modal */}
      <EnlargeModal open={showEnlargeQR} onClose={() => setShowEnlargeQR(false)} title="QR Code">
        <div className="flex flex-col items-center gap-4 p-6">
          {member.qrCode ? (
            <img src={member.qrCode} alt="QR Code" className="w-64 h-64 object-contain" />
          ) : (
            <p className="text-sm text-muted-foreground">No QR code available.</p>
          )}
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            This QR code is for official member verification and activity tracking.
          </p>
        </div>
      </EnlargeModal>

      {/* Edit Emergency Contact modal */}
      <EnlargeModal open={showEditEC} onClose={() => setShowEditEC(false)} title="Edit Emergency Contact">
        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ec-name">Contact Name</Label>
            <Input
              id="ec-name"
              placeholder="e.g. Juan Dela Cruz"
              value={ecName}
              onChange={(e) => setEcName(e.target.value)}
              disabled={saving}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ec-number">Contact Number</Label>
            <Input
              id="ec-number"
              placeholder="e.g. 09171234567"
              value={ecNumber}
              onChange={(e) => setEcNumber(e.target.value)}
              disabled={saving}
            />
          </div>

          {saveError && <p className="text-xs text-red-500">{saveError}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setShowEditEC(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveEC} disabled={saving} className="flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </EnlargeModal>
    </div>
  );
}
 