import { useState } from "react";
import IDCardFront from "./id-front";
import IDCardBack from "./id-back";
import type { Member } from "@/types/member";

interface FlippableIDCardProps {
  member: Member;
  enlarged?: boolean;
}
export default function FlippableIDCard({ member, enlarged = false }: FlippableIDCardProps) {
  const [flipped, setFlipped] = useState(false);

  const containerClass = enlarged
  ? "w-[700px] max-w-full"
  : "w-[400px] md:w-[700px] max-w-full";

  return (
    <div className={`${containerClass} cursor-pointer`} style={{ perspective: "1200px" }}>
      {/* Aspect ratio enforcer */}
      <div
        className="relative w-full"
        style={{ paddingBottom: "56.25%" }}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        aria-label="Flip ID card"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (e.key === " ") e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
      >
        {/* Flip container — absolutely fills the ratio box */}
        <div
          className="absolute inset-0 transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <IDCardFront member={member} />
          </div>

          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <IDCardBack member={member} />
          </div>
        </div>
      </div>
    </div>
  );
}