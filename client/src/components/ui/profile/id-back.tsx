import type { Member } from "@/types/member";

interface IDCardBackProps {
  member: Member;
}

export default function IDCardBack({ member }: IDCardBackProps) {
  return (
    <div className="relative w-full h-full overflow-hidden border select-none bg-white">
      <div className="absolute -left-12 md:-left-20 top-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full bg-brand-blue opacity-80" />
      <div className="absolute -left-16 md:-left-25 top-1/2 -translate-y-1/2 w-26 h-26 md:w-36 md:h-36 rounded-full bg-brand-blue opacity-40" />
      <div className="absolute -right-12 md:-right-20 top-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full bg-brand-blue opacity-80" />
      <div className="absolute -right-16 md:-right-25 top-1/2 -translate-y-1/2 w-26 h-26 md:w-36 md:h-36 rounded-full bg-brand-blue opacity-40" />

      <div className="relative z-10 flex h-full items-stretch px-6 md:px-10 lg:px-10 py-4 md:py-6 lg:py-6 gap-4 md:gap-6 lg:gap-6">
        {/* QR section */}
        <div className="flex flex-col items-center justify-center gap-2 md:gap-3 lg:gap-3 flex-1">
          <div className="border border-gray-400 rounded-none p-2 md:p-3 lg:p-3">
            {member.qrCode ? (
              <img
                src={member.qrCode}
                alt="QR Code"
                className="w-20 h-20 md:w-36 md:h-36 lg:w-36 lg:h-36 object-contain"
              />
            ) : (
              <QRPlaceholder />
            )}
          </div>
          <div className="flex items-start gap-1.5 md:gap-2 lg:gap-2 max-w-36 md:max-w-50 lg:max-w-50 text-center">
            <span className="text-green-500 shrink-0 mt-0.5">
              <svg
                width="14"
                height="14"
                className="md:w-[18px] md:h-[18px] lg:w-[18px] lg:h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
              </svg>
            </span>
            <p className="text-[8px] md:text-xs lg:text-xs text-gray-500 leading-snug">
              This QR code is for official member verification and activity tracking.
            </p>
          </div>
        </div>

        <div className="w-px bg-gray-200 self-stretch" />

        {/* Emergency contact */}
        <div className="flex flex-col justify-center gap-3 md:gap-5 lg:gap-5 flex-1">
          <p className="text-[10px] md:text-sm lg:text-sm font-bold text-orange-500 leading-tight">
            In case of emergency,<br />please contact:
          </p>
          <div>
            <p className="text-xs md:text-base lg:text-base text-gray-800 font-extrabold uppercase tracking-wide">
              {member.emergencyContact.name}
            </p>
            <p className="text-[8px] md:text-[11px] lg:text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">
              Emergency Contact
            </p>
          </div>
          <div>
            <p className="text-xs md:text-base lg:text-base text-gray-800 font-extrabold ">
              {member.emergencyContact.number}
            </p>
            <p className="text-[8px] md:text-[11px] lg:text-[11px] uppercase text-gray-400 tracking-widest mt-0.5">
              Contact Number
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div
      className="grid gap-0.5 w-20 h-20 md:w-36 md:h-36 lg:w-36 lg:h-36"
      style={{ gridTemplateColumns: "repeat(9, 1fr)" }}
    >
      {pattern.flat().map((cell, i) => (
        <div key={i} className={`rounded-[1px] ${cell ? "bg-gray-900" : "bg-white"}`} />
      ))}
    </div>
  );
}