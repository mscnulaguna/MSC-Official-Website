import mscLogo from "@/assets/logos/msclogofooterblack.svg"
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
  className?: string
  imageClassName?: string
}

export function NavbarLeft({
  logoSrc = mscLogo,
  logoAlt = 'Logo',
  href = '/',
  className = '',
  imageClassName = '',
}: NavbarLeftProps) {
  return (
    // Logo container - Links to home
    <a
      href={href}
      className={`flex items-center transition-all duration-200 hover:-translate-y-0.5 ${className}`.trim()}
    >
      {/* Logo image - Responsive sizing for both mobile and desktop */}
      <div className="relative h-8 w-auto sm:h-9 md:h-10 lg:h-11">
        <img
          src={logoSrc}
          alt={logoAlt}
          className={`h-full w-auto max-w-full object-contain ${imageClassName}`.trim()}
        />
      </div>
    </a>
  )
}
