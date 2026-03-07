import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Asterisk } from "lucide-react"
import { useState } from "react"
import bulbBg from "@/assets/about-bg-bulb.svg"
import targetBg from "@/assets/about-bg-target.svg"
import WWD1 from "@/assets/wwd1.svg"
import WWD2 from "@/assets/wwd2.svg"
import WWD3 from "@/assets/wwd3.svg"
import WWD4 from "@/assets/wwd4.svg"
import WWD5 from "@/assets/wwd5.svg"
import WWD6 from "@/assets/wwd6.svg"
import WWD7 from "@/assets/wwd7.svg"

// team data types
type TeamMember = {
  name: string
  role: string
}

// props for the member card
type TeamMemberCardProps = TeamMember

// what we do items
type WhatWeDoItem = {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  align: "left" | "right"
}

// static content for sec 2
const WHAT_WE_DO: WhatWeDoItem[] = [
  {
    title: "Events that actually teach you something",
    description:
      "We organize workshops, bootcamps, and hackathons that don't feel like boring lectures. We bring in real tools, real topics, and real challenges — so you leave with something you can actually use.",
    imageSrc: WWD1,
    imageAlt: "Events",
    align: "left",
  },
  {
    title: "Mentorship that doesn't feel intimidating",
    description:
      "Need he's figuring things out? We've got mentors, peers, and teammates who ve been where you are. We're building support systems that feel more like friendships than formalities.",
    imageSrc: WWD2,
    imageAlt: "Mentorship",
    align: "right",
  },
  {
    title: "Partners who bring more to the table",
    description:
      "We collaborate with orgs, companies, and schools that believe in students like us. The goal? More opportunities, more resources, and fewer dead ends.",
    imageSrc: WWD3,
    imageAlt: "Partnerships",
    align: "left",
  },
  {
    title: "A space where everyone gets to grow",
    description:
      "We work hard to make MSC - NU Laguna inclusive. You don't have to be a tech expert to join - you just need to be curious, open to learning, and ready to try.",
    imageSrc: WWD4,
    imageAlt: "Inclusive growth",
    align: "right",
  },
  {
    title: "Certifications and credentials? Let's get them",
    description:
      "Whether it's Microsoft Learn or something you've been eyeing on Linkedin, we help you find ways to get certified - and actually understand what you're doing.",
    imageSrc: WWD5,
    imageAlt: "Certifications",
    align: "left",
  },
  {
    title: "Projects that don't rot in your hard drive",
    description:
      "Got an idea that could help your community, solve a problem, or just make school life better? Let's build it. We support project-making that's more than just for class.",
    imageSrc: WWD6,
    imageAlt: "Projects",
    align: "right",
  },
  {
    title: "A mission bigger than us",
    description:
      "Everything we do connects to Microsoft's mission to empower people and organizations to achieve more. It sounds big - because it is. But we believe we can contribute, even as students.",
    imageSrc: WWD7,
    imageAlt: "Mission",
    align: "left",
  },
]

function WhatWeDoCard({
  index,
  item,
}: {
  index: number
  item: WhatWeDoItem
}) {
  const number = index + 1
  const isRightAligned = item.align === "right"

  const badge = (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
      {number}
    </div>
  )

  const icon = (
    <img
      src={item.imageSrc}
      alt={item.imageAlt}
      className="h-12 w-12 shrink-0 object-contain"
      loading="lazy"
      decoding="async"
    />
  )

  const text = (
    <div className={`space-y-2 ${isRightAligned ? "flex-1 text-right" : ""}`}>
      <h2 className="text-lg font-bold leading-snug">{item.title}</h2>
      <p className="text-sm leading-relaxed text-gray-600">
        {item.description}
      </p>
    </div>
  )

  return (
    <Card className="rounded-none border border-slate-300 bg-white shadow-none">
      <CardContent className="p-6">
        <div className="flex w-full items-center gap-4 sm:gap-6">
          {isRightAligned ? (
            <>
              {text}
              {icon}
              {badge}
            </>
          ) : (
            <>
              {badge}
              {icon}
              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-bold leading-snug">{item.title}</h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// team data grouped by department
const TEAMS: Record<
  string,
  {
    label: string
    description: string
    members: TeamMember[]
  }
> = {
  executive: {
    label: "Executive",
    description:
      "The Executive team oversees the organization’s direction, planning, and overall coordination of MSC – NU Laguna.",
    members: [
      { name: "Juliane Nicole Caballes", role: "VP for Community Development" },
      { name: "John Doe", role: "President" },
      { name: "John Doe", role: "Vice President" },
      { name: "John Doe", role: "Secretary" },
      { name: "John Doe", role: "Treasurer" },
      { name: "John Doe", role: "President" },
      { name: "John Doe", role: "Vice President" },
      { name: "John Doe", role: "Treasurer" },
    ],
  },
  technology: {
    label: "Technology",
    description:
      "The Technology team builds and maintains tools, supports events, and helps members grow through hands-on technical work.",
    members: [
      { name: "Juliane Nicole Caballes", role: "VP for Community Development" },
      { name: "(Name)", role: "(Role)" },
      { name: "(Name)", role: "(Role)" },
      { name: "(Name)", role: "(Role)" },
    ],
  },
  community: {
    label: "Community Development",
    description:
      "The Community Development team strengthens member engagement, runs initiatives, and builds a supportive learning environment.",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
  communications: {
    label: "Communications",
    description:
      "The Communications team manages announcements, creative assets, and messaging to keep everyone informed and connected.",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
  finance: {
    label: "Finance",
    description:
      "The Finance team handles budgeting, documentation, and financial planning to support organization activities.",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
  operations: {
    label: "Operations",
    description:
      "The Operations team manages logistics, coordination, and execution to ensure events and initiatives run smoothly.",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
  partners: {
    label: "Strategic Partnerships",
    description:
      "The Strategic Partnerships team collaborates with partners and sponsors to create opportunities, resources, and impactful events.",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
}

// component for rendering a team member card
function TeamMemberCard({ name, role }: TeamMemberCardProps) {
  return (
    <Card className="w-full overflow-hidden rounded-none border border-slate-300 bg-white shadow-none gap-0 py-0">      <div className="border-b border-slate-200">
        <div className="flex aspect-square w-full items-center justify-center bg-slate-200">
          <span className="text-xs font-medium text-slate-500">Photo</span>
        </div>
      </div>

      <CardContent className="px-4 py-4 text-center">
        <h3 className="text-base font-semibold leading-tight">{name}</h3>
        <p className="mt-1 text-sm text-gray-600">{role}</p>

        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="grid h-7 w-7 place-items-center rounded-full border border-slate-300" />
          <div className="grid h-7 w-7 place-items-center rounded-full border border-slate-300" />
          <div className="grid h-7 w-7 place-items-center rounded-full border border-slate-300" />
        </div>
      </CardContent>
    </Card>
  )
}

// grid wrapper 
function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 content-start sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {members.map((member) => (
        <TeamMemberCard
          key={`${member.name}-${member.role}`}
          name={member.name}
          role={member.role}
        />
      ))}
    </div>
  )
}

// main about page  
export default function AboutPage() {
  const teamKeys = Object.keys(TEAMS)
  const [activeTeam, setActiveTeam] = useState(teamKeys[0] ?? "")
  const activeTeamData = TEAMS[activeTeam] ?? TEAMS[teamKeys[0]]

  return (
    <div className="min-h-[70vh] w-screen pb-24 font-sans">
      {/* section 1 - vision and mission */}
      <section className="relative w-full overflow-hidden py-20">
        <img
          src={bulbBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 -top-10 z-0 w-[180px] md:w-[260px] lg:w-[320px]"
        />

        <img
          src={targetBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 -bottom-10 z-0 w-[180px] md:w-[260px] lg:w-[320px]"
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="rounded-none border border-slate-300 bg-white shadow-none">
              <CardHeader>
                <Asterisk aria-hidden="true" className="h-7 w-7 text-sky-500" />
                <CardTitle className="text-lg font-bold">VISION</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-gray-600">
                  The organization envisions a community where students are
                  empowered with technical knowledge, equipped with
                  problem-solving skills, and driven to use technology as a tool
                  for learning, innovation, and social good.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none border border-slate-300 bg-white shadow-none">
              <CardHeader>
                <Asterisk aria-hidden="true" className="h-7 w-7 text-sky-500" />
                <CardTitle className="text-lg font-bold">MISSION</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-gray-600">
                  The mission of MSC – NU Laguna is to provide a platform for
                  students to learn, grow, and connect with others who share an
                  interest in technology. The organization aims to support
                  personal, academic, and professional development through
                  hands-on learning, networking opportunities, and skill-building
                  activities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* section 2 - what we do */}
      <section className="w-full bg-slate-50 py-16">
        <div className="mx-auto w-full max-w-5xl px-4 text-center">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,#00A2ED_0%,#6AAC0E_33%,#FEA60F_66%,#F04E1F_100%)]">
            WHO WE ARE
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div className="mx-auto mt-10 w-full max-w-4xl space-y-5 text-left">
            {WHAT_WE_DO.map((item, index) => (
              <WhatWeDoCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* section 3 - team tabs*/}
      <section className="w-full py-16">
        <div className="mx-auto w-full max-w-7xl px-4 text-center">
          <h1 className="pb-8 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,#00A2ED_0%,#6AAC0E_33%,#FEA60F_66%,#F04E1F_100%)]">
            MEET THE TEAM
          </h1>
          <Tabs
            value={activeTeam}
            onValueChange={setActiveTeam}
            className="w-full items-center"
          >
            <TabsList className="mx-auto justify-center">
              {teamKeys.map((key) => (
                <TabsTrigger key={key} value={key}>
                  {TEAMS[key].label}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeTeamData?.description ? (
              <div className="mx-auto mt-4 flex min-h-[52px] max-w-3xl items-center justify-center">
                <p className="text-sm leading-relaxed text-gray-600">
                  {activeTeamData.description}
                </p>
              </div>
            ) : null}

            {teamKeys.map((key) => (
                <TabsContent
                  key={key}
                  value={key}
                  className="mt-8 min-h-[560px] sm:min-h-[620px] lg:min-h-[680px]"
                >
                <TeamGrid members={TEAMS[key].members} />

                <div className="mt-10 flex justify-center">
                  <div className="inline-block text-left leading-none">
                    <p className="text-xl font-extrabold">THE</p>
                    <p className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-[linear-gradient(90deg,#00A2ED_0%,#6AAC0E_33%,#FEA60F_66%,#F04E1F_100%)] sm:text-6xl md:text-7xl">
                      {(TEAMS[key].label ?? "").toUpperCase()}
                    </p>
                    <p className="mt-1 text-right text-xl font-extrabold tracking-wide">
                      DEPARTMENT
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  )
}