"use client"

import msclogoFooter from '@/assets/logos/msclogofooter.svg'
import locationIcon from '@/assets/icons/locationicon.svg'
import emailIcon from '@/assets/icons/emailicon.svg'
import fbIcon from '@/assets/icons/fb-icon.svg'
import linkedinIcon from '@/assets/icons/linkedin-icon.svg'
import githubIcon from '@/assets/icons/github-icon.svg'
import igIcon from '@/assets/icons/ig-icon.svg'
import twitterIcon from '@/assets/icons/icon-twitter.svg'
import discordIcon from '@/assets/icons/discord-icon.svg'
import tiktokIcon from '@/assets/icons/tiktok-icon.svg'
import { Button } from '@/components/mscui/button'

/**
 * Footer Component
 * ================
 * Displays footer with:
 * - Logo on the left
 * - Contact Us and Follow Us info in the middle (two columns)
 * - Partner with Us button on the right
 * - Copyright notice with blue background at bottom
 *
 * Fully responsive across all screen sizes
 *
 * MAX WIDTH MANAGEMENT:
 * Both the main content and copyright sections use max-w-[1700px].
 * This matches the Navbar and page content max-width for consistency.
 * To adjust: Change 1700px to 1600px, 1800px, etc.
 * NOTE: Update Navbar.tsx and BASE_PAGE_TEMPLATE.tsx as well to keep consistent.
 *
 * ICON SYSTEM:
 * Footer icons are custom project icons, NOT lucide-react defaults.
 * Located in src/assets/icons/ directory
 * Update SVG files there to change icons globally across all pages.
 */

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-border">
      {/* Main Footer Content - Compact spacing */}
      <div className="mx-auto max-w-[1700px] px-2 sm:px-3 md:px-4 lg:px-6 py-8 sm:py-10">
        {/* Desktop Layout: Logo | Contact/Follow | Partner Button */}
        <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-8 mb-0">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start md:justify-start">
            <div className="relative h-28 w-40 md:h-28 md:w-40">
              <img
                src={msclogoFooter}
                alt="MSC Logo"
                className="object-contain h-full w-full"
              />
            </div>
          </div>

          {/* Contact Us and Follow Us - Nested Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Contact Us Column */}
            <div className="text-left">
              <h3 className="text-base font-semibold mb-3 text-foreground">Contact Us</h3>
              <div className="space-y-2">
                {/* Address */}
                <a
                  href="https://maps.google.com/?q=KM+53+Pan+Philippine+Highway,+Brgy.+Milagrosa,+Calamba,+Philippines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="MSC Office Address"
                >
                  <img
                    src={locationIcon}
                    alt="Location icon"
                    width={16}
                    height={16}
                    className="flex-shrink-0 mt-0.5"
                  />
                  <span>KM 53 Pan Philippine Highway, Brgy. Milagrosa, Calamba, Philippines, 4027</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:msc@nu-laguna.edu.ph"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Contact email"
                >
                  <img
                    src={emailIcon}
                    alt="Email icon"
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                  <span>msc@nu-laguna.edu.ph</span>
                </a>
              </div>
            </div>

            {/* Follow Us Column */}
            <div className="text-left">
              <h3 className="text-base font-semibold mb-3 text-foreground">Follow Us</h3>
              <div className="flex flex-wrap gap-2">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:opacity-75 transition-opacity"
                  aria-label="Facebook"
                >
                  <img
                    src={fbIcon}
                    alt="Facebook icon"
                    width={20}
                    height={20}
                  />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:opacity-75 transition-opacity"
                  aria-label="LinkedIn"
                >
                  <img
                    src={linkedinIcon}
                    alt="LinkedIn icon"
                    width={20}
                    height={20}
                  />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:opacity-75 transition-opacity"
                  aria-label="GitHub"
                >
                  <img
                    src={githubIcon}
                    alt="GitHub icon"
                    width={20}
                    height={20}
                  />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:opacity-75 transition-opacity"
                  aria-label="Instagram"
                >
                  <img
                    src={igIcon}
                    alt="Instagram icon"
                    width={20}
                    height={20}
                  />
                </a>

                {/* Twitter */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:opacity-75 transition-opacity"
                  aria-label="Twitter"
                >
                  <img
                    src={twitterIcon}
                    alt="Twitter icon"
                    width={20}
                    height={20}
                  />
                </a>

                {/* Discord */}
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:opacity-75 transition-opacity"
                  aria-label="Discord"
                >
                  <img
                    src={discordIcon}
                    alt="Discord icon"
                    width={20}
                    height={20}
                  />
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:opacity-75 transition-opacity"
                  aria-label="TikTok"
                >
                  <img
                    src={tiktokIcon}
                    alt="TikTok icon"
                    width={20}
                    height={20}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Partner with Us Section */}
          <div className="flex items-center justify-end">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 h-auto text-sm">
              Partner with Us
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Layout: 2x2 Grid */}
        <div className="md:hidden px-3 sm:px-4 md:px-5 lg:px-6 py-4">
          {/* Row 1: Contact Us | Follow Us */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6">
            {/* Contact Us */}
            <div className="text-left">
              <h3 className="text-sm font-semibold mb-2 text-foreground">Contact Us</h3>
              <div className="space-y-2">
                {/* Address */}
                <a
                  href="https://maps.google.com/?q=KM+53+Pan+Philippine+Highway,+Brgy.+Milagrosa,+Calamba,+Philippines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="MSC Office Address"
                >
                  <img
                    src={locationIcon}
                    alt="Location icon"
                    width={14}
                    height={14}
                    className="flex-shrink-0 mt-0.5"
                  />
                  <span>KM 53 Pan Philippine Highway, Brgy. Milagrosa, Calamba, Philippines, 4027</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:msc@nu-laguna.edu.ph"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Contact email"
                >
                  <img
                    src={emailIcon}
                    alt="Email icon"
                    width={14}
                    height={14}
                    className="flex-shrink-0"
                  />
                  <span>msc@nu-laguna.edu.ph</span>
                </a>
              </div>
            </div>

            {/* Follow Us */}
            <div className="text-left">
              <h3 className="text-sm font-semibold mb-2 text-foreground">Follow Us</h3>
              <div className="flex flex-wrap gap-1">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:opacity-75 transition-opacity"
                  aria-label="Facebook"
                >
                  <img
                    src={fbIcon}
                    alt="Facebook icon"
                    width={16}
                    height={16}
                  />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:opacity-75 transition-opacity"
                  aria-label="LinkedIn"
                >
                  <img
                    src={linkedinIcon}
                    alt="LinkedIn icon"
                    width={16}
                    height={16}
                  />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:opacity-75 transition-opacity"
                  aria-label="GitHub"
                >
                  <img
                    src={githubIcon}
                    alt="GitHub icon"
                    width={16}
                    height={16}
                  />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:opacity-75 transition-opacity"
                  aria-label="Instagram"
                >
                  <img
                    src={igIcon}
                    alt="Instagram icon"
                    width={16}
                    height={16}
                  />
                </a>

                {/* Twitter */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:opacity-75 transition-opacity"
                  aria-label="Twitter"
                >
                  <img
                    src={twitterIcon}
                    alt="Twitter icon"
                    width={16}
                    height={16}
                  />
                </a>

                {/* Discord */}
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:opacity-75 transition-opacity"
                  aria-label="Discord"
                >
                  <img
                    src={discordIcon}
                    alt="Discord icon"
                    width={16}
                    height={16}
                  />
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:opacity-75 transition-opacity"
                  aria-label="TikTok"
                >
                  <img
                    src={tiktokIcon}
                    alt="TikTok icon"
                    width={16}
                    height={16}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Row 2: Logo | Partner Button */}
          <div className="grid grid-cols-[1fr_1fr] gap-4 items-center">
            {/* Logo - Full height on left */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-24 w-32">
                <img
                  src={msclogoFooter}
                  alt="MSC Logo"
                  className="object-contain h-full w-full"
                />
              </div>
            </div>

            {/* Partner Button - Full width on right */}
            <div className="flex items-center justify-center h-full\">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full px-3 py-2 h-auto text-xs font-medium">
                Partner with Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="w-full bg-blue-600 text-white py-2">
        <div className="mx-auto max-w-[1700px] px-2 sm:px-3 md:px-4 lg:px-6">
          <p className="text-center text-xs">
            © 2026 NU Laguna Microsoft Student Community | All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
