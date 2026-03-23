
import msclogoFooter from '@/assets/logos/msclogofooter.svg'
import locationIcon from '@/assets/icons/locationicon.svg'
import emailIcon from '@/assets/icons/emailicon.svg'
import fbIcon from '@/assets/icons/fb-icon.svg'
import linkedinIcon from '@/assets/icons/linkedin-icon.svg'
import githubIcon from '@/assets/icons/github-icon.svg'
import igIcon from '@/assets/icons/ig-icon.svg'
import discordIcon from '@/assets/icons/discord-icon.svg'
import tiktokIcon from '@/assets/icons/tiktok-icon.svg'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'
import { Link } from 'react-router-dom'

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
  const { isDarkMode } = useTheme()
  const iconFilter = isDarkMode ? 'brightness(0) invert(1)' : 'none'

  return (
    <footer className="w-full bg-background border-t border-border">
      {/* Main Footer Content - Compact spacing */}
      <div className="mx-auto max-w-[1700px] px-2 sm:px-3 md:px-4 lg:px-6 py-6 sm:py-8">
        {/* Mobile/Tablet Layout (< md) */}
        <div className="md:hidden space-y-4">
          {/* MSC Logo - Top, Centered */}
          <div className="flex justify-center mb-4">
            <div className="relative h-24 w-32">
              <img
                src={msclogoFooter}
                alt="MSC Logo"
                className="object-contain h-full w-full"
              />
            </div>
          </div>

          {/* Contact Us and Follow Us - Centered with padding */}
          <div className="space-y-4">
            {/* Contact Us Section */}
            <div className="flex flex-col items-center text-center px-4">
              <h3 className="text-base font-semibold mb-3 text-foreground">Contact Us</h3>
              <div className="space-y-2">
                {/* Address */}
                <a
                  href="https://maps.google.com/?q=KM+53+Pan+Philippine+Highway,+Brgy.+Milagrosa,+Calamba,+Philippines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-nowrap items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="MSC Office Address"
                >
                  <img
                    src={locationIcon}
                    alt="Location icon"
                    width={18}
                    height={18}
                    className="flex-shrink-0 mt-0.5"
                    style={{ filter: iconFilter }}
                  />
                  <span>KM 53 Pan Philippine Highway, Brgy. Milagrosa, Calamba, Philippines, 4027</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:msc@nu-laguna.edu.ph"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Contact email"
                >
                  <img
                    src={emailIcon}
                    alt="Email icon"
                    width={18}
                    height={18}
                    className="flex-shrink-0"
                    style={{ filter: iconFilter }}
                  />
                  <span>msc@nu-laguna.edu.ph</span>
                </a>
              </div>
            </div>

            {/* Follow Us Section - Centered */}
            <div className="flex flex-col items-center px-4">
              <h3 className="text-base font-semibold mb-3 text-foreground">Follow Us</h3>
              <div className="flex flex-wrap gap-3 justify-center">
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Partner with Us Button - Centered with padding */}
          <Button className="w-[calc(100%-1rem)] mx-2 h-10 text-base font-medium">
            Partner with Us
          </Button>
        </div>

        {/* Desktop Layout: Logo | Contact/Follow | Partner Button */}
        <div className="hidden md:grid md:grid-cols-[auto_auto_auto] gap-6 md:gap-8 mb-0">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start md:justify-start">
            <div className="relative h-28 w-40">
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
                  className="flex flex-nowrap items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="MSC Office Address"
                >
                  <img
                    src={locationIcon}
                    alt="Location icon"
                    width={16}
                    height={16}
                    className="flex-shrink-0 mt-0.5"
                    style={{ filter: iconFilter }}
                  />
                  <span>KM 53 Pan Philippine Highway, Brgy. Milagrosa, Calamba, Philippines, 4027</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:msc@nu-laguna.edu.ph"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Contact email"
                >
                  <img
                    src={emailIcon}
                    alt="Email icon"
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
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
                    style={{ filter: iconFilter }}
                  />
                </a>
              </div>
            </div>
          </div>
          
          {/* Partner with Us Section */}
          <div className="flex items-center justify-center">
            <Link to="/partners">
              <Button className="bg-orange-600">
                Partner with Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="w-full bg-primary text-primary-foreground py-4 sm:py-6 md:py-7">
        <div className="mx-auto max-w-[1700px] px-2 sm:px-3 md:px-4 lg:px-6">
          <p className="text-center text-xs">
            © 2026 NU Laguna Microsoft Student Community | All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
