'use client'

import { Button } from '@/components/ui/button';
import { BlinkingCursor } from '@/components/ui/custom/BlinkingCursor';
import { TetrisBlocksBackground } from '@/components/home/TetrisBlocksBackground';
import { VideoPlayer } from '@/components/ui/custom/VideoPlayer';
import { MemberPerksGrid } from '@/components/ui/custom/MemberPerkCard';
import { PastActivitiesCarousel } from '@/components/ui/carousel';
import { useTypingAnimation, type TypingWord } from '@/hooks/useTypingAnimation';
import { useTheme } from '@/context/ThemeContext';
import mscLogo from '@/assets/logos/msclogo.svg';
import '@/styles/home.css';

// Section 4 Abstract Image
import abstracticon from '@/assets/shapes/abstracticons.svg';

// Typing animation words - stable constant to prevent effect re-runs
const TYPING_WORDS: TypingWord[] = [
  { text: 'Achieve', color: 'text-[var(--color-brand-blue)]' },    // #00A2ED
  { text: 'Build', color: 'text-[var(--color-brand-green)]' },     // #6AAC0E
  { text: 'Learn', color: 'text-[var(--color-brand-red)]' },       // #F04E1F
  { text: 'Create', color: 'text-[var(--color-brand-yellow)]' },   // #FFBB00
];

// Past activities data - stable constant to prevent array recreation on every render
const PAST_ACTIVITIES_DATA = [
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

// Member perks data - stable constant to prevent array recreation on every render
const MEMBER_PERKS_DATA = [
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

export default function Home() {
  const { currentWordIndex, displayText } = useTypingAnimation(TYPING_WORDS);
  const { isDarkMode } = useTheme();
  const gridOpacity = isDarkMode ? 'opacity-10' : 'opacity-20';

  return (
    <main className="bg-background">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden flex justify-center border-b border-border/10">
        {/* Grid Background */}
        <div className={`absolute inset-0 z-0 pointer-events-none ${gridOpacity} grid-background`} />
        
        {/* Tetris Background - Animated blocks with shape variants and 4s transitions */}
        <TetrisBlocksBackground />
        
        <div className="relative section-container md:py-32 py-20 flex flex-col items-center text-center z-10 section-padding">
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <p className="text-sm md:text-base font-semibold tracking-widest text-foreground uppercase">MICROSOFT STUDENT COMMUNITY | NU LAGUNA</p>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">Helping You<br /><span className="inline-flex items-center text-left"><span className={`${TYPING_WORDS[currentWordIndex].color}`}>#</span><span className={`inline-block ${TYPING_WORDS[currentWordIndex].color}`}>{displayText}</span><span className="text-foreground ml-1">More<BlinkingCursor className="ml-1" /></span></span></h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">The Microsoft Student Community at NU Laguna empowers students to learn, connect, and build the future with lorem ipsum dolor.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button size="lg" className="btn-primary min-w-[150px]">Join an Event</Button>
              <Button size="lg" variant="outline" className="btn-outline-blue min-w-[150px]">Explore More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND LOGO SCROLLER - Marquee */}
      <section className="w-full py-12 md:py-16 border-b border-border bg-background dark:bg-card flex justify-center overflow-hidden">
        <div className="w-full max-w-[1700px] flex flex-nowrap overflow-hidden logo-scroller-mask">
          <div className="flex items-center justify-start whitespace-nowrap shrink-0 animate-marquee">
            {[...Array(6)].map((_, i) => (
              <img key={`logo-1-${i}`} src={mscLogo} alt="MSC Logo" className="logo-scroller-item" />
            ))}
          </div>
          <div className="flex items-center justify-start whitespace-nowrap shrink-0 animate-marquee" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <img key={`logo-2-${i}`} src={mscLogo} alt="MSC Logo" className="logo-scroller-item" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHO WE ARE SECTION */}
      <section className="w-full bg-secondary/50 flex justify-center section-padding-lg border-b border-border/30">
        <div className="section-container">
          <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold gradient-text" >WHO WE ARE</h2></div>
          
          <div className="w-full mb-12 relative px-4 sm:px-6 md:px-8 aspect-video rounded-none overflow-hidden bg-muted dark:bg-card">
            <VideoPlayer 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="MSC NU Laguna - Who We Are"
              className="w-full h-full rounded-none"
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
      <section className="w-full section-padding-md bg-background dark:bg-card flex justify-center border-b border-border">
        <div className="section-container grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center">
          <div className="aspect-square md:aspect-[4/3] rounded-none overflow-hidden relative flex items-center justify-center">
            <img src={abstracticon} alt="Abstract Icon" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:pl-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-brand-blue)] leading-tight">We're here to help curious, creative, and ambitious Nationalians</h2>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--color-brand-blue)]"> #AchieveMore</p>
            <Button size="lg" variant="outline" className="btn-outline-green mt-1 sm:mt-2 md:mt-3">Meet Our Members</Button>
          </div>
        </div>
      </section>

      {/* 5. MEMBER PERKS SECTION */}
      <section className="w-full section-padding-lg bg-secondary dark:bg-card flex justify-center border-b border-border">
        <div className="section-container">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">MEMBER PERKS</h2><p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">From certifications to career connections, being part of MSC opens doors you didn't know existed.</p></div>
          <MemberPerksGrid perks={MEMBER_PERKS_DATA} />
          <div className="text-center"><Button size="lg" variant="outline" className="btn-outline-blue">View All Perks</Button></div>
        </div>
      </section>

      {/* 6. PAST ACTIVITIES SECTION */}
      <section className="w-full section-padding-lg bg-background dark:bg-card flex justify-center border-b border-border">
        <div className="section-container text-center">
          <div className="mb-16"><h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">PAST ACTIVITIES</h2><p className="text-base md:text-lg text-muted-foreground">A look at some of the events that brought our community together.</p></div>
          <PastActivitiesCarousel activities={PAST_ACTIVITIES_DATA} />
        </div>
      </section>

    </main>
  );
}