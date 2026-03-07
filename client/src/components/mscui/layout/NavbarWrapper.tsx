'use client'

import { Navbar } from './Navbar'

/**
 * NavbarWrapper Component
 * 
 * This is a client-side wrapper for the Navbar component.
 * It's used in the Server Component layout to avoid hydration mismatches
 * caused by Radix UI components generating different IDs on server vs client.
 * 
 * By making this a Client Component, the Navbar can properly manage its
 * internal state and Radix UI ID generation without SSR complications.
 */

interface NavbarWrapperProps {
  logoSrc?: string
  logoAlt?: string
}

export default function NavbarWrapper({ logoSrc, logoAlt }: NavbarWrapperProps) {
  return <Navbar logoSrc={logoSrc} logoAlt={logoAlt} />
}
