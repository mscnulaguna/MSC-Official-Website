// Landing page - hero, typing animation, events carousel, member perks

import { Button } from '@/components/ui/button';
import { TetrisBlocksBackground } from '@/components/home/TetrisBlocksBackground';
import { VideoPlayer } from '@/components/ui/custom/VideoPlayer';
import { MemberPerksGrid } from '@/components/ui/custom/MemberPerkCard';
import { PastActivitiesCarousel } from '@/components/ui/carousel';
import { useTypingAnimation, type TypingWord } from '@/hooks/useTypingAnimation';
import { useTheme } from '@/context/ThemeContext'; // dark mode support
import mscLogo from '@/assets/logos/msclogo.svg';
import abstracticon from '@/assets/shapes/abstracticons.svg';
import '@/styles/home.css';
import type { CSSProperties } from 'react';

// Brand gradient style for section headings - uses CSS variables from globals.css
const gradientStyle: CSSProperties = {
  background: 'linear-gradient(to right, var(--color-brand-blue) 0%, var(--color-brand-green) 33%, var(--color-brand-yellow) 66%, var(--color-brand-red) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// Reusable class patterns for consistent styling
const sectionPadding = 'py-20 md:py-40 px-4 sm:px-8 md:px-12';

// Typing animation words with brand colors
const TYPING_WORDS: TypingWord[] = [
  { text: 'Achieve', color: 'text-[var(--color-brand-blue)]' },    // #00A2ED
  { text: 'Build', color: 'text-[var(--color-brand-green)]' },     // #6AAC0E
  { text: 'Learn', color: 'text-[var(--color-brand-red)]' },       // #F04E1F
  { text: 'Create', color: 'text-[var(--color-brand-yellow)]' },   // #FFBB00
];

// Past events carousel data
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

// member perks grid data
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

// Home page - 6 sections: hero, brand marquee, video, members highlight, perks, activities
export default function Home() {
  const { currentWordIndex, displayText } = useTypingAnimation(TYPING_WORDS);
  const { isDarkMode } = useTheme();
  const gridOpacity = isDarkMode ? 'opacity-10' : 'opacity-20';

  return (
    <main className="bg-background">
      {/* SECTION 1: Hero - typing animation + Tetris background */}
      <section className="relative w-full overflow-hidden flex justify-center border-b border-border/10">
        <div 
          className={`absolute inset-0 z-0 pointer-events-none ${gridOpacity}`}
          style={{
            backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        <TetrisBlocksBackground />
        
        <div className="relative max-w-[1700px] mx-auto w-full md:py-32 py-20 flex flex-col items-center text-center z-10 px-4 sm:px-8 md:px-12">
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <p className="text-sm md:text-base font-semibold tracking-widest text-foreground uppercase">MICROSOFT STUDENT COMMUNITY | NU LAGUNA</p>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">Helping You<br /><span className="inline-flex items-center text-left"><span className={`${TYPING_WORDS[currentWordIndex].color}`}>#</span><span className={`inline-block ${TYPING_WORDS[currentWordIndex].color}`}>{displayText}</span><span className="text-foreground ml-1">More
            <span className="inline-block h-[0.8em] w-[2px] animate-blink bg-foreground ml-1" /></span></span></h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">The Microsoft Student Community at NU Laguna empowers students to learn, connect, and build the future with lorem ipsum dolor.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button size="lg" className="min-w-[150px] bg-[var(--color-brand-blue)] hover:brightness-90">Join an Event</Button>
              <Button size="lg" variant="outline" className="min-w-[150px] border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)] hover:text-white">Explore More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand logo scroller with marquee animation and fade edges */}
      <section className="w-full py-12 md:py-16 border-b border-border bg-background dark:bg-card flex justify-center overflow-hidden">
        <div 
          className="w-full max-w-[1700px] flex flex-nowrap overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <div className="flex items-center justify-start whitespace-nowrap shrink-0 animate-marquee">
            {[...Array(6)].map((_, i) => (
              <img 
                key={`logo-1-${i}`} 
                src={mscLogo} 
                alt="MSC Logo" 
                className="h-20 md:h-24 mx-12 md:mx-16 hover:scale-[1.15] transition-transform duration-200 cursor-pointer" 
              />
            ))}
          </div>
          <div className="flex items-center justify-start whitespace-nowrap shrink-0 animate-marquee" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <img 
                key={`logo-2-${i}`} 
                src={mscLogo} 
                alt="MSC Logo" 
                className="h-20 md:h-24 mx-12 md:mx-16 hover:scale-[1.15] transition-transform duration-200 cursor-pointer" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Community introduction with video and mission description */}
      <section className={`w-full bg-secondary/50 flex justify-center ${sectionPadding} border-b border-border/30`}>
        <div className="max-w-[1700px] mx-auto w-full">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold inline-block"
              style={gradientStyle}
            >
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

      {/* Member community highlight with branded call-to-action */}
      <section className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-12 bg-background dark:bg-card flex justify-center border-b border-border">
        <div className="max-w-[1700px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center">
          <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden relative flex items-center justify-center">
            <img src={abstracticon} alt="Abstract Icon" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:pl-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-brand-blue)] leading-tight">We're here to help curious, creative, and ambitious Nationalians</h2>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--color-brand-blue)]">#AchieveMore</p>
            <Button size="lg" variant="outline" className="mt-1 sm:mt-2 md:mt-3 border-[var(--color-brand-green)] text-[var(--color-brand-green)] hover:bg-[var(--color-brand-green)] hover:text-white">Meet Our Members</Button>
          </div>
        </div>
      </section>

      {/* Member benefits grid with perks cards */}
      <section className={`w-full ${sectionPadding} bg-secondary dark:bg-card flex justify-center border-b border-border`}>
        <div className="max-w-[1700px] mx-auto w-full">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold inline-block mb-4"
              style={gradientStyle}
            >
              MEMBER PERKS
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">From certifications to career connections, being part of MSC opens doors you didn't know existed.</p>
          </div>
          <MemberPerksGrid perks={MEMBER_PERKS_DATA} />
          <div className="text-center"><Button size="lg" variant="outline" className="border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)] hover:text-white">View All Perks</Button></div>
        </div>
      </section>

      {/* Past events carousel showcasing community activities */}
      <section className={`w-full ${sectionPadding} bg-background dark:bg-card flex justify-center border-b border-border`}>
        <div className="max-w-[1700px] mx-auto w-full text-center">
          <div className="mb-16">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold inline-block mb-4"
              style={gradientStyle}
            >
              PAST ACTIVITIES
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">A look at some of the events that brought our community together.</p>
          </div>
          <PastActivitiesCarousel activities={PAST_ACTIVITIES_DATA} />
        </div>
      </section>

    </main>
  );
}