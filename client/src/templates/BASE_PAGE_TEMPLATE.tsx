/**
 * BASE PAGE TEMPLATE
 * 
 * Copy this file to src/pages/YourPageName.tsx
 * Register route in src/App.tsx
 * 
 * Uses globals.css utilities:
 * - .section-container: max-width (1700px) + centering
 * - .section-padding-md: responsive padding (vertical + horizontal)
 * - .section-padding-lg: for larger hero sections
 */

import { Footer } from "@/components/ui/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content - flex-1 pushes footer to bottom */}
      <main className="flex-1 w-full">
        <div className="section-container section-padding-md">

          {/* PAGE HEADER */}
          <header className="mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3">
              Page Title
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Page description
            </p>
          </header>

          {/* CONTENT GRID - Responsive: 1 col (mobile) → 2 cols (md) → 3 cols (lg) */}
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Card 1</CardTitle>
                  <CardDescription>Description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Content here</p>
                  <Button className="w-full">Action</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card 2</CardTitle>
                  <CardDescription>Description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Content here</p>
                  <Button variant="outline" className="w-full">Action</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card 3</CardTitle>
                  <CardDescription>Description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Content here</p>
                  <Button variant="secondary" className="w-full">Action</Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FULL-WIDTH SECTION */}
          <section>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Section Title</h2>
            <Card>
              <CardHeader>
                <CardTitle>Full Width Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Your content here</p>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>

      {/* Footer - automatically sticks to bottom */}
      <Footer />
    </div>
  )
}
