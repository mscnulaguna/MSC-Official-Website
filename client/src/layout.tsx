import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { NavbarWrapper } from "@/components/mscui/layout";
import "./globals.css";

/**
 * RootLayout - Main App Container
 *
 * Includes:
 * - Global styling (globals.css)
 * - Google Font (Inter) with CSS variable
 * - Sonner Toaster for notifications
 * - TooltipProvider wrapper for tooltip components
 *
 * The Toaster is positioned at the bottom-right and uses the theme colors
 * from globals.css (--background, --foreground, etc.)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {/* Navbar - Client Component Wrapper */}
        <NavbarWrapper />
        {children}
        {/*
          SONNER TOASTER
          Displays toast notifications throughout the app.
          Position: bottom-right
          Theme: Light mode
          
          Styling Features:
          - Boxed edges: 2px borders, sharp corners
          - System color scheme (blue, green, red, orange)
          - Smooth animations and transitions
          - CSS-based customization in globals.css

          To use:
          import { toast } from 'sonner'

          toast("Default message")
          toast.success("Success message")
          toast.error("Error message")
          toast.warning("Warning message")

          See: https://sonner.emilkowal.ski/
        */}
        <Toaster position="bottom-right" theme="light" richColors />
      </body>
    </html>
  );
}

