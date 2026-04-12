import mscLogo from '@/assets/logos/msclogo.svg'
import { NavbarLeft } from './NavbarLeft'
import { NavbarCenter } from './NavbarCenter'
import { NavbarRight } from './NavbarRight'
import { MobileNavDrawer } from './MobileNavDrawer'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useState } from 'react'


  /*** Logo source path (default: MSC logo asset)*/
  /*** Logo alt text (default: 'Logo')*/
  /*** Additional CSS classes for navbar container*/
interface NavbarProps {
  logoSrc?: string
  logoAlt?: string
  className?: string
}


/**
 * ============================================================================
 * SUB-COMPONENTS REFERENCE
 * ============================================================================
 *
 * NavbarLeft.tsx    → Logo and branding
 * NavbarCenter.tsx  → Desktop navigation menu (reads from NAV_ITEMS)
 * NavbarRight.tsx   → Search, theme toggle, sign-in button
 * MobileNavDrawer.tsx → Mobile/tablet drawer menu (reads from NAV_ITEMS)
 *
 * ============================================================================
 */


/**
 * ============================================================================
 * NAVBAR COMPONENT
 * ============================================================================
 *
 * Fully responsive navbar with desktop, tablet, and mobile layouts.
 * 
 * BREAKPOINTS:
 * - Below 1024px (lg): Mobile hamburger menu + mobile drawer
 * - 1024px and above: Full desktop navigation
 *
 * ============================================================================
 * IMPORTANT: Navigation Items Configuration
 * ============================================================================
 *
 * ALL navigation items (desktop dropdown menu, mobile drawer) are managed
 * from a SINGLE source: `/src/config/navigation.ts`
 *
 * This ensures consistent navigation across all screen sizes.
 *
 * ============================================================================
 * HOW TO ADD OR MODIFY NAVIGATION ITEMS
 * ============================================================================
 *
 * Edit `/src/config/navigation.ts` - NAV_ITEMS array
 *
 * Simple Link (appears on both desktop & mobile):
 *   { label: 'Home', href: '/' }
 *
 * Dropdown Group (desktop shows as dropdown, mobile as expandable):
 *   {
 *     type: 'group',
 *     label: 'Activities',
 *     submenu: [
 *       { label: 'Community Events', href: '/activities/events' },
 *       { label: 'Workshops', href: '/activities/workshops' },
 *     ],
 *   }
 *
 * That's it! NavbarCenter (desktop) and MobileNavDrawer (mobile) automatically
 * sync with your changes.
 *
 * ============================================================================
 */

export function Navbar({
  logoSrc = mscLogo,
  logoAlt = 'Logo',
  className = '',
}: Readonly<NavbarProps>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // TODO: Connect to auth context/backend
  const [userName, setUserName] = useState('') // TODO: Get from auth context/backend

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('')
  }
  return (
    <header
      className={`sticky left-0 right-0 top-0 z-50 mx-auto  border-b border-border/40 bg-background overflow-visible ${className}`}
      suppressHydrationWarning
    >
      {/* Padding for mobile/tablet/desktop - no additional max-width wrapper needed */}
      <div className="px-2 sm:px-3 md:px-4 lg:px-6 mx-auto max-w-[1700px]">
        <nav className="relative flex h-16 w-full items-center justify-between gap-2 lg:gap-4">
          {/* MOBILE/TABLET: Hamburger Menu Drawer - Left */}
          <div className="lg:hidden z-20 flex-shrink-0">
            <MobileNavDrawer isLoggedIn={isLoggedIn} />
          </div>

          {/* DESKTOP: Logo Left, MOBILE: Logo Right */}
          <div className="hidden lg:flex lg:flex-shrink-0 z-10 pl-4">
            <NavbarLeft logoSrc={logoSrc} logoAlt={logoAlt} />
          </div>

          {/* MOBILE/TABLET: User Avatar in Center when logged in */}
          <div className="lg:hidden flex-1 flex justify-center z-10">
            {isLoggedIn && (
              <Avatar className="h-10 w-10 border-2 border-primary cursor-pointer">
                <AvatarFallback className="font-semibold">{getInitials(userName)}</AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* MOBILE/TABLET: Logo on Right */}
          <div className="lg:hidden flex-shrink-0 z-10 pr-2">
            <NavbarLeft logoSrc={logoSrc} logoAlt={logoAlt} />
          </div>

          {/* CENTER: Navigation Menu (Desktop Only) - Exactly centered */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-0">
            <NavbarCenter />
          </div>

          {/* RIGHT: Search, Theme Toggle, Sign In (Desktop) / Avatar (Mobile logged in) */}
          <div className="flex items-center gap-1 ml-auto z-10 hidden lg:flex justify-end pr-4">
            <NavbarRight isLoggedIn={isLoggedIn} userName={userName} />
          </div>
        </nav>
      </div>
    </header>
  )
}


