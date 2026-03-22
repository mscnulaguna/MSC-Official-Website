import { Navbar } from './Navbar'

/**
 * NavbarWrapper Component
 * 
 * This is a client-side wrapper for the Navbar component.
 * It's used to encapsulate the Navbar's internal state management,
 * allowing smooth integration with React's rendering without SSR concerns.
 * 
 * Since this is a Vite + React app (not Next.js), all components are
 * client-side by default. This wrapper simply organizes the Navbar
 * component for cleaner composition in the layout.
 */

interface NavbarWrapperProps {
  logoSrc?: string
  logoAlt?: string
}

export default function NavbarWrapper({ logoSrc, logoAlt }: NavbarWrapperProps) {
  return <Navbar logoSrc={logoSrc} logoAlt={logoAlt} />
}
