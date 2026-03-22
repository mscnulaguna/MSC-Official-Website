import mscLogo from '@/assets/logos/msclogo.svg'
import { NavbarLeft } from './NavbarLeft'
import { NavbarCenter } from './NavbarCenter'
import { NavbarRight } from './NavbarRight'
import { MobileNavDrawer } from './MobileNavDrawer'

/**
 * ============================================================================
 * NAVBAR COMPONENT - Production Ready
 * ============================================================================
 *
 * A fully responsive, modular navbar component for React applications.
 * Uses shadcn/ui components and Tailwind CSS.
 *
 * FEATURES:
 * ✓ Fully responsive (mobile, tablet, desktop)
 * ✓ Modular, reusable sub-components
 * ✓ Flex layout with no hardcoded px widths
 * ✓ Dropdown menus (Activities, Learn)
 * ✓ Search dialog with keyboard-friendly filtering UI
 * ✓ Dark mode toggle UI (ready for integration)
 * ✓ Mobile drawer navigation
 * ✓ WCAG accessible with keyboard navigation
 *
 * LAYOUT:
 * ┌─────────────────────────────────────────────┐
 * │ Logo (Left) │ Nav Menu (Center) │ Controls (Right) │
 * └─────────────────────────────────────────────┘
 *
 * WHY NO CALLBACK PROPS?
 * ======================
 * This component is self-contained with internal state.
 * This design decision:
 * - Reduces prop drilling complexity
 * - Makes the component safer to use in layout.tsx
 * - Supports future theme/search integration via hooks or providers
 *
 * ============================================================================
 */

interface NavbarProps {
  /**
  * Logo source path (default: MSC logo asset)
   */
  logoSrc?: string

  /**
   * Logo alt text (default: 'Logo')
   */
  logoAlt?: string

  /**
   * Additional CSS classes for navbar container
   */
  className?: string
}

/**
 * RESPONSIVE BREAKPOINTS:
 * - Mobile (< 768px): Hamburger menu, icon-only sign in
 * - Tablet (768px - 1023px): Compressed spacing, hamburger menu
 * - Desktop (≥ 1024px): Full navigation menu, all controls visible
 */

export function Navbar({
  logoSrc = mscLogo,
  logoAlt = 'Logo',
  className = '',
}: NavbarProps) {
  return (
    <header
      className={`sticky left-0 right-0 top-0 z-50 mx-auto  border-b border-border/40 bg-background overflow-visible ${className}`}
      suppressHydrationWarning
    >
      {/* Padding for mobile/tablet/desktop - no additional max-width wrapper needed */}
      <div className="px-2 sm:px-3 md:px-4 lg:px-6">
        <nav className="relative flex h-16 w-full items-center justify-between gap-2 lg:gap-4">
          {/* MOBILE/TABLET: Hamburger Menu Drawer - Left */}
          <div className="lg:hidden z-20 flex-shrink-0">
            <MobileNavDrawer />
          </div>

          {/* DESKTOP: Logo Left, MOBILE: Logo Right */}
          <div className="hidden lg:flex lg:flex-shrink-0 z-10 pl-4">
            <NavbarLeft logoSrc={logoSrc} logoAlt={logoAlt} />
          </div>

          {/* MOBILE/TABLET: Logo on Right */}
          <div className="lg:hidden flex-1 flex justify-end z-10">
            <NavbarLeft logoSrc={logoSrc} logoAlt={logoAlt} />
          </div>

          {/* CENTER: Navigation Menu (Desktop Only) - Exactly centered */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-0">
            <NavbarCenter />
          </div>

          {/* RIGHT: Search, Theme Toggle, Sign In */}
          <div className="flex items-center gap-1 ml-auto z-10 hidden lg:flex justify-end pr-4">
            <NavbarRight />
          </div>
        </nav>
      </div>
    </header>
  )
}


/**
 * ============================================================================
 * CUSTOMIZATION GUIDE
 * ============================================================================
 *
 * 1. HOW TO ADD NEW NAVIGATION LINKS
 * ─────────────────────────────────────
 * Edit the menuItems array in NavbarCenter.tsx:
 *
 *   const menuItems = [
 *     { label: 'Home', href: '/' },
 *     { label: 'New Link', href: '/new-page' },  // ← Add here
 *     // ... rest of items
 *   ]
 *
 * For dropdown items, use this format:
 *
 *   {
 *     label: 'Products',
 *     submenu: [
 *       { label: 'Product 1', href: '/products/1' },
 *       { label: 'Product 2', href: '/products/2' },
 *     ],
 *   }
 *
 *
 * 2. HOW TO MODIFY DROPDOWN ITEMS
 * ────────────────────────────────
 * In NavbarCenter.tsx, each menu item with 'submenu' property
 * becomes a dropdown. The submenu array contains all dropdown links:
 *
 *   {
 *     label: 'Activities',
 *     submenu: [
 *       { label: 'Events', href: '/activities/events' },        // ← Edit
 *       { label: 'New Feature', href: '/activities/feature' }, // ← Add
 *     ],
 *   }
 *
 * Mobile drawer menu uses NAV_ITEMS in MobileNavDrawer.tsx.
 * Update both to keep navigation consistent!
 *
 *
 * 3. HOW TO REPLACE LOGO
 * ──────────────────────
 * Option A: Update the default in Navbar component:
 *
 *   <Navbar logoSrc="/your-default-logo.svg" />
 *
 * Option B: Change the default in NavbarLeft.tsx:
 *
 *   logoSrc = '/new-logo.png'
 *
 * Logo scales responsively:
 * - Mobile: 32x32px (h-8 w-8)
 * - Tablet+: 40x40px (h-10 w-10)
 *
 *
 * 4. HOW TO ENABLE REAL SEARCH FUNCTIONALITY
 * ───────────────────────────────────────────
 * In SearchDialog.tsx, replace the submit handler with your real search flow:
 *
 *   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
 *     event.preventDefault()
 *
 *     // Call your API or search service
 *     const results = await searchApi(searchQuery)
 *
 *     // Handle results (navigate, show inline results, etc.)
 *     navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
 *     setOpen(false)
 *   }
 *
 *
 * 5. HOW TO CONVERT TOGGLE INTO REAL DARK MODE TOGGLE
 * ─────────────────────────────────────────────────────
 * The dark mode toggle is in NavbarRight.tsx with internal state.
 *
 * Option A: Using next-themes (Recommended)
 *
 *   npm install next-themes
 *
 *   In NavbarRight.tsx:
 *
 *   import { useTheme } from 'next-themes'
 *
 *   export function NavbarRight() {
 *     const { theme, setTheme } = useTheme()
 *     const isDarkMode = theme === 'dark'
 *
 *     const handleThemeToggle = (pressed: boolean) => {
 *       setTheme(pressed ? 'dark' : 'light')  // Real theme switching
 *     }
 *
 *     // ... rest of component (unchanged)
 *   }
 *
 *   Make sure your app layout is wrapped with ThemeProvider:
 *   See https://github.com/pacocoursey/next-themes for setup.
 *
 * Option B: Using Context API
 *
 *   Create a ThemeContext, provide it at root level,
 *   and use useTheme() hook in NavbarRight.tsx
 *
 * Option C: Using localStorage + useEffect
 *
 *   Persist theme preference to localStorage,
 *   load it on app start using useEffect
 *
 *
 * 6. HOW TO ADJUST RESPONSIVE BREAKPOINTS
 * ────────────────────────────────────────
 * Current breakpoints (using Tailwind classes):
 * - hidden lg:block → Hidden on mobile/tablet, shown on desktop (lg: 1024px)
 * - hidden sm:inline-flex → Hidden on mobile, shown on tablet+ (sm: 640px)
 * - h-8 w-8 sm:h-10 sm:w-10 → Logo size adjusts at sm breakpoint
 *
 * To change when menu drawer appears, modify files:
 *
 * NavbarCenter.tsx:
 *   hidden lg:block  ← Change 'lg' to 'md' (768px) or 'xl' (1280px)
 *
 * Navbar.tsx:
 *   lg:hidden        ← Mobile drawer hidden on lg+ screens
 *
 *   OLD: hidden on lg and up
 *   NEW: hidden on md and up
 *
 *   Change: lg:hidden → md:hidden
 *
 * Common breakpoints:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px (default for navbar menu collapse)
 * - xl: 1280px
 * - 2xl: 1536px
 *
 *
 * 7. HOW TO ADD MORE CONTROLS TO THE RIGHT SECTION
 * ─────────────────────────────────────────────────
 * In NavbarRight.tsx, add components to the flex container:
 *
 *   <div className="flex items-center gap-2 sm:gap-3">
 *     <Button variant="ghost" size="icon">...</Button>
 *     <Toggle>...</Toggle>
 *
 *     // Your new control
 *     <Button variant="ghost" size="icon">
 *       <BellIcon className="h-5 w-5" />
 *     </Button>
 *
 *     <Button>Sign In</Button>
 *   </div>
 *
 *
 * 8. STYLING CUSTOMIZATION
 * ──────────────────────────
 * The navbar uses Tailwind CSS with shadcn color tokens.
 * All colors are defined in your Tailwind config.
 *
 * To change navbar styling:
 * - Border color: border-border/40 → modify in Navbar.tsx
 * - Background: bg-background/95 → uses your theme colors
 * - Hover states: hover:bg-accent → defined in Tailwind config
 *
 * NO ADDITIONAL CSS NEEDED - all styled through Tailwind utilities
 *
 *
 * 9. EXTENDING WITH NOTIFICATIONS / BADGES
 * ──────────────────────────────────────────
 * Example: Add notification badge count
 *
 *   import { Badge } from '@/components/ui/badge'
 *
 *   <Button variant="ghost" size="icon" className="relative">
 *     <Bell className="h-5 w-5" />
 *     <Badge className="absolute -right-2 -top-2">3</Badge>
 *   </Button>
 *
 * Add it to NavbarRight.tsx in the flex container
 *
 *
 * 10. TESTING & ACCESSIBILITY
 * ─────────────────────────────
 * ✓ Test on multiple screen sizes (mobile, tablet, desktop)
 * ✓ Test keyboard navigation (Tab, Enter, Escape)
 * ✓ Test screen readers (use your browser's accessibility inspector)
 * ✓ Check color contrast (use WebAIM Contrast Checker)
 * ✓ Test dropdown menu on touch devices
 *
 * ============================================================================
 */
