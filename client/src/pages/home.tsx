import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { CarouselRow } from '@/components/ui/carousel';
import { BlinkingCursor } from '@/components/ui/custom/BlinkingCursor';
import { HeroShapes, POSITION_SETS } from '@/components/ui/custom/positions';
import { VideoPlayer } from '@/components/ui/custom/VideoPlayer';
import { MemberPerkCard } from '@/components/ui/custom/MemberPerkCard';
import { EventHoverCard } from '@/components/ui/custom/EventHoverCard';
import mscLogo from '@/assets/logos/msclogo.svg';
import '@/styles/home.css';

// Section 4 Abstract Image
import abstracticon from '@/assets/shapes/abstacticons.svg';

// Typing animation words - stable constant to prevent effect re-runs
const TYPING_WORDS = [
  { text: 'Achieve', color: 'text-[#00A4EF]' }, // Blue
  { text: 'Build', color: 'text-[#7FBA00]' },   // Green
  { text: 'Learn', color: 'text-[#F25022]' },   // Orange/Red
  { text: 'Create', color: 'text-[#FFB900]' },  // Yellow
];

// Responsive carousel wrapper that shows different counts based on screen size
function ResponsiveCarouselRow({ children, className }: { children: React.ReactNode[], className?: string }) {
  const isMobile = useIsMobile();
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);
  
  let visibleCount = 4; // Desktop
  if (isMobile) {
    visibleCount = 1; // Mobile
  } else if (isTablet) {
    visibleCount = 2; // Tablet
  }
  
  return (
    <CarouselRow visibleCount={visibleCount} className={className}>
      {children}
    </CarouselRow>
  );
}

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // SVG Position State - Each shape randomly teleports between positions
  const [shapePositions, setShapePositions] = useState<{ [key: number]: number }>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  });

  // Effect for typing animation
  useEffect(() => {
    const currentWord = TYPING_WORDS[currentWordIndex].text;
    let index = displayText.length;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isTyping) {
      // Typing phase
      if (index < currentWord.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentWord.slice(0, index + 1));
        }, 100); // Type speed: 100ms per letter
      } else {
        // Word fully typed, pause then start backspacing
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 1500); // Pause for 1.5 seconds after typing complete
      }
    } else {
      // Backspacing phase
      if (index > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentWord.slice(0, index - 1));
        }, 80); // Backspace speed: 80ms per letter
      } else {
        // Word fully erased, move to next word and start typing
        setCurrentWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        setIsTyping(true);
      }
    }

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [displayText, isTyping, currentWordIndex]);

  // Effect for SVG position changes (teleportation)
  useEffect(() => {
    const interval = setInterval(() => {
      setShapePositions((prev) => {
        const newPositions = { ...prev };
        // Randomly teleport each shape to a new position
        for (let i = 1; i <= 9; i++) {
          const positionCount = POSITION_SETS[i]?.length || 4;
          newPositions[i] = Math.floor(Math.random() * positionCount);
        }
        return newPositions;
      });
    }, 4000); // Change position every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-background">
      
      {/* 1. HERO SECTION */}
      {/* Changed to max-w-1700px constraint wrapper with centered content */}
      <section className="relative w-full overflow-hidden flex justify-center border-b border-border/10">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Hero Shapes - SVG Tetris pieces with random teleportation */}
        <HeroShapes shapePositions={shapePositions} />
        
        <div className="relative max-w-[1700px] w-full px-4 py-20 sm:px-8 md:px-12 md:py-32 flex flex-col items-center text-center z-10">

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <p className="text-sm md:text-base font-semibold tracking-widest text-foreground uppercase">
              MICROSOFT STUDENT COMMUNITY | NU LAGUNA
            </p>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Helping You
              <br />
              <span className="inline-flex items-center text-left">
                <span className={`${TYPING_WORDS[currentWordIndex].color}`}>#</span>
                <span className={`inline-block ${TYPING_WORDS[currentWordIndex].color}`}>
                  {displayText}
                </span>
                <span className="text-foreground ml-1">More<BlinkingCursor className="ml-1" /></span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
              The Microsoft Student Community at NU Laguna empowers students to learn, connect, and build the future with lorem ipsum dolor.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button size="lg" className="bg-[#00A2ED] hover:brightness-90 text-white min-w-[150px]">
                Join an Event
              </Button>
              <Button size="lg" variant="outline" className="border-[#00A2ED] text-[#00A2ED] hover:bg-[#00A2ED] hover:text-white min-w-[150px]">
                Explore More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND LOGO SCROLLER - Marquee */}
      <section className="w-full py-12 md:py-16 border-b border-border bg-background dark:bg-card flex justify-center overflow-hidden">
        <div className="w-full max-w-[1700px] flex flex-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex items-center justify-start whitespace-nowrap shrink-0 animate-marquee">
            {[...Array(6)].map((_, i) => (
              <img key={`logo-1-${i}`} src={mscLogo} alt="MSC Logo" className="h-20 md:h-24 mx-12 md:mx-16 transition-transform duration-200 ease-in-out hover:scale-[1.15] cursor-pointer" />
            ))}
          </div>
          <div className="flex items-center justify-start whitespace-nowrap shrink-0 animate-marquee" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <img key={`logo-2-${i}`} src={mscLogo} alt="MSC Logo" className="h-20 md:h-24 mx-12 md:mx-16 transition-transform duration-200 ease-in-out hover:scale-[1.15] cursor-pointer" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHO WE ARE SECTION */}
      <section className="w-full bg-secondary/50 flex justify-center py-20 px-4 sm:px-8 md:px-12 border-b border-border/30">
        <div className="max-w-[1700px] w-full mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-[linear-gradient(to_right,#00A4EF,#7FBA00,#F25022,#FFB900)]">
              WHO WE ARE
            </h2>
          </div>
          
          <div className="w-full mb-12 relative px-4 sm:px-6 md:px-8 aspect-video rounded-2xl overflow-hidden bg-muted dark:bg-card">
            <VideoPlayer 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="MSC NU Laguna - Who We Are"
              className="w-full h-full rounded-2xl"
            />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              We're a community of curious, creative, and ambitious students pushing ourselves to learn, build, and actually do something with what we know. So we made something. MSC – NU Laguna is for students who want to learn more, try more, build more, achieve more, and figure stuff out together.
            </p>
            <p>
              We run workshops, teach each other new things, throw events we actually care about, and work on projects we'd want in our own portfolios — all while using the tools (yes, our Microsoft 365 accounts) we already have.
            </p>
            <p>
              We're also part of a global student movement supported by Microsoft, but we're not boxed in. Microsoft tools are just the start.
            </p>
          </div>
        </div>
      </section>

      {/* 4. MEMBERS HIGHLIGHT SECTION */}
      <section className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-background dark:bg-card flex justify-center border-b border-border">
        <div className="max-w-[1700px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center">
          <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden relative flex items-center justify-center">
            <img src={abstracticon} alt="Abstract Icon" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:pl-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#00A4EF] leading-tight">
              We're here to help curious, creative, and ambitious Nationalians
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#00A4EF]">
              #AchieveMore
            </p>
            <Button size="lg" variant="outline" className="border-[#7FBA00] text-[#7FBA00] hover:bg-[#7FBA00] hover:text-white mt-1 sm:mt-2 md:mt-3 transition-colors">
              Meet Our Members
            </Button>
          </div>
        </div>
      </section>

      {/* 5. MEMBER PERKS SECTION */}
      <section className="w-full py-20 px-4 sm:px-8 md:px-12 bg-secondary dark:bg-card flex justify-center border-b border-border">
        <div className="max-w-[1700px] w-full mx-auto">
          {/* Member Perks Data - Customize each perk individually */}
          {(() => {
            const memberPerksData = [
              {
                icon: "✦",
                title: "Exclusive Workshops",
                description: "Learn cutting-edge skills and technologies through hands-on sessions led by industry experts and community mentors."
              },
              {
                icon: "🏆",
                title: "Career Opportunities",
                description: "Connect with Microsoft recruiters, internship programs, and exclusive job opportunities for MSC members."
              },
              {
                icon: "🎓",
                title: "Certifications",
                description: "Earn industry-recognized certifications through Microsoft Learn paths and exam vouchers provided to members."
              },
              {
                icon: "🤝",
                title: "Networking Events",
                description: "Build meaningful connections with peers, mentors, and professionals in tech at our exclusive networking events."
              },
              {
                icon: "💻",
                title: "Project Showcase",
                description: "Display your portfolio projects and get feedback from experienced developers and potential employers."
              },
              {
                icon: "📚",
                title: "Resource Library",
                description: "Access exclusive learning materials, tutorials, and documentation curated for our community members."
              }
            ];
            return (
              <>
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-[linear-gradient(to_right,#00A4EF,#7FBA00,#F25022,#FFB900)]">
                    MEMBER PERKS
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                    From certifications to career connections, being part of MSC opens doors you didn't know existed.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {memberPerksData.map((perk, i) => (
              <MemberPerkCard key={i} {...perk} />
            ))}
          </div>

                <div className="text-center">
                  <Button size="lg" variant="outline" className="border-[#00A2ED] text-[#00A2ED] hover:bg-[#00A2ED] hover:text-white transition-colors">
                    View All Perks
                  </Button>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* 6. PAST ACTIVITIES SECTION */}
      <section className="w-full py-20 px-4 sm:px-8 md:px-12 bg-background dark:bg-card flex justify-center border-b border-border">
        <div className="max-w-[1700px] w-full mx-auto text-center">
          {(() => {
            const pastActivitiesData = [
              {
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
                tag: "ASSEMBLY",
                title: "General Assembly 2026",
                date: "August 24, 2026",
                description: "Kick-off the academic year with updates, officer introductions, and org plans."
              },
              {
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop",
                tag: "WORKSHOP",
                title: "Web Dev Workshop",
                date: "March 10, 2026",
                description: "Learn React and build modern web apps with hands-on coding sessions."
              },
              {
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
                tag: "PANEL",
                title: "Career Session",
                date: "March 8, 2026",
                description: "Microsoft careers and internships panel with industry professionals."
              },
              {
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
                tag: "MEETUP",
                title: "Community Meetup",
                date: "March 5, 2026",
                description: "Networking and social gathering to connect with fellow community members."
              },
              {
                image: "https://images.unsplash.com/photo-1543269865-cbdf26cecb46?w=500&h=500&fit=crop",
                tag: "WORKSHOP",
                title: "AI Workshop",
                date: "March 1, 2026",
                description: "Introduction to AI and machine learning with practical examples."
              },
              {
                image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop",
                tag: "HACKATHON",
                title: "Hackathon",
                date: "February 28, 2026",
                description: "24-hour coding competition and collaboration to build amazing projects."
              }
            ];
            return (
              <>
                <div className="mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-[linear-gradient(to_right,#00A4EF,#7FBA00,#F25022,#FFB900)]">
                    PAST ACTIVITIES
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground">
                    A look at some of the events that brought our community together.
                  </p>
                </div>

                <ResponsiveCarouselRow className="max-w-[1500px] mx-auto pb-4">
                  {pastActivitiesData.map((activity, i) => (
              <div key={i} className="px-3" style={{ padding: '0 12px' }}>
                <EventHoverCard {...activity} />
                </div>
                  ))}
                </ResponsiveCarouselRow>
              </>
            );
          })()}
        </div>
      </section>

    </main>
  );
}