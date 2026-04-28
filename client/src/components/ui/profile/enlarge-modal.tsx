import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnlargeModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function EnlargeModal({ open, onClose, title, children }: EnlargeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 shadow-2xl bg-background shadow-card-foreground/20 max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none hover:bg-gray-100">
            <X size={18} />
          </Button>
        </div>
        <div className="flex justify-center">{children}</div>
      </div>
    </div>
  );
}