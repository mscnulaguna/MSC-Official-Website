import { Footer } from './Footer'

/**
 * Layout Component (Content Wrapper)
 * ==================================
 * Provides a consistent content structure for pages.
 * 
 * NOTE: The Navbar is rendered globally in src/layout.tsx (AppLayout).
 * This component is for wrapping page CONTENT ONLY - use it between AppLayout
 * and your page content to maintain consistent spacing and footer behavior.
 *
 * Features:
 * - Flexible main content area (grows to fill space)
 * - Footer at bottom (sticky to viewport if short content)
 * - Full-height page layout
 * - Consistent padding and max-width
 *
 * USAGE:
 * Don't use this standalone. Instead:
 *
 * export default function HomePage() {
 *   return (
 *     <Layout>
 *       <YourContent />
 *     </Layout>
 *   )
 * }
 *
 * Your root App.tsx should wrap everything with AppLayout from src/layout.tsx
 */

interface LayoutProps {
  /**
   * Page content to render
   */
  children: React.ReactNode

  /**
   * Hide the footer (default: false)
   */
  hideFooter?: boolean

  /**
   * Additional CSS classes for main container
   */
  className?: string
}

export function Layout({
  children,
  hideFooter = false,
  className = '',
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* MAIN CONTENT - Flexible grow to push footer down */}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      {/* FOOTER - Sticky to bottom if content is short */}
      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout
