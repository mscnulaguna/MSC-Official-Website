import { Button } from '@/components/ui/button';
import { TetrisBlocksBackground } from '@/components/home/TetrisBlocksBackground';
import { VideoPlayer } from '@/components/ui/custom/VideoPlayer';
import { Card, CardHeader, CardContent, CardTitle, CardDescription} from '@/components/ui/card';
// import { PastActivitiesCarousel } from '@/components/ui/carousel';
import { useTypingAnimation, type TypingWord } from '@/hooks/useTypingAnimation';
import { useTheme } from '@/context/ThemeContext'; // dark mode support
// import mscLogo from '@/assets/logos/msclogo.svg';
import abstracticon from '@/assets/shapes/abstracticons.svg';
import { getApiBaseUrl } from '@/lib/api';
import '@/styles/home.css';
import { useEffect, useState, type JSX } from 'react';
import { useAuth } from '@/context/authContext';
import { useNavigate } from 'react-router-dom';


import BFC from "@/assets/logos/BFC Real.jpg";
import CCC1 from "@/assets/logos/CCC Computer Science Society.png";
import CCC2 from "@/assets/logos/CCC Information Technology Society.png";
import COL from "@/assets/logos/Council of Leaders.png";
import DA from "@/assets/logos/DataSense Analytics.jpg";
import DEV from "@/assets/logos/DEVCON Laguna.png";
import AZ from "@/assets/logos/Microsoft Azure Community PH.png";
import MC from "@/assets/logos/Microsoft.png";
import OT from "@/assets/logos/OpenText.png";
import PUP from "@/assets/logos/PUP Microsoft Student Community.png";
import SCS from "@/assets/logos/School of Computer Studies - Student Council.png";
import TCB from "@/assets/logos/Techbayanihan.png";

const API_BASE = getApiBaseUrl();

// Types for API data
interface Perk {
  id?: string;
  title: string;
  description: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  venue: string;
  capacity?: number;
  registered?: number;
  coverImage: string;
  registrationOpen: boolean;
  tag?: string;
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
  bio: string;
}

// Activity type for carousel component compatibility
// interface Activity {
//   title: string;
//   description: string;
//   image: string;
//   date: string;
//   tag: string;
// }

// Snowflake icon
function SnowflakeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 151 151" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_479_1074" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="151" height="151">
        <path d="M0 0H150.805V150.458H0V0Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_479_1074)">
        <path fillRule="evenodd" clipRule="evenodd" d="M69.2002 0C73.334 0 77.4715 0 81.6054 0C81.5545 14.3731 81.6054 28.748 81.7616 43.1212C87.3074 29.6293 92.9421 16.1866 98.6659 2.79285C102.077 4.18837 105.489 5.58389 108.902 6.97941C109.421 7.08843 109.732 7.39734 109.832 7.91157C104.333 21.2126 98.904 34.5009 93.5472 47.7747C103.783 37.5373 114.018 27.2998 124.254 17.0624C127.35 19.7971 130.298 22.6935 133.094 25.748C122.915 36.0854 112.679 46.3737 102.387 56.6148C115.794 51.3362 129.184 45.9067 142.554 40.3283C143.012 40.6227 143.323 41.0352 143.484 41.5694C144.665 44.593 145.905 47.593 147.206 50.5657C147.429 51.0673 147.378 51.5324 147.051 51.9631C133.483 57.4852 119.939 63.0691 106.419 68.7148C121.203 68.8692 135.989 68.9219 150.773 68.8692C150.773 72.9031 150.773 76.9352 150.773 80.9673C136.196 80.9165 121.618 80.9673 107.039 81.1236C120.485 86.6384 133.874 92.275 147.206 98.0297C146.066 101.971 144.567 105.796 142.708 109.508C129.269 103.87 115.828 98.3386 102.387 92.911C112.743 103.167 122.978 113.506 133.094 123.934C130.303 126.725 127.51 129.518 124.719 132.311C124.409 132.516 124.1 132.516 123.789 132.311C113.804 122.322 103.826 112.345 93.8579 102.373C99.033 115.575 104.357 128.76 109.832 141.927C109.786 142.167 109.683 142.374 109.521 142.546C105.891 144.016 102.271 145.516 98.6659 147.046C92.9421 133.652 87.3074 120.207 81.7616 106.717C81.6054 121.297 81.5545 135.878 81.6054 150.458C77.4715 150.458 73.334 150.458 69.2002 150.458C69.251 135.878 69.2002 121.297 69.0439 106.717C63.4945 120.198 57.8598 133.641 52.1396 147.046C48.5345 145.516 44.9149 144.016 41.2843 142.546C41.1117 142.323 41.0081 142.063 40.9736 141.772C46.563 128.457 51.9906 115.118 57.2583 101.753C47.0027 112.01 36.7671 122.248 26.5514 132.465C23.5151 129.738 20.5678 126.894 17.7113 123.934C27.758 113.577 37.89 103.339 48.1075 93.2217C34.7483 98.4894 21.4109 103.917 8.09717 109.508C6.569 106.119 5.06991 102.707 3.59989 99.2708C3.30189 98.1151 3.76706 97.4428 4.99541 97.2557C18.0221 91.8771 31.0487 86.5003 44.0754 81.1236C29.3952 80.9673 14.7132 80.9165 0.032959 80.9673C0.032959 76.9352 0.032959 72.9031 0.032959 68.8692C14.8167 68.9219 29.6023 68.8692 44.3861 68.7148C30.8179 63.1908 17.2734 57.6069 3.75434 51.9631C3.42727 51.5324 3.37639 51.0673 3.59989 50.5657C4.91727 47.0188 6.46724 43.6063 8.25162 40.3283C21.4146 45.8032 34.5975 51.129 47.7986 56.3059C37.9591 46.1539 27.9815 36.0709 17.8676 26.0588C17.6605 25.8516 17.6605 25.6445 17.8676 25.4391C20.6677 22.5336 23.5623 19.7408 26.5514 17.0624C36.6835 27.1963 46.8155 37.3301 56.9476 47.464C51.7725 34.2611 46.4485 21.0763 40.9736 7.91157C41.0736 7.39734 41.3843 7.08843 41.904 6.97941C45.3164 5.58389 48.7289 4.18837 52.1396 2.79285C57.9234 16.2647 63.5581 29.811 69.0439 43.4319C69.2002 28.9552 69.251 14.4767 69.2002 0Z" fill="currentColor"/>
      </g>
    </svg>
  );
}

// Perk card skeleton loader
const PerkCardSkeleton = (): JSX.Element => (
  <Card className="rounded-none border-border animate-pulse">
    <CardHeader>
      <div className="w-10 h-10 bg-muted rounded mb-4" />
      <div className="h-6 w-32 bg-muted rounded" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
    </CardContent>
  </Card>
);

// Activity card skeleton loader
// const ActivityCardSkeleton = (): JSX.Element => (
//   <div className="h-80 w-full bg-muted animate-pulse rounded-none" />
// );

// CUSTOMIZED: Member perk card component - Single-use for home page perks grid
function MemberPerkCard({ title, description }: Perk) {
  return (
    <Card className="border-border text-left">
      <CardHeader>
        <div className="text-primary mb-3">
          <SnowflakeIcon />
        </div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="-mt-3">
        <CardDescription className="text-xs sm:text-sm">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

// Fallback data
const FALLBACK_PERKS: Perk[] = [
  {
    title: "Exclusive Workshops",
    description: "Learn cutting-edge skills and technologies through hands-on sessions led by industry experts and community mentors."
  },
  {
    title: "Career Opportunities",
    description: "Connect with Microsoft recruiters, internship programs, and exclusive job opportunities for MSC members."
  },
  {
    title: "Certifications",
    description: "Earn industry-recognized certifications through Microsoft Learn paths and exam vouchers provided to members."
  },
  {
    title: "Networking Events",
    description: "Build meaningful connections with peers, mentors, and professionals in tech at our exclusive networking events."
  },
  {
    title: "Project Showcase",
    description: "Display your portfolio projects and get feedback from experienced developers and potential employers."
  },
  {
    title: "Resource Library",
    description: "Access exclusive learning materials, tutorials, and documentation curated for our community members."
  }
];

// Fallback partners data
const FALLBACK_PARTNERS: Partner[] = [
  {
    id: "fallback-0",
    name: "MSC NU Laguna",
    logo: MC,
    url: "",
    bio: "The Microsoft Student Community chapter at NU Laguna, fostering tech innovation among students.",
  },
  {
    id: "fallback-1",
    name: "Google Developer Student Club – TIP Manila",
    logo: TCB,
    url: "",
    bio: "A student-led community at TIP Manila bridging the gap between theory and practice in software development.",
  },
  {
    id: "fallback-2",
    name: "",
    logo: OT,
    url: "",
    bio: "Empowering PLM students with cloud computing skills and AWS certifications.",
  },
  {
    id: "fallback-3",
    name: "ACM Student Chapter – DLSU",
    logo: AZ,
    url: "",
    bio: "The Association for Computing Machinery chapter at De La Salle University, promoting excellence in computing.",
  },
  {
    id: "fallback-4",
    name: "Junior Philippine Computer Society – UST",
    logo: DEV,
    url: "",
    bio: "Uniting future IT professionals at UST through competitions, seminars, and community outreach.",
  },
  {
    id: "fallback-5",
    name: "Cybersecurity Guild – FEU Tech",
    logo: DA,
    url: "",
    bio: "A student organization at FEU Tech dedicated to ethical hacking, digital forensics, and cybersecurity awareness.",
  },
  {
    id: "fallback-6",
    name: "Data Science Society – Ateneo",
    logo: BFC,
    url: "",
    bio: "Cultivating data literacy and analytics skills among Ateneo students through workshops and research.",
  },
  {
    id: "fallback-7",
    name: "Open Source Collective – PUP",
    logo: COL,
    url: "",
    bio: "A PUP organization championing open-source software contributions and collaborative development.",
  },
  {
    id: "fallback-8",
    name: "UI/UX Design Club – Mapúa",
    logo: CCC1,
    url: "",
    bio: "Inspiring Mapúa students to craft intuitive and beautiful digital experiences through design thinking.",
  },
  {
    id: "fallback-9",
    name: "Robotics & AI League – UPLB",
    logo: CCC2,
    url: "",
    bio: "A multidisciplinary org at UPLB exploring robotics, machine learning, and intelligent systems.",
  },
  {
    id: "fallback-10",
    name: "Game Dev Guild – Adamson University",
    logo: PUP,
    url: "",
    bio: "Where Adamson students turn game ideas into reality — from pixel art to full game jam releases.",
  },
  {
    id: "fallback-11",
    name: "FinTech Innovators Club – CEU",
    logo: SCS,
    url: "",
    bio: "Exploring the intersection of finance and technology at CEU through projects, talks, and industry mentorship.",
  },
];

const FALLBACK_ACTIVITY_IMAGE1 = "../../assets/activity-fallback/org.jpg";
const FALLBACK_ACTIVITY_IMAGE = "../../assets/activity-fallback/org.jpg";

const FALLBACK_EVENTS: Event[] = [
  {
    id: "1",
    coverImage: FALLBACK_ACTIVITY_IMAGE1,
    tag: "Org Sign-Up",
    title: "Org Sign-Up",
    date: "July 17, 2025",
    description: "Org sign-up event for students to join MSC NU Laguna for the upcoming school year.",
    venue: "NU Laguna Campus",
    registrationOpen: false
  },
  {
    id: "2",
    coverImage: FALLBACK_ACTIVITY_IMAGE,
    tag: "WORKSHOP",
    title: "Web Dev Workshop",
    date: "March 10, 2026",
    description: "Learn React and build modern web apps with hands-on coding sessions.",
    venue: "Computer Lab",
    registrationOpen: true
  },
  {
    id: "3",
    coverImage: FALLBACK_ACTIVITY_IMAGE,
    tag: "PANEL",
    title: "Career Session",
    date: "March 8, 2026",
    description: "Microsoft careers and internships panel with industry professionals.",
    venue: "Auditorium",
    registrationOpen: false
  },
  {
    id: "4",
    coverImage: FALLBACK_ACTIVITY_IMAGE,
    tag: "MEETUP",
    title: "Community Meetup",
    date: "March 5, 2026",
    description: "Networking and social gathering to connect with fellow community members.",
    venue: "Student Center",
    registrationOpen: true
  },
  {
    id: "5",
    coverImage: FALLBACK_ACTIVITY_IMAGE,
    tag: "WORKSHOP",
    title: "AI Workshop",
    date: "March 1, 2026",
    description: "Introduction to AI and machine learning with practical examples.",
    venue: "Tech Lab",
    registrationOpen: true
  },
  {
    id: "6",
    coverImage: FALLBACK_ACTIVITY_IMAGE,
    tag: "HACKATHON",
    title: "Hackathon",
    date: "February 28, 2026",
    description: "24-hour coding competition and collaboration to build amazing projects.",
    venue: "Innovation Hub",
    registrationOpen: false
  }
];

// Typing animation words with design token colors
const TYPING_WORDS: TypingWord[] = [
  { text: 'Achieve', color: 'text-primary' },    
  { text: 'Build', color: 'text-success' },     
  { text: 'Learn', color: 'text-destructive' },       
  { text: 'Create', color: 'text-warning' },   
];

// Helper to convert Event API data to Activity component format
// function eventToActivity(event: Event): Activity {
//   return {
//     title: event.title,
//     description: event.description,
//     image: event.coverImage,
//     date: event.date,
//     tag: event.tag || 'EVENT'
//   };
// }

// Home page
export default function Home(): JSX.Element {
  const { currentWordIndex, displayText } = useTypingAnimation(TYPING_WORDS);
  const { isDarkMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const gridOpacity = isDarkMode ? 'opacity-10' : 'opacity-20';

  const [perks] = useState<Perk[]>(FALLBACK_PERKS);
  // const [events, setEvents] = useState<Event[]>(FALLBACK_EVENTS);
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate('/login')
  }
  const handleJoinEvent = () => {
    navigate('/events')
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

        // const eventsData = await eventsRes.json();
        const partnersData = await partnersRes.json();

        // setEvents(eventsData.data);
        setPartners(partnersData.data);
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
        /* Marquee Animation - 12x duplication for visual fullness */
        /* With 12x partners, the marquee fills more horizontal space and looks less sparse */
        /* Scroll by 1/12th of track width so seamless loop is imperceptible */
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(-100% / 12), 0, 0);
          }
        }
        .marquee-track {
          display: flex;
          gap: 7rem;
          width: max-content;
          will-change: transform;
          backface-visibility: hidden;
          animation: marquee 30s linear infinite;
        }
        @media (min-width: 1024px) {
          .marquee-track {
            gap: 9rem;
          }
        }
      `}</style>
      <main className="bg-background">
      {/* SECTION 1: Hero - typing animation + Tetris background */}
      <section className="relative w-full overflow-hidden flex justify-center border-b border-border/10">
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
        
        <div className="relative section-container flex flex-col items-center text-center z-10 py-16 sm:py-20 md:py-28 lg:py-36">
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <p className="text-xs sm:text-sm md:text-base font-semibold">MICROSOFT STUDENT COMMUNITY - NU LAGUNA</p>
            
            <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight">Helping You<br /><span className="inline-flex items-center text-left"><span className={`${TYPING_WORDS[currentWordIndex].color}`}>#</span><span className={`inline-block ${TYPING_WORDS[currentWordIndex].color}`}>{displayText}</span><span className="inline-block h-[0.8em] w-[2px] animate-blink bg-foreground ml-1" /><span className="text-foreground ml-1">More
            </span></span></h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 px-4 sm:px-0">The Microsoft Student Community at NU Laguna empowers students to learn, connect, and build the future.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              {isLoggedIn ? (
                <Button size="lg" className="min-w-[150px] btn-primary" onClick={handleJoinEvent}>Join an Event</Button>
              ):(
                <Button size="lg" className="min-w-[150px] btn-primary" onClick={handleSignIn}>Sign In</Button>
              )}
              <Button size="lg" variant="outlineInfo" className="min-w-[150px]" onClick={handleExploreMore}>Explore More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand logo scroller - plain marquee infinite loop */}
      <section className="py-8 sm:py-12 md:py-16 border-b border-border">
        <div className="section-container overflow-hidden">
          
          <div className="marquee">
            <div className="marquee-track">
              {[...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners].map((p, i) => (
                <img
                  key={`${p.id}-${i}`}
                  src={p.logo}
                  alt={p.name}
                  className="h-16 sm:h-25 md:h-30 lg:h-34 lg:min-w-[150px] xl:min-w-[180px] object-contain opacity-80 hover:opacity-100 transition"
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Community introduction with video and mission description */}
      <section id="explore" className="w-full bg-secondary/50 section-padding-lg flex justify-center border-b border-border/30">
        <div className="section-container text-center">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold inline-block gradient-text">
            WHO WE ARE
          </h1>
          
          <div className="w-full mt-8 mb-12">
            <VideoPlayer 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="MSC NU Laguna - Who We Are"
            />
          </div>

          <div className="section-container text-center space-y-6">
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
        </div>
      </section>

      {/* Member community highlight with branded call-to-action */}
      <section className="w-full section-padding-md bg-background flex justify-center border-b border-border">
        <div className="section-container grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:gap-8 items-center">
          <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden relative flex items-center justify-center">
            <img src={abstracticon} alt="Abstract Icon" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1 sm:space-y-3 md:space-y-5 lg:pl-6">
            <Card className="border-0 bg-transparent p-0">
              <CardContent className="p-0">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary leading-tight">
                  We're here to help curious, creative, and ambitious students
                </CardTitle>
                <CardDescription className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mt-4">
                  #AchieveMore
                </CardDescription>
              </CardContent>
            </Card>
            <Button size="lg" variant="outlineSuccess" className="mt-1 sm:mt-2 md:mt-3" onClick={handleMeetMembers}>Meet Our Members</Button>
          </div>
        </div>
      </section>

      {/* Member benefits grid with perks cards */}
      <section className="w-full section-padding-lg bg-secondary flex justify-center border-b border-border">
        <div className="section-container text-center">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold inline-block gradient-text">
            MEMBER PERKS
          </h1>
          <p className="mt-3 text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto text-center mb-16">
            From certifications to career connections, being part of MSC opens doors you didn't know existed.
          </p>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {Array(6).fill(null).map((_, i) => <PerkCardSkeleton key={i} />)}
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {perks.map((perk, i) => (
                <MemberPerkCard key={i} {...perk} />
              ))}
            </div>
          )}

          <div className="text-center"><Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={viewPerks}>View All Perks</Button></div>
        </div>
      </section>

      {/* Past events carousel showcasing community activities */}
      {/* <section className="w-full section-padding-lg bg-background flex justify-center border-b border-border">
        <div className="section-container text-center">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold inline-block gradient-text">
            PAST ACTIVITIES
          </h1>
          <p className="mt-3 text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground mb-16">
            A look at some of the events that brought our community together.
          </p>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(null).map((_, i) => <ActivityCardSkeleton key={i} />)}
            </div>
          )}

          {!loading && <PastActivitiesCarousel activities={events.map(eventToActivity)} />}
        </div>
      </section> */}

    </main>
    </>
  );
}