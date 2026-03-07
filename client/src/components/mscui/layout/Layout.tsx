'use client'

import mscLogo from '@/assets/logos/msclogo.svg'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/**
 * Layout Component
 * ================
 * Provides consistent layout structure for all pages.
 *
 * Features:
 * - Navbar at top (sticky)
 * - Flexible main content area
 * - Footer at bottom (sticky to viewport if short content)
 * - Full-height page layout
 *
 * IMPORTANT:
 * This component is optional. You can use it for consistency,
 * but the Navbar is already rendered globally in layout.tsx.
 *
 * USAGE:
 * <Layout>
 *   <YourContent />
 * </Layout>
 *
 * OR embed Navbar/Footer individually as needed.
 */

interface LayoutProps {
  /**
   * Page content to render between navbar and footer
   */
  children: React.ReactNode

  /**
   * Logo source path (passed to Navbar)
   */
  logoSrc?: string

  /**
   * Logo alt text (passed to Navbar)
   */
  logoAlt?: string

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
  logoSrc = mscLogo,
  logoAlt = 'Logo',
  hideFooter = false,
  className = '',
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR - Sticky header at top */}
      <Navbar logoSrc={logoSrc} logoAlt={logoAlt} />

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
