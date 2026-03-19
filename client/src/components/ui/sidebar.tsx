import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Sidebar Component
 * =================
 *
 * Flexible sidebar layout container.
 * Works as a wrapper for navigation columns.
 * Responsive collapsible on mobile.
 * Customized to match MSC Design System.
 */

const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        "flex h-screen w-64 flex-col border-r border-border bg-white",
        className
      )}
      {...props}
    />
  )
)
Sidebar.displayName = "Sidebar"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto px-4 py-6", className)}
      {...props}
    />
  )
)
SidebarContent.displayName = "SidebarContent"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-b border-border px-4 py-4", className)}
      {...props}
    />
  )
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t border-border px-4 py-4", className)}
      {...props}
    />
  )
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarNav = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn("space-y-1", className)} {...props} />
  )
)
SidebarNav.displayName = "SidebarNav"

const SidebarNavItem = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "block px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50",
        className
      )}
      {...props}
    />
  )
)
SidebarNavItem.displayName = "SidebarNavItem"

export { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarNav, SidebarNavItem }
