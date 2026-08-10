import { Button } from '@/components/ui/button';
import { TetrisBlocksBackground } from '@/components/home/TetrisBlocksBackground';
import { VideoPlayer } from '@/components/ui/custom/VideoPlayer';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { useTypingAnimation, type TypingWord } from '@/hooks/useTypingAnimation';
import { useTheme } from '@/context/ThemeContext';
import mscLogoFooterBlack from '@/assets/logos/msclogofooterblack.svg';
import mscLogoFooterWhite from '@/assets/logos/msclogofooterwhite.svg';
import mikeMascot from '@/assets/mascot/Mike - Mascot.png';
import { getApiBaseUrl } from '@/lib/api';
import '@/styles/home.css';
import { useEffect, useState, type JSX, type ComponentType } from 'react';
import { useAuth } from '@/context/authContext';
import { useNavigate } from 'react-router-dom';

// Google Material-style icons via Lucide
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  Users, 
  FolderKanban, 
  BookOpen
} from 'lucide-react';

const API_BASE = getApiBaseUrl();
const logoModules = import.meta.glob('/src/assets/logos/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const getLogoAsset = (fileName: string) => logoModules[`/src/assets/logos/${fileName}.svg`] ?? '';
const getLogoBaseName = (name: string) => name.replace(/\.(png|jpe?g|svg)$/i, '');
const normalizePartnerLogo = (partner: Partner): Partner => ({
  ...partner,
  name: getLogoBaseName(partner.name),
  logo: getLogoAsset(getLogoBaseName(partner.name)) || partner.logo,
});

interface Perk {
  id?: string;
  title: string;
  description: string;
  icon?: ComponentType<{ className?: string }>;
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
  bio: string;
}

// Perk card skeleton loader
const PerkCardSkeleton = (): JSX.Element => (
  <Card className="rounded-none border-border animate-pulse">
    <CardHeader>
      <div className="w-10 h-10 bg-muted rounded-none mb-4" />
      <div className="h-6 w-32 bg-muted rounded-none" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded-none" />
        <div className="h-4 w-3/4 bg-muted rounded-none" />
      </div>
    </CardContent>
  </Card>
);

function MemberPerkCard({ title, description, icon: Icon }: Perk) {
  return (
    <Card className="h-full border-border rounded-none text-left bg-background py-0">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="mb-3 flex size-10 items-center justify-center border border-border text-primary">
          {Icon ? <Icon className="size-5 stroke-[1.75]" /> : <Award className="size-5 stroke-[1.75]" />}
        </div>
        <CardTitle className="text-base sm:text-lg font-black tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

const FALLBACK_PERKS: Perk[] = [
  {
    title: "Exclusive Workshops",
    description: "Learn cutting-edge skills and technologies through hands-on sessions led by industry experts and community mentors.",
    icon: GraduationCap
  },
  {
    title: "Career Opportunities",
    description: "Connect with Microsoft recruiters, internship programs, and exclusive job opportunities for MSC members.",
    icon: Briefcase
  },
  {
    title: "Certifications",
    description: "Earn industry-recognized certifications through Microsoft Learn paths and exam vouchers provided to members.",
    icon: Award
  },
  {
    title: "Networking Events",
    description: "Build meaningful connections with peers, mentors, and professionals in tech at our exclusive networking events.",
    icon: Users
  },
  {
    title: "Project Showcase",
    description: "Display your portfolio projects and get feedback from experienced developers and potential employers.",
    icon: FolderKanban
  },
  {
    title: "Resource Library",
    description: "Access exclusive learning materials, tutorials, and documentation curated for our community members.",
    icon: BookOpen
  }
];

const FALLBACK_PARTNERS: Partner[] = [
  {
    id: "fallback-0",
    name: "Microsoft",
    logo: getLogoAsset("Microsoft"),
    url: "",
    bio: "The Microsoft Student Community chapter at NU Laguna, fostering tech innovation among students.",
  },
  {
    id: "fallback-1",
    name: "DataCamp Donates",
    logo: getLogoAsset("DataCamp Donates"),
    url: "",
    bio: "Supporting student learning through access to data and AI education resources.",
  },
  {
    id: "fallback-2",
    name: "Techbayanihan",
    logo: getLogoAsset("Techbayanihan"),
    url: "",
    bio: "A student-led community at TIP Manila bridging the gap between theory and practice in software development.",
  },
  {
    id: "fallback-3",
    name: "OpenText",
    logo: getLogoAsset("OpenText"),
    url: "",
    bio: "Empowering PLM students with cloud computing skills and AWS certifications.",
  },
  {
    id: "fallback-4",
    name: "Microsoft Azure Community PH",
    logo: getLogoAsset("Microsoft Azure Community PH"),
    url: "",
    bio: "The Association for Computing Machinery chapter at De La Salle University, promoting excellence in computing.",
  },
  {
    id: "fallback-5",
    name: "DEVCON Laguna",
    logo: getLogoAsset("DEVCON Laguna"),
    url: "",
    bio: "Uniting future IT professionals at UST through competitions, seminars, and community outreach.",
  },
  {
    id: "fallback-6",
    name: "DataSense Analytics",
    logo: getLogoAsset("DataSense Analytics"),
    url: "",
    bio: "A student organization at FEU Tech dedicated to ethical hacking, digital forensics, and cybersecurity awareness.",
  },
  {
    id: "fallback-7",
    name: "BFC Real",
    logo: getLogoAsset("BFC Real"),
    url: "",
    bio: "Cultivating data literacy and analytics skills among Ateneo students through workshops and research.",
  },
  {
    id: "fallback-8",
    name: "Council of Leaders",
    logo: getLogoAsset("Council of Leaders"),
    url: "",
    bio: "A PUP organization championing open-source software contributions and collaborative development.",
  },
  {
    id: "fallback-9",
    name: "CCC Computer Science Society",
    logo: getLogoAsset("CCC Computer Science Society"),
    url: "",
    bio: "Inspiring Mapúa students to craft intuitive and beautiful digital experiences through design thinking.",
  },
  {
    id: "fallback-10",
    name: "CCC Information Technology Society",
    logo: getLogoAsset("CCC Information Technology Society"),
    url: "",
    bio: "A multidisciplinary org at UPLB exploring robotics, machine learning, and intelligent systems.",
  },
  {
    id: "fallback-11",
    name: "PUP Microsoft Student Community",
    logo: getLogoAsset("PUP Microsoft Student Community"),
    url: "",
    bio: "Where Adamson students turn game ideas into reality — from pixel art to full game jam releases.",
  },
  {
    id: "fallback-12",
    name: "School of Computer Studies - Student Council",
    logo: getLogoAsset("School of Computer Studies - Student Council"),
    url: "",
    bio: "Exploring the intersection of finance and technology at CEU through projects, talks, and industry mentorship.",
  },
];

const TYPING_WORDS: TypingWord[] = [
  { text: 'Achieve', color: 'text-primary' },    
  { text: 'Build', color: 'text-success' },     
  { text: 'Learn', color: 'text-destructive' },       
  { text: 'Create', color: 'text-warning' },   
];

export default function Home(): JSX.Element {
  const { currentWordIndex, displayText } = useTypingAnimation(TYPING_WORDS);
  const { isDarkMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const gridOpacity = isDarkMode ? 'opacity-10' : 'opacity-20';

  const [perks] = useState<Perk[]>(FALLBACK_PERKS);
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate('/login')
  }
  const handleJoinEvent = () => {
    navigate('/activities')
  }
  const handleExploreMore = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  }
  const handleMeetMembers = () => {
    navigate('/about#team')
  }
  const viewPerks = () => {
    navigate('/about#perks')
  }
  const visiblePartners = partners.length > 0 ? partners : FALLBACK_PARTNERS;
  const logoRepeats = Math.max(2, Math.ceil(12 / visiblePartners.length));
  const logoSet = Array.from({ length: logoRepeats }, () => visiblePartners).flat();
  const getPartnerLogoSrc = (logo: string) => {
    if (!isDarkMode) return logo;

    const assetPath = Object.keys(logoModules).find((path) => logoModules[path] === logo);

    if (assetPath) {
      const darkAssetPath = assetPath.replace(/(\.[a-z0-9]+)$/i, '-dark$1');
      return logoModules[darkAssetPath] ?? logo;
    }

    if (/\.[a-z0-9]+(\?.*)?$/i.test(logo)) {
      return logo.replace(/\.[a-z0-9]+(\?.*)?$/i, '-dark.svg$1');
    }

    return `${logo}-dark.svg`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, partnersRes] = await Promise.all([
          fetch(`${API_BASE}/events`),
          fetch(`${API_BASE}/partners`)
        ]);

        if (!eventsRes.ok || !partnersRes.ok) {
          throw new Error('API fetch failed');
        }

        const partnersData = await partnersRes.json();
        setPartners(partnersData.data.map(normalizePartnerLogo));
      } catch {
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .marquee {
          position: relative;
          overflow-x: clip;
          overflow-y: visible;
          padding-block: clamp(1.5rem, 3vw, 2.5rem);
        }
        .marquee::before,
        .marquee::after {
          content: "";
          position: absolute;
          top: 0;
          z-index: 1;
          width: clamp(2rem, 8vw, 8rem);
          height: 100%;
          pointer-events: none;
        }
        .marquee::before {
          left: 0;
          background: linear-gradient(to right, var(--background), transparent);
        }
        .marquee::after {
          right: 0;
          background: linear-gradient(to left, var(--background), transparent);
        }
        .marquee-track {
          display: flex;
          align-items: center;
          gap: 0;
          width: max-content;
          will-change: transform;
          backface-visibility: hidden;
          animation: marquee 80s linear infinite;
        }
        .marquee-group {
          display: flex;
          align-items: center;
          gap: clamp(2.5rem, 7vw, 7rem);
          padding-right: clamp(2.5rem, 7vw, 7rem);
          flex: 0 0 auto;
        }
        .partner-logo-frame {
          display: grid;
          place-items: center;
          width: clamp(7rem, 13vw, 10.5rem);
          height: clamp(5.75rem, 9vw, 7.75rem);
          padding: 0.4rem;
          flex: 0 0 auto;
          overflow: visible;
        }
        .partner-logo {
          display: block;
          max-width: 100%;
          max-height: calc(100% - 0.5rem);
          width: auto;
          height: auto;
          object-fit: contain;
          object-position: center;
          opacity: 0.95;
        }
      `}</style>

      <main className="bg-background">
        {/* SECTION 1: Hero */}
        <section className="relative flex min-h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden border-b border-border/10">
          <div 
            className={`absolute inset-0 z-0 pointer-events-none ${gridOpacity}`}
            style={{
              backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          
          <div className="opacity-40 sm:opacity-50 md:opacity-100">
            <TetrisBlocksBackground />
          </div>
          
          <div className="relative section-container z-10 flex flex-col items-center text-center py-10 sm:py-12 md:py-16 lg:py-20">
            <div className="relative z-10 max-w-4xl mx-auto space-y-6">
              <img
                src={isDarkMode ? mscLogoFooterWhite : mscLogoFooterBlack}
                alt="Microsoft Student Community - NU Laguna"
                className="mx-auto h-14 w-auto sm:h-16 md:h-20 lg:h-24"
              />
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight leading-none">
                Helping You<br />
                <span className="inline-flex items-center text-left">
                  <span className={`${TYPING_WORDS[currentWordIndex].color}`}>#</span>
                  <span className={`inline-block ${TYPING_WORDS[currentWordIndex].color}`}>{displayText}</span>
                  <span className="inline-block h-[0.8em] w-[3px] animate-blink bg-foreground ml-1" />
                  <span className="text-foreground ml-1">More</span>
                </span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 px-4 sm:px-0">
                We bring together passionate Nationalians to learn, innovate, and make a difference using Microsoft tools and technology.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                {isLoggedIn ? (
                  <Button size="lg" className="min-w-[150px] rounded-none btn-primary font-bold" onClick={handleJoinEvent}>Join an event</Button>
                ) : (
                  <Button size="lg" className="min-w-[150px] rounded-none btn-primary font-bold" onClick={handleSignIn}>Sign in</Button>
                )}
                <Button size="lg" variant="outlineInfo" className="min-w-[150px] rounded-none font-bold" onClick={handleExploreMore}>Explore more</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Brand logo scroller */}
        <section className="py-8 sm:py-12 md:py-16 border-b border-border">
          <div className="section-container">
            <div className="marquee">
              <div className="marquee-track" aria-label="Partner logos">
                {[0, 1].map((groupIndex) => (
                  <div className="marquee-group" key={groupIndex} aria-hidden={groupIndex === 1}>
                    {logoSet.map((p, i) => (
                      <div className="partner-logo-frame" key={`${p.id}-${groupIndex}-${i}`}>
                        <img
                          src={getPartnerLogoSrc(p.logo)}
                          alt={p.name}
                          className="partner-logo"
                          onError={(event) => {
                            if (event.currentTarget.dataset.fallbackLogo !== 'true') {
                              event.currentTarget.dataset.fallbackLogo = 'true';
                              event.currentTarget.src = p.logo;
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Community introduction - Side-by-Side (Text Left, Video Right) */}
        <section id="explore" className="w-full bg-secondary/50 section-padding-lg flex justify-center border-b border-border">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left Side: Text Content */}
              <div className="space-y-6 text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none gradient-text uppercase">
                  WHO WE ARE
                </h1>
                
                <CardDescription className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  We're a community of curious, creative, and ambitious students pushing ourselves to learn, build, and actually do something with what we know. So we made something. MSC – NU Laguna is for students who want to learn more, try more, build more, achieve more, and figure stuff out together.
                </CardDescription>
                <CardDescription className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  We run workshops, teach each other new things, throw events we actually care about, and work on projects we'd want in our own portfolios — all while using the tools (yes, our Microsoft 365 accounts) we already have.
                </CardDescription>
                <CardDescription className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  We're also part of a global student movement supported by Microsoft, but we're not boxed in. Microsoft tools are just the start.
                </CardDescription>
              </div>

              {/* Right Side: Video Player */}
              <div className="w-full">
                <VideoPlayer 
                  src="https://youtu.be/1hsi0cIN-fo"
                  title="MSC NU Laguna - Who We Are"
                />
              </div>

            </div>
          </div>
        </section>

        {/* Mascot section - Tight Max Width Container to fix wide stretching */}
        <section className="relative z-10 w-full bg-background flex justify-center border-b border-border overflow-hidden py-8 sm:py-10">
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              
              {/* Mascot Image */}
              <div className="shrink-0 flex justify-center items-end">
                <img
                  src={mikeMascot}
                  alt="Mike, MSC - NU Laguna's official mascot"
                  className="h-52 sm:h-64 md:h-72 lg:h-80 w-auto object-contain object-bottom pointer-events-none"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-4 max-w-xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-primary">
                  Hi! I&apos;m <span className="underline decoration-4 underline-offset-4 decoration-sky-500">Mike</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">
                  I am MSC - NU Laguna&apos;s official mascot and I represent the curiosity, creativity, and ambition of every Nationalian growing with the community.
                </p>
                <div className="pt-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-auto h-9 px-4 rounded-none border border-input bg-transparent font-bold text-foreground hover:bg-sky-500 hover:text-white hover:border-sky-500 text-xs sm:text-sm transition-colors" 
                    onClick={handleMeetMembers}
                  >
                    Meet the team
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Member benefits grid */}
        <section className="w-full section-padding-lg bg-secondary flex justify-center border-b border-border">
          <div className="section-container text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none inline-block gradient-text uppercase">
              MEMBER PERKS
            </h1>
            <p className="mt-3 text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto text-center mb-12">
              From certifications to career connections, being part of MSC opens doors you didn't know existed.
            </p>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                {Array(6).fill(null).map((_, i) => <PerkCardSkeleton key={i} />)}
              </div>
            )}

            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                {perks.map((perk, i) => (
                  <MemberPerkCard key={i} {...perk} />
                ))}
              </div>
            )}

            <div className="text-center">
              <Button size="lg" variant="outline" className="rounded-none border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground" onClick={viewPerks}>
                View all perks
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
