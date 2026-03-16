import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { NavbarWrapper } from "@/components/ui/layout";
import "./globals.css";

/**
 * AppLayout - Global App Wrapper Component
 *
 * This is a Vite + React app (not Next.js). The HTML document structure
 * already exists in index.html. This component wraps the application with:
 * - Global styling (globals.css)
 * - Navbar at the top
 * - Sonner Toaster for notifications
 *
 * The Toaster is positioned at the bottom-right and uses theme colors
 * from globals.css (--background, --foreground, etc.)
 *
 * Usage: Import this into App.tsx or your root component to wrap the app
 *
 * To use Sonner toast notifications:
 * import { toast } from 'sonner'
 *
 * toast("Default message")
 * toast.success("Success message")
 * toast.error("Error message")
 * toast.warning("Warning message")
 *
 * See: https://sonner.emilkowal.ski/
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navbar - Client Component Wrapper (fixed positioning) */}
      <NavbarWrapper />
      {/* Add padding-top to account for fixed navbar height (64px = h-16) */}
      <div className="pt-16">
        {children}
      </div>
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
      */}
      <Toaster position="bottom-right" theme="light" richColors />
    </>
  );
}

