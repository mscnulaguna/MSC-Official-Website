import { useState } from 'react'
import Layout from '@/components/mscui/layout/Layout'

import { Button } from '@/components/mscui/button'
import { Badge } from '@/components/mscui/badge'
import { Input } from '@/components/mscui/input'
import { Checkbox } from '@/components/mscui/checkbox'
import { Toggle } from '@/components/mscui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/mscui/tooltip'
import { Progress } from '@/components/mscui/progress'
import { SpinnerWithText } from '@/components/mscui/spinner'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/mscui/card'
import {
  AlertTitle,
  AlertDescription,
  AlertInfo,
  AlertSuccess,
  AlertWarning,
  AlertDestructive,
} from '@/components/mscui/msc-alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/mscui/msc-tabs'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/mscui/msc-table'
import { Textarea } from '@/components/mscui/msc-textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/mscui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/mscui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/mscui/drawer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/mscui/accordion'
import { EmptyState, EmptyStateContainer } from '@/components/mscui/empty-state'
import { Combobox } from '@/components/mscui/combobox'
import { CarouselRow } from '@/components/mscui/carousel'
// AspectRatio is used via the reusable AspectRatioPreset component
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarNavItem,
} from '@/components/mscui/sidebar'
import { InputGroup, InputGroupContent, InputGroupPrefix, InputGroupSuffix } from '@/components/mscui/input-group'
import { KBD } from '@/components/mscui/kbd'
import { Separator } from '@/components/mscui/separator'
import { Item, ItemAction, ItemContent, ItemDescription, ItemIcon, ItemLabel } from '@/components/mscui/item'
import { Calendar } from '@/components/mscui/calendar'
import {
  AlertDialogBasic,
  EventHoverCard,
  AspectRatioPreset,
  InputWithButton,
  SignInDialog,
  DatePicker,
  AvatarCircle,
  GreenAlertBox,
} from '@/components/mscui/custom'
import { Toaster } from '@/components/mscui/sonner'
import { Search } from 'lucide-react'
import { toast } from 'sonner'

export default function App() {
  const [toggleState, setToggleState] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')

  return (
    <>
      <Layout className="bg-background">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
          <div className="mx-auto max-w-[1700px] px-4 sm:px-8 md:px-12 py-12">
            {/* Page Title */}
            <header className="mb-12">
              <h1 className="heading-h1 mb-4">Component Showcase</h1>
              <p className="body-text text-muted-foreground max-w-2xl">
                A complete demonstration of all available components in the MSC Design System.
              </p>
            </header>

            {/* ===== SECTION 1: BUTTONS ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Buttons</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="heading-h4">Button Variants</CardTitle>
                  <CardDescription>All button styles and sizes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="body-small text-muted-foreground font-medium uppercase tracking-wide">
                        Variants
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="body-small text-muted-foreground font-medium uppercase tracking-wide">
                        Sizes
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon" aria-label="Icon button">
                          ?
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="body-small text-muted-foreground font-medium uppercase tracking-wide">
                        Usage
                      </p>
                      <p className="body-small text-muted-foreground max-w-xl">
                        Use the primary variant for main actions, secondary for supporting actions, and outline
                        or ghost for less prominent actions. Destructive is reserved for irreversible operations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION 2: FORMS ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Form Elements</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="heading-h4">Input Fields & Controls</CardTitle>
                  <CardDescription>Text inputs, checkboxes, toggles, and textarea</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <label className="body-small font-medium text-foreground">Email address</label>
                      <Input placeholder="name@example.com" />
                    </div>

                    <div className="space-y-2">
                      <label className="body-small font-medium text-foreground">Feedback</label>
                      <Textarea rows={4} placeholder="Share your thoughts about MSC events…" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox id="updates" />
                      <label htmlFor="updates" className="body-small text-muted-foreground">
                        Receive email updates
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <Toggle
                        pressed={toggleState}
                        onPressedChange={setToggleState}
                        aria-label="Toggle feature"
                      >
                        Toggle feature
                      </Toggle>
                      <span className="body-small text-muted-foreground">
                        {toggleState ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION 3: CARDS ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Default Card</CardTitle>
                    <CardDescription>Use for simple content blocks.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="body-small text-muted-foreground">
                      Cards are boxed containers for grouping related information.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">With Actions</CardTitle>
                    <CardDescription>Card with footer actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="body-small text-muted-foreground">
                      Place buttons in the footer area to keep actions consistent.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm">Primary</Button>
                      <Button size="sm" variant="outline">Secondary</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Status Card</CardTitle>
                    <CardDescription>Combining badges and text.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge>Active</Badge>
                    <p className="body-small text-muted-foreground">
                      Use badges inside cards to highlight state.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ===== SECTION 4: TABS & ACCORDION ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Tabs & Accordion</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Tabs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="mt-4 body-small text-muted-foreground">
                        Use tabs to switch between related content areas without leaving the page.
                      </TabsContent>
                      <TabsContent value="details" className="mt-4 body-small text-muted-foreground">
                        Tabs should have concise labels and consistent widths.
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Accordion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>What is MSC?</AccordionTrigger>
                        <AccordionContent>
                          MSC is the official organization for computing students at NU Laguna.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How do I join?</AccordionTrigger>
                        <AccordionContent>
                          Look out for recruitment announcements or contact an officer.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ===== SECTION 5: DIALOGS & DRAWERS ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Dialogs & Modals</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="heading-h4">Dialog Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <AlertDialogBasic />

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Open dialog</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Example dialog</DialogTitle>
                        </DialogHeader>
                        <p className="body-small text-muted-foreground">
                          Use dialogs for focused tasks or confirmations.
                        </p>
                      </DialogContent>
                    </Dialog>

                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline">Open drawer</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Example drawer</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 body-small text-muted-foreground">
                          Use drawers for navigation or filters on smaller screens.
                        </div>
                      </DrawerContent>
                    </Drawer>

                    <SignInDialog />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION 6: STATUS & FEEDBACK ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Status & Feedback</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Badges</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="info">Info</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Progress & Loading</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={40} />
                    <SpinnerWithText text="Loading dashboard…" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <AlertInfo>
                      <AlertTitle>Information</AlertTitle>
                      <AlertDescription>General system message.</AlertDescription>
                    </AlertInfo>
                    <AlertSuccess>
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>Operation completed successfully.</AlertDescription>
                    </AlertSuccess>
                    <AlertWarning>
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>Check your input before continuing.</AlertDescription>
                    </AlertWarning>
                    <AlertDestructive>
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>Something went wrong. Please try again.</AlertDescription>
                    </AlertDestructive>
                    <GreenAlertBox className="mt-2" title="Green success" description="Reusable green alert box for confirmations." />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ===== SECTION 7: AVATAR & TOOLTIP ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Avatar & Tooltip</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Avatar</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <AvatarCircle
                      src="https://api.dicebear.com/7.x/initials/svg?seed=MSC"
                      name="MSC Member"
                    />
                    <div>
                      <p className="font-semibold">MSC Member</p>
                      <p className="body-small text-muted-foreground">Organization profile</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Tooltip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline">Hover me</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          MSC tooltips explain controls without cluttering layouts.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ===== SECTION 8: INTERACTIVE CONTROLS ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Interactive Controls</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="heading-h4">Select & Combobox</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="body-small text-muted-foreground font-medium uppercase tracking-wide">
                      Select
                    </p>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All tracks</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="org">Organization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <p className="body-small text-muted-foreground font-medium uppercase tracking-wide">
                      Combobox
                    </p>
                    <Combobox
                      options={[
                        { label: 'React', value: 'react' },
                        { label: 'TypeScript', value: 'typescript' },
                        { label: 'Vite', value: 'vite' },
                        { label: 'Tailwind CSS', value: 'tailwind' },
                      ]}
                      value={selectedOption}
                      onValueChange={setSelectedOption}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* ===== Typography Section ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Typography System</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="body-small font-semibold mb-1">Headings</p>
                    <p className="heading-h1">heading-h1</p>
                    <p className="heading-h2">heading-h2</p>
                    <p className="heading-h3">heading-h3</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="body-small font-semibold mb-1">Body text</p>
                    <p className="body-text">body-text</p>
                    <p className="body-small">body-small</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION: SEPARATOR ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Separator</h2>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <p className="body-small text-muted-foreground font-medium uppercase tracking-wide">
                      Horizontal
                    </p>
                    <Separator />
                  </div>
                  <div className="space-y-2">
                    <p className="body-small text-muted-foreground font-medium uppercase tracking-wide">
                      Vertical
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="body-small">Item A</span>
                      <Separator orientation="vertical" className="h-6" />
                      <span className="body-small">Item B</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION: CALENDAR ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Calendar</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Inline Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar mode="single" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Date Picker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DatePicker
                      label="Date picker with button"
                      buttonLabel="Pick a date"
                    />
                    <p className="body-small text-muted-foreground mt-3">
                      This reusable date picker shows a button first and then opens the calendar in a popover.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ===== SECTION: DATA TABLE ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Data Table</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="heading-h4">Basic Table</CardTitle>
                  <CardDescription>Use for simple tabular data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Program</TableHead>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Juan Dela Cruz</TableCell>
                        <TableCell>President</TableCell>
                        <TableCell>BSIT</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maria Santos</TableCell>
                        <TableCell>Vice President</TableCell>
                        <TableCell>BSCS</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableCaption>Simple roster layout using MSC table.</TableCaption>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION: EMPTY STATES ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Empty States</h2>
              <EmptyStateContainer>
                <EmptyState
                  title="No Data Found"
                  description="There are no items to display. Try adjusting your search or adding new items."
                  action={<Button>Add Item</Button>}
                />
              </EmptyStateContainer>
            </section>

            {/* ===== SECTION: LIST ITEMS ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">List Items</h2>
              <Card>
                <CardContent className="p-0">
                  <Item>
                    <ItemIcon>
                      <Badge>NEW</Badge>
                    </ItemIcon>
                    <ItemContent>
                      <ItemLabel>New Announcement</ItemLabel>
                      <ItemDescription>Latest update from MSC officers.</ItemDescription>
                    </ItemContent>
                    <ItemAction>
                      <Button size="sm" variant="outline">View</Button>
                    </ItemAction>
                  </Item>
                  <Item>
                    <ItemIcon>
                      <Badge variant="secondary">EVENT</Badge>
                    </ItemIcon>
                    <ItemContent>
                      <ItemLabel>General Assembly</ItemLabel>
                      <ItemDescription>All members are invited to join.</ItemDescription>
                    </ItemContent>
                    <ItemAction>
                      <Button size="sm" variant="outline">Details</Button>
                    </ItemAction>
                  </Item>
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION: CAROUSEL ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Event Carousel (1:1, 4 per row)</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="heading-h4">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <CarouselRow className="mt-2">
                    <EventHoverCard
                      title="General Assembly 2026"
                      date="August 24, 2026"
                      tag="Assembly"
                      description="Kick-off the academic year with updates, officer introductions, and org plans."
                    />
                    <EventHoverCard
                      title="Tech Summit"
                      date="October 12, 2026"
                      tag="Conference"
                      description="Talks and workshops on modern web, cloud, and AI for MSC members."
                    />
                    <EventHoverCard
                      title="Coding Bootcamp"
                      date="September 3, 2026"
                      tag="Workshop"
                      description="Hands-on sessions for beginners to learn React, TypeScript, and Git."
                    />
                    <EventHoverCard
                      title="Community Outreach"
                      date="November 5, 2026"
                      tag="Outreach"
                      description="MSC volunteers teach basic digital skills to local high school students."
                    />
                  </CarouselRow>
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION: ASPECT RATIO ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Aspect Ratio</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent>
                    <AspectRatioPreset
                      ratio={16 / 9}
                      label="16:9 banner"
                      sizeHint="e.g. 1280×720"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <AspectRatioPreset
                      ratio={4 / 3}
                      label="4:3 preview"
                      sizeHint="e.g. 800×600"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <AspectRatioPreset
                      ratio={1 / 1}
                      label="1:1 avatar"
                      sizeHint="e.g. 512×512"
                    />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ===== SECTION: SIDEBAR LAYOUT ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Sidebar Layout</h2>
              <Card>
                <CardContent className="p-0 flex h-64">
                  <Sidebar className="h-full w-64 border-r">
                    <SidebarHeader>
                      <p className="body-small font-semibold">Navigation</p>
                    </SidebarHeader>
                    <SidebarContent>
                      <SidebarNav>
                        <SidebarNavItem href="#">Overview</SidebarNavItem>
                        <SidebarNavItem href="#">Members</SidebarNavItem>
                        <SidebarNavItem href="#">Events</SidebarNavItem>
                      </SidebarNav>
                    </SidebarContent>
                    <SidebarFooter>
                      <p className="body-small text-muted-foreground">MSC - NU Laguna</p>
                    </SidebarFooter>
                  </Sidebar>
                  <div className="flex-1 p-6 body-small text-muted-foreground">
                    Main content area next to the sidebar.
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION: INPUT GROUP WITH KBD ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Input Group with KBD</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Search Input</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InputGroup>
                      <InputGroupPrefix>
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </InputGroupPrefix>
                      <InputGroupContent placeholder="Search components" />
                      <InputGroupSuffix>
                        <KBD>Ctrl</KBD>
                        <KBD>K</KBD>
                      </InputGroupSuffix>
                    </InputGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="heading-h4">Keyboard Hint</CardTitle>
                  </CardHeader>
                  <CardContent className="space-x-2">
                    <KBD>Ctrl</KBD>
                    <KBD>Shift</KBD>
                    <KBD>P</KBD>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ===== SECTION: INPUT WITH BUTTON ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Input with Button</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="heading-h4">Reusable Input + Button Field</CardTitle>
                </CardHeader>
                <CardContent>
                  <InputWithButton
                    label="Invite member by email"
                    placeholder="name@example.com"
                    buttonLabel="Send invite"
                    note="Use this pattern for search bars, invite fields, and short one-line forms where an action button sits beside the input."
                  />
                </CardContent>
              </Card>
            </section>

            {/* ===== SECTION: TOAST NOTIFICATIONS ===== */}
            <section className="mb-12">
              <h2 className="heading-h2 mb-6">Toast Notifications</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="heading-h4">Trigger Toasts</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button onClick={() => toast('Default toast')}>Default</Button>
                  <Button variant="secondary" onClick={() => toast.success('Success toast')}>
                    Success
                  </Button>
                  <Button variant="outline" onClick={() => toast.error('Error toast')}>
                    Error
                  </Button>
                  <Button variant="ghost" onClick={() => toast.warning('Warning toast')}>
                    Warning
                  </Button>
                </CardContent>
              </Card>
            </section>

            {/* Final CTA */}
            <section className="mb-12 text-center">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="heading-h3">Ready to build?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="body-text mb-4 max-w-2xl mx-auto">
                    Use these MSC components and patterns as the foundation for the official MSC website.
                  </p>
                  <Button size="lg">Start a new page</Button>
                </CardContent>
              </Card>
            </section>
          </div>
          </main>
        </div>
      </Layout>
      <Toaster />
    </>
  )
}