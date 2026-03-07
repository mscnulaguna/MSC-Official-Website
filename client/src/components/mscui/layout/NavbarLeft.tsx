"use client"

import mscLogo from "@/assets/logos/msclogo.svg"
/**
 * NavbarLeft Component
 * ====================
 * Displays the logo on the left side of the navbar.
 *
 * What: Logo that links to home page
 * Why: Navigation anchor and branding
 * How: Click to go to home
 * Don't remove: The Link href or Image component
 */

interface NavbarLeftProps {
  logoSrc?: string
  logoAlt?: string
  href?: string
}

export function NavbarLeft({
  logoSrc = mscLogo,
  logoAlt = 'Logo',
  href = '/',
}: NavbarLeftProps) {
  return (
    // Logo container - Links to home
    <a
      href={href}
      className="flex items-center gap-2 transition-opacity hover:opacity-80"
    >
      {/* Logo image - Responsive sizing (h-8 mobile, h-10 tablet+) */}
      <div className="relative h-8 w-8 sm:h-10 sm:w-10">
        <img
          src={logoSrc}
          alt={logoAlt}
          className="object-contain h-full w-full"
        />
      </div>
    </a>
  )
}
