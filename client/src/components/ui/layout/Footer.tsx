import nuLagunaLogo from '@/assets/logos/NU Laguna.png'
import nuLagunaLogoDark from '@/assets/logos/NU Laguna-dark.png'
import mscLogo from '@/assets/logos/msclogofooterblack.svg'
import mscLogoWhite from '@/assets/logos/msclogofooterwhite.svg'
import fbIcon from '@/assets/icons/fb-icon.svg'
import githubIcon from '@/assets/icons/github-icon.svg'
import igIcon from '@/assets/icons/ig-icon.svg'
import linkedinIcon from '@/assets/icons/linkedin-icon.svg'
import tiktokIcon from '@/assets/icons/tiktok-icon.svg'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'
import { Mail, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
  { label: 'TikTok', href: 'https://tiktok.com', iconSrc: tiktokIcon },
] as const

const DESCRIPTION =
  'Microsoft Student Community - NU Laguna is a student-led organization helping Nationalians learn, build, and collaborate through technology, design, and community-driven projects.'

function SocialIcon({
  src,
}: Readonly<{ src: string }>) {
  return (
    <img
      src={src}
      alt=""
      width={18}
      height={18}
      className="h-[18px] w-[18px] object-contain opacity-75 transition-opacity group-hover:opacity-100 dark:[filter:brightness(0)_invert(1)]"
      aria-hidden="true"
    />
  )
}

export function Footer() {
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const handlePartnerClick = () => {
    navigate('/partners#contactForm')
  }

  return (
    <footer className="w-full border-t border-border bg-white text-foreground dark:bg-background">
      <div className="section-container section-padding py-10 sm:py-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(250px,0.55fr)_minmax(250px,0.55fr)] lg:gap-12">
          <section aria-label="Microsoft Student Community" className="max-w-3xl">
            <div className="flex max-w-full items-center gap-3 sm:gap-5">
              <img
                src={isDarkMode ? nuLagunaLogoDark : nuLagunaLogo}
                alt="NU Laguna"
                className="h-12 w-auto max-w-[32%] shrink-0 object-contain sm:h-20 sm:max-w-none lg:h-24"
              />
              <span className="h-10 w-px shrink-0 bg-border sm:h-16 lg:h-20" aria-hidden="true" />
              <img
                src={isDarkMode ? mscLogoWhite : mscLogo}
                alt="Microsoft Student Community - NU Laguna"
                className="h-11 min-w-0 flex-1 object-contain object-left sm:h-[4.5rem] sm:flex-none lg:h-20"
              />
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {DESCRIPTION}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-foreground hover:bg-muted dark:bg-muted/20 dark:hover:bg-muted/40"
                >
                  <SocialIcon src={social.iconSrc} />
                </a>
              ))}
            </div>
          </section>

          <section aria-labelledby="footer-contact-heading">
            <h2
              id="footer-contact-heading"
              className="text-sm font-semibold uppercase tracking-wide text-foreground"
            >
              Contact
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
              <a
                href={CONTACT.addressHref}
                target="_blank"
                rel="noopener noreferrer"
                className="grid grid-cols-[20px_minmax(0,1fr)] gap-3 transition-colors hover:text-foreground"
              >
                <MapPin className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <span>{CONTACT.addressText}</span>
              </a>

              <a
                href={CONTACT.emailHref}
                className="grid grid-cols-[20px_minmax(0,1fr)] gap-3 transition-colors hover:text-foreground"
              >
                <Mail className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <span>{CONTACT.emailText}</span>
              </a>
            </div>
          </section>

          <section aria-labelledby="footer-partner-heading">
            <h2
              id="footer-partner-heading"
              className="text-sm font-semibold uppercase tracking-wide text-foreground"
            >
              Collaborate
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              For partnerships, sponsorships, talks, workshops, and campus tech
              initiatives, reach out to the MSC - NU Laguna team.
            </p>

            <Button
              type="button"
              onClick={handlePartnerClick}
              className="mt-5 w-full sm:w-auto"
            >
              Partner with us
            </Button>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} Microsoft Student Community - NU Laguna. All rights
            reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="mailto:msc@nu-laguna.edu.ph" className="hover:text-foreground">
              Support
            </a>
            <a href="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
