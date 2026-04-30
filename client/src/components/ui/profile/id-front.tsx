import { Badge } from "@/components/ui/badge";

import mscLogoUrl from "@/assets/logos/msclogo.svg";

import type { Member } from "@/types/member";



interface IDCardFrontProps {

  member: Member;

}



const tierColors: Record<Member["tier"], string> = {

  General: "bg-green-500 text-white",

  Officer: "bg-[#00A2ED] text-white",

  Core: "bg-orange-500 text-white",

  Executive: "bg-red-500 text-white",

};



export default function IDCardFront({ member }: IDCardFrontProps) {

  const tierClass = tierColors[member.tier] ?? "bg-gray-500 text-white";



  const fields: { label: string; value: string }[] = [

    { label: "Member ID", value: member.memberId },

    { label: "Program", value: member.program },

    { label: "Year", value: member.year },

  ];



  return (

    <div className="relative w-full h-full overflow-hidden border select-none">

      <div className="relative z-10 flex flex-col h-full px-6 pt-4 pb-5">

        {/* Background Gradient Blobs */}

        <svg 

          className="absolute inset-0 w-full h-full z-0 pointer-events-none" 

          preserveAspectRatio="none" 

          viewBox="0 0 400 250" 

          xmlns="http://www.w3.org/2000/svg"

        >

          <defs>

            {/* Top Right Gradient (Yellow to Orange) */}

            <linearGradient id="blobTopRight" x1="0%" y1="0%" x2="100%" y2="100%">

              <stop offset="0%" stopColor="#FFBB00" />

              <stop offset="100%" stopColor="#F04E1F" />

            </linearGradient>

            

            {/* Bottom Blue Gradient */}

            <linearGradient id="blobBottomBlue" x1="0%" y1="0%" x2="100%" y2="100%">

              <stop offset="0%" stopColor="#2AB6F5" />

              <stop offset="100%" stopColor="#0B91DF" />

            </linearGradient>

          </defs>



          {/* Top Right Orange Corner*/}

          <path d="M 130 0 Q 375 0 400 70 L 400 0 Z" fill="url(#blobTopRight)" />



          {/* Bottom Blue Swoosh */}

          <path d="M 0 200 C 80 250 250 250 300 250 L 0 250 Z" fill="url(#blobBottomBlue)" />

        </svg>



        {/* Logo */}

        <div className="flex items-center gap-2 mb-2 md:mb-8 lg:mb-8">

          <div className="w-11 h-11">

            <img src={mscLogoUrl} alt="logo" className="w-full h-full" />

          </div>

          <div className="leading-tight">

            <p className="text-[10px] md:text-base lg:text-base font-extrabold uppercase tracking-wide">Microsoft Student</p>

            <p className="text-[10px] md:text-base lg:text-base font-extrabold uppercase tracking-wide">Community</p>

            <p className="text-[10px] md:text-base lg:text-base">NU Laguna</p>

          </div>

        </div>



        {/* Photo + info */}

        <div className="flex gap-5 flex-1 items-start">

          <div className="shrink-0 z-20 w-25 h-25 md:w-45 md:h-45 lg:w-45 lg:h-45 overflow-hidden border-2 border-brand-blue/60">

            <img src={member.photo} alt={member.fullName} className="w-full h-full object-cover object-top" />

          </div>



          <div className="flex-1 min-w-0">

            <h2 className="text-base md:text-2xl lg:text-2xl text-(--color-brand-blue) font-extrabold leading-tight mb-1 uppercase">

              {member.lastName}, {member.firstName}

            </h2>



            <div className="flex flex-col gap-0.5">

              {fields.map(({ label, value }, i) => (

                <div key={label}>

                  <div className="flex justify-between items-center py-0.5 md:py-2 lg:py-2">

                    <span className="text-[8px] md:text-sm lg:text-sm font-bold uppercase tracking-wide">{label}</span>

                    <span className="text-[8px] md:text-sm lg:text-sm text-right">{value}</span>

                  </div>

                  {i < fields.length - 1 && <hr className="" />}

                </div>

              ))}



              <hr className="" />

              <div className="flex justify-between items-center py-0.5 md:gap-1 lg:gap-1">

                <span className="text-[8px] md:text-sm lg:text-sm font-bold uppercase tracking-wide">Tier</span>

                <Badge className={`text-[8px] md:text-sm lg:text-sm px-3 py-0.5 rounded-none font-semibold ${tierClass}`}>

                  {member.tier}

                </Badge>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}