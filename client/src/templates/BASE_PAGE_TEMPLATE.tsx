/**
 * BASE LAYOUT TEMPLATE FOR NEW PAGES
 *
 * This is a starter template for developers to use when creating new pages
 * in the MSC - NU Laguna Design System.
 *
 * File Location: src/app/[page-name]/page.tsx
 * Or: src/pages/[page-name].tsx
 *
 * How to use this:
 * 1. Copy this entire file
 * 2. Create a new folder: src/app/your-page-name/
 * 3. Create page.tsx and paste this template
 * 4. Replace [Page Name] with your actual page name
 * 5. Add your content after the <!-- YOUR CONTENT HERE --> section
 * 6. Keep the red debug outlines for layout verification
 * 7. Remove outlines when layout is finalized
 */

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/mscui/layout/Navbar"
import { Footer } from "@/components/mscui/layout/Footer"

/**
 * BASE PAGE LAYOUT TEMPLATE
 *
 * Includes:
 * - Responsive navigation bar (Navbar component)
 * - Main content container with max-width 1600px constraint
 * - Responsive padding and spacing
 * - Red debug outlines for layout verification
 * - Mobile-first responsive grid system
 * - Footer component at bottom
 *
 * Responsive Breakpoints:
 * - Mobile (0-640px): Single column, full width
 * - Tablet (640-1024px): 2 columns, medium spacing
 * - Desktop (1024-1400px): 3 columns, expanded layout
 * - Ultra-wide (1400px+): Constrained width, centered
 */
export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVIGATION BAR */}
      {/* Sticky header with logo and menu items */}
      <Navbar />

      {/* MAIN CONTENT WRAPPER */}
      {/* Constrains to max-width 1700px and centers content */}
      {/* To adjust: Change 1700px to 1600px, 1800px, or remove max-w for full-width */}
      {/* Navbar and Footer also have 1700px - update all three for consistency */}
      <main className="outline outline-red-500 outline-1 w-full max-w-[1700px] mx-auto flex-1">
        {/* PAGE CONTENT CONTAINER */}
        {/* Manages responsive padding and spacing */}
        <div className="outline outline-red-500 outline-1 w-full px-4 sm:px-8 md:px-12 py-8 sm:py-12">

          {/* HEADER SECTION */}
          {/* Page title and description */}
          <header className="outline outline-red-500 outline-1 mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
              [Page Title]
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              [Page description goes here]
            </p>
          </header>

          {/* MAIN CONTENT SECTION */}
          {/* Responsive grid layout */}
          <section className="outline outline-red-500 outline-1 mb-8 md:mb-12">
            {/* GRID LAYOUT */}
            {/* Adapts: 1 col (mobile) → 2 cols (md) → 3 cols (lg) */}
            <div className="outline outline-red-500 outline-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7">

              {/* CARD 1 - EXAMPLE */}
              <Card>
                <CardHeader>
                  <CardTitle>Card Title 1</CardTitle>
                  <CardDescription>Card description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your content goes here. This card is responsive and will adapt to different screen sizes.
                  </p>
                  <Button className="w-full">Action Button</Button>
                </CardContent>
              </Card>

              {/* CARD 2 - EXAMPLE */}
              <Card>
                <CardHeader>
                  <CardTitle>Card Title 2</CardTitle>
                  <CardDescription>Card description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You can customize colors, spacing, and layout to match your design system.
                  </p>
                  <Button variant="outline" className="w-full">Secondary Action</Button>
                </CardContent>
              </Card>

              {/* CARD 3 - EXAMPLE */}
              <Card>
                <CardHeader>
                  <CardTitle>Card Title 3</CardTitle>
                  <CardDescription>Card description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    All shadcn/ui components are available for use. Check the showcase for examples.
                  </p>
                  <Button variant="secondary" className="w-full">Other Action</Button>
                </CardContent>
              </Card>

            </div>
          </section>

          {/* SECONDARY CONTENT SECTION */}
          {/* Full-width content area */}
          <section className="outline outline-red-500 outline-1 mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
              Additional Content Section
            </h2>

            <Card>
              <CardHeader>
                <CardTitle>Full Width Card Example</CardTitle>
                <CardDescription>This card spans the full width</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm sm:text-base text-muted-foreground">
                  You can add as many sections as needed. Each section can have its own responsive grid layout.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <Button className="flex-1">Primary Action</Button>
                  <Button variant="outline" className="flex-1">Secondary Action</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FOOTER SECTION */}
          {/* Optional footer content */}
          <section className="outline outline-red-500 outline-1 pt-4 sm:pt-6 md:pt-8 border-t border-border">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Footer or additional information goes here.
            </p>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      {/* Footer with logo, contact info, social links, and partner button */}
      <Footer />
    </div>
  )
}

/**
 * QUICK SETUP CHECKLIST
 *
 * ✓ Copy this file
 * ✓ Replace [Page Title] with your page title
 * ✓ Replace [Page description] with your description
 * ✓ Customize card titles and content
 * ✓ Add your own sections as needed
 * ✓ Test responsiveness at different breakpoints (use DevTools)
 * ✓ Remove red debug outlines when layout is finalized
 * ✓ Build with: npm run build
 */

/**
 * RESPONSIVE CLASSES REFERENCE
 *
 * WIDTH & PADDING:
 * w-full ......................... 100% width
 * max-w-[1400px] ................ Constrains to 1400px max
 * mx-auto ....................... Centers horizontally
 * px-4 sm:px-6 md:px-8 ......... Responsive horizontal padding
 * py-6 sm:py-8 md:py-10 ....... Responsive vertical padding
 *
 * GRID LAYOUT:
 * grid ........................... Activates CSS Grid
 * grid-cols-1 ................... 1 column (mobile default)
 * md:grid-cols-2 ............... 2 columns at 768px+
 * lg:grid-cols-3 ............... 3 columns at 1024px+
 * gap-4 sm:gap-5 md:gap-6 ..... Responsive gap spacing
 *
 * FLEXBOX LAYOUT:
 * flex .......................... Activates Flexbox
 * flex-col ...................... Stack vertically (mobile)
 * sm:flex-row ................... Arrange horizontally at 640px+
 * gap-2 sm:gap-3 .............. Responsive flex gap
 * w-full sm:flex-1 ............. Full width → equal share
 *
 * TYPOGRAPHY:
 * text-2xl sm:text-3xl md:text-4xl ... Responsive font sizes
 * font-bold ....................... Font weight
 *
 * SPACING:
 * mb-8 md:mb-12 ................. Responsive margin bottom
 * space-y-4 ..................... Vertical spacing between children
 *
 * BORDERS:
 * border-t ...................... Border top
 * border-border ................. Uses theme border color
 *
 * RESPONSIVE BREAKPOINTS:
 * Default (0px) ................. Mobile styles
 * sm: (640px) ................... Small tablets
 * md: (768px) ................... Tablets
 * lg: (1024px) .................. Laptops
 * xl: (1280px) .................. Desktops
 * 2xl: (1536px) ................. Large monitors
 */

/**
 * IMPORTING SHADCN/UI COMPONENTS
 *
 * Available components in your project:
 * - Accordion
 * - Alert
 * - Avatar
 * - Badge
 * - Button (already imported)
 * - Card (already imported)
 * - Checkbox
 * - Dialog
 * - Input
 * - Label
 * - Progress
 * - Select
 * - Separator
 * - Spinner
 * - Tabs
 * - Textarea
 * - Toggle
 * - Tooltip
 *
 * Import example:
 * import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
 * import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
 * import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
 *
 * Then use in your JSX:
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Is it accessible?</AccordionTrigger>
 *     <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 */

/**
 * CUSTOMIZATION TIPS
 *
 * 1. CHANGE MAX WIDTH:
 *    Current: max-w-[1600px]
 *    Change to: max-w-[1400px] (more compact)
 *              max-w-[1200px] (even more compact)
 *              max-w-full (no constraint)
 *
 * 2. CHANGE PADDING:
 *    Find: px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
 *    Change to: px-6 sm:px-8 md:px-10 (more padding)
 *              px-3 sm:px-4 md:px-6 (less padding)
 *
 * 3. CHANGE GRID COLUMNS:
 *    Find: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
 *    Change to: grid-cols-1 md:grid-cols-3 (2 cols at md)
 *              grid-cols-1 md:grid-cols-2 lg:grid-cols-4 (4 cols at lg)
 *
 * 4. CHANGE SPACING:
 *    Find: gap-4 sm:gap-5 md:gap-6 lg:gap-7
 *    Change to: gap-3 sm:gap-4 md:gap-5 (tighter)
 *              gap-5 sm:gap-6 md:gap-7 (looser)
 *
 * 5. REMOVE DEBUG OUTLINES:
 *    Find: outline outline-red-500 outline-1
 *    Replace with: outline-none
 *    Or use Find & Replace All
 */

/**
 * TESTING CHECKLIST
 *
 * Mobile (320px):
 * ☐ Layout is single column
 * ☐ Content is readable
 * ☐ Buttons are tap-friendly (44px+)
 * ☐ No horizontal scrolling
 *
 * Tablet (768px):
 * ☐ 2-column layout visible
 * ☐ Cards arrange in pairs
 * ☐ Spacing is balanced
 *
 * Desktop (1024px):
 * ☐ 3-column layout visible
 * ☐ Full layout displayed
 * ☐ Sidebar visible (if applicable)
 *
 * Ultra-Wide (1920px):
 * ☐ Width constrained at 1600px
 * ☐ Content centered
 * ☐ Equal margins on sides
 *
 * General:
 * ☐ Red outlines show layout structure clearly
 * ☐ Text is readable at all sizes
 * ☐ Colors contrast properly
 * ☐ Buttons work on click/tap
 * ☐ Responsive without horizontal scroll
 */
