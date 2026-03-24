
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
import { Link } from 'react-router-dom'

const CONTACT = {
  addressHref:
    'https://maps.google.com/?q=KM+53+Pan+Philippine+Highway,+Brgy.+Milagrosa,+Calamba,+Philippines',
  addressText:
    'KM 53 Pan Philippine Highway, Brgy. Milagrosa, Calamba, Philippines, 4027',
  emailHref: 'mailto:msc@nu-laguna.edu.ph',
  emailText: 'msc@nu-laguna.edu.ph',
} as const

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com', iconSrc: fbIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', iconSrc: linkedinIcon },
  { label: 'GitHub', href: 'https://github.com', iconSrc: githubIcon },
  { label: 'Instagram', href: 'https://instagram.com', iconSrc: igIcon },
  { label: 'Discord', href: 'https://discord.com', iconSrc: discordIcon },
  { label: 'TikTok', href: 'https://tiktok.com', iconSrc: tiktokIcon },
] as const

function FooterIcon({
  src,
  alt,
  size,
  className,
}: Readonly<{ src: string; alt: string; size: number; className?: string }>) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={
        'shrink-0 object-contain dark:[filter:brightness(0)_invert(1)] ' +
        (className ?? '')
      }
    />
  )
}

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border">
      {/* Main Footer Content - Compact spacing */}
      <div className="section-container px-2 sm:px-3 md:px-4 lg:px-6 py-6 sm:py-8">
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
              <div className="w-full max-w-md space-y-2">
                {/* Address */}
                <a
                  href={CONTACT.addressHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="MSC Office Address"
                >
                  <FooterIcon
                    src={locationIcon}
                    alt="Location icon"
                    size={20}
                    className="mt-0.5"
                  />
                  <span className="max-w-[260px] leading-snug text-center">{CONTACT.addressText}</span>
                </a>

                {/* Email */}
                <a
                  href={CONTACT.emailHref}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Contact email"
                >
                  <FooterIcon src={emailIcon} alt="Email icon" size={18} />
                  <span>{CONTACT.emailText}</span>
                </a>
              </div>
            </div>

            {/* Follow Us Section - Centered */}
            <div className="flex flex-col items-center px-4">
              <h3 className="text-base font-semibold mb-3 text-foreground">Follow Us</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:opacity-75 transition-opacity"
                    aria-label={social.label}
                  >
                    <FooterIcon
                      src={social.iconSrc}
                      alt={`${social.label} icon`}
                      size={20}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Partner with Us Button - Centered with padding */}
          <Link to="/partners">
            <Button className="w-[calc(100%-1rem)] mx-2" variant={'destructive'}  >
              Partner with Us
            </Button>
          </Link>
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
                  href={CONTACT.addressHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="MSC Office Address"
                >
                  <FooterIcon
                    src={locationIcon}
                    alt="Location icon"
                    size={16}
                    className="mt-0.5"
                  />
                  <span className="min-w-0 leading-snug">{CONTACT.addressText}</span>
                </a>

                {/* Email */}
                <a
                  href={CONTACT.emailHref}
                  className="grid grid-cols-[16px_minmax(0,1fr)] items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Contact email"
                >
                  <FooterIcon src={emailIcon} alt="Email icon" size={16} />
                  <span className="min-w-0">{CONTACT.emailText}</span>
                </a>
              </div>
            </div>

            {/* Follow Us Column */}
            <div className="text-left">
              <h3 className="text-base font-semibold mb-3 text-foreground">Follow Us</h3>
              <div className="flex flex-wrap gap-2">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:-translate-y-0.5 hover:opacity-75 transition-opacity"
                    aria-label={social.label}
                  >
                    <FooterIcon
                      src={social.iconSrc}
                      alt={`${social.label} icon`}
                      size={20}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Partner with Us Section */}
          <div className="flex items-center justify-center">
            <Link to="/partners">
              <Button variant={'destructive'}>
                Partner with Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="w-full bg-primary text-primary-foreground py-4 sm:py-6 md:py-7">
        <div className="section-container px-2 sm:px-3 md:px-4 lg:px-6">
          <p className="text-center text-xs">
            © 2026 NU Laguna Microsoft Student Community | All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
