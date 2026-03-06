import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
}

// static content for sec 2
const WHAT_WE_DO: WhatWeDoItem[] = [
  {
    title: "Events that actually teach you something",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Workshops, talks, and hands-on sessions",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Building community through collaboration",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
]

// team data grouped by department
const TEAMS: Record<
  string,
  {
    label: string
    members: TeamMember[]
  }
> = {
  executive: {
    label: "Executive",
    members: [
      { name: "Juliane Nicole Caballes", role: "VP for Community Development" },
      { name: "John Doe", role: "President" },
      { name: "Jane Doe", role: "Vice President" },
      { name: "Maria Santos", role: "Secretary" },
      { name: "Carlos Reyes", role: "Treasurer" },
    ],
  },
  technology: {
    label: "Technology",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
  community: {
    label: "Community Development",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
  communications: {
    label: "Communications",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
  finance: {
    label: "Finance",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
  operations: {
    label: "Operations",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
  partners: {
    label: "Strategic Partnerships",
    members: [{ name: "(Name)", role: "(Role)" }],
  },
}

// component for rendering a team member card
function TeamMemberCard({ name, role }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden rounded-none border border-slate-300 bg-white shadow-none">
      <div className="border-b border-slate-200">
        <div className="aspect-[4/5] w-full bg-slate-200" />
      </div>

      <CardContent className="space-y-3 py-5 text-center">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-tight">{name}</h3>
          <p className="text-sm text-gray-600">{role}</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full border border-slate-300">
            <span className="text-[10px] font-medium text-slate-500">Icon</span>
          </div>
          <div className="grid h-8 w-8 place-items-center rounded-full border border-slate-300">
            <span className="text-[10px] font-medium text-slate-500">Icon</span>
          </div>
          <div className="grid h-8 w-8 place-items-center rounded-full border border-slate-300">
            <span className="text-[10px] font-medium text-slate-500">Icon</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// grid wrapper 
function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
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

  return (
    <div className="min-h-screen w-screen font-sans">
      {/* section 1 - vision and mission */}
      <section className="w-full py-20">
        <div className="mx-auto w-full max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="rounded-none border border-slate-300 bg-white shadow-none">
              <CardHeader>
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
          <h1 className="text-4xl font-extrabold">
            <span className="text-sky-500">WHAT WE DO</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div className="mx-auto mt-10 w-full max-w-4xl space-y-8 text-left">
            {WHAT_WE_DO.map((item) => (
              <Card
                key={item.title}
                className="rounded-none border border-slate-300 bg-white shadow-none"
              >
                <CardContent className="pt-6">
                  <h2 className="mb-2 text-lg font-bold">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* section 3 - team tabs*/}
      <section className="w-full py-16">
        <div className="mx-auto w-full max-w-5xl px-4 text-center">
          <Tabs defaultValue={teamKeys[0]} className="w-full items-center">
            <TabsList className="mx-auto justify-center">
              {teamKeys.map((key) => (
                <TabsTrigger key={key} value={key}>
                  {TEAMS[key].label}
                </TabsTrigger>
              ))}
            </TabsList>

            {teamKeys.map((key) => (
              <TabsContent key={key} value={key} className="mt-8">
                <TeamGrid members={TEAMS[key].members} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  )
}