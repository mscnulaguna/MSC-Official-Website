import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Carousel, CarouselRow } from '@/components/ui/carousel';
import mscLogo from '@/assets/logos/msclogo.svg';
import '@/styles/home.css';

// Tetris BGs - All variants
import bluefadedtetris from '@/assets/bg/bluefadedtetris.svg';
import bluesingletetris from '@/assets/bg/bluesingletetris.svg';
import blueTetris from '@/assets/bg/bluetetris.svg';
import greensingletetris from '@/assets/bg/greensingletetris.svg';
import greenTetris from '@/assets/bg/greentetris.svg';
import redsingletetris from '@/assets/bg/redsingletetris.svg';
import redTetris from '@/assets/bg/redtetris.svg';
import yellowsingletetris from '@/assets/bg/yellowsingletetris.svg';
import yellowTetris from '@/assets/bg/yellowtetris.svg';

// Custom Shapes for Section 4
import abstracticon from '@/assets/shapes/abstacticons.svg';

// Predefined position sets (outside component to prevent recreation)
const POSITION_SETS: { [key: number]: Array<{ position: string; top?: string; right?: string; bottom?: string; left?: string }> } = {
  1: [
    { position: 'absolute', top: '4px', left: '4px' },
    { position: 'absolute', top: '2%', left: '8%' },
    { position: 'absolute', top: '10%', left: '2%' },
    { position: 'absolute', top: '15%', left: '12%' },
  ],
  2: [
    { position: 'absolute', top: '8px', right: '24px' },
    { position: 'absolute', top: '5%', right: '8%' },
    { position: 'absolute', top: '12%', right: '15%' },
    { position: 'absolute', top: '3%', right: '5%' },
  ],
  3: [
    { position: 'absolute', bottom: '32px', right: '32px' },
    { position: 'absolute', bottom: '10%', right: '12%' },
    { position: 'absolute', bottom: '5%', right: '8%' },
    { position: 'absolute', bottom: '15%', right: '18%' },
  ],
  4: [
    { position: 'absolute', bottom: '16px', left: '24px' },
    { position: 'absolute', bottom: '8%', left: '10%' },
    { position: 'absolute', bottom: '12%', left: '15%' },
    { position: 'absolute', bottom: '5%', left: '8%' },
  ],
  5: [
    { position: 'absolute', top: '25%', left: '-16px' },
    { position: 'absolute', top: '20%', left: '0px' },
    { position: 'absolute', top: '30%', left: '4px' },
    { position: 'absolute', top: '18%', left: '-8px' },
  ],
  6: [
    { position: 'absolute', bottom: '33%', right: '-8px' },
    { position: 'absolute', bottom: '30%', right: '8px' },
    { position: 'absolute', bottom: '40%', right: '0px' },
    { position: 'absolute', bottom: '25%', right: '4px' },
  ],
  7: [
    { position: 'absolute', top: '8px', right: '25%' },
    { position: 'absolute', top: '2%', right: '28%' },
    { position: 'absolute', top: '5%', right: '22%' },
    { position: 'absolute', top: '10%', right: '30%' },
  ],
  8: [
    { position: 'absolute', bottom: '0px', left: '33%' },
    { position: 'absolute', bottom: '2%', left: '30%' },
    { position: 'absolute', bottom: '5%', left: '35%' },
    { position: 'absolute', bottom: '-4px', left: '32%' },
  ],
  9: [
    { position: 'absolute', top: '33%', right: '0px' },
    { position: 'absolute', top: '30%', right: '4px' },
    { position: 'absolute', top: '38%', right: '8px' },
    { position: 'absolute', top: '28%', right: '-4px' },
  ],
};

const PlaceHolderImg = ({ className = "w-full h-full" }) => (
  <div className={`bg-muted flex items-center justify-center text-muted-foreground ${className}`}>
    Image Placeholder
  </div>
);

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
  const words = [
    { text: 'Achieve', color: 'text-[#00A4EF]' }, // Blue
    { text: 'Build', color: 'text-[#7FBA00]' },   // Green
    { text: 'Learn', color: 'text-[#F25022]' },   // Orange/Red
    { text: 'Create', color: 'text-[#FFB900]' },  // Yellow
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // SVG Position State - Each shape randomly teleports between positions
  const [shapePositions, setShapePositions] = useState<{ [key: number]: number }>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  });

  // Effect for typing animation
  useEffect(() => {
    const currentWord = words[currentWordIndex].text;
    let index = displayText.length;
    let timeoutId: ReturnType<typeof setTimeout>;

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
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, isTyping, currentWordIndex, words]);

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
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative max-w-[1700px] w-full px-4 py-20 sm:px-8 md:px-12 md:py-32 flex flex-col items-center text-center z-10">
          
          {/* SVG Shape 1 - Instant Position Changes */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-60 z-0" style={POSITION_SETS[1][shapePositions[1]] as React.CSSProperties}>
            <img src={bluefadedtetris} alt="Blue Faded Tetris" className="w-full h-full object-contain" />
          </div>
          
          {/* SVG Shape 2 - Instant Position Changes */}
          <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-60 z-0" style={POSITION_SETS[2][shapePositions[2]] as React.CSSProperties}>
            <img src={bluesingletetris} alt="Blue Single Tetris" className="w-full h-full object-contain" />
          </div>
          
          {/* SVG Shape 3 - Instant Position Changes */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-60 z-0" style={POSITION_SETS[3][shapePositions[3]] as React.CSSProperties}>
            <img src={blueTetris} alt="Blue Tetris" className="w-full h-full object-contain" />
          </div>
          
          {/* SVG Shape 4 - Instant Position Changes */}
          <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-60 z-0" style={POSITION_SETS[4][shapePositions[4]] as React.CSSProperties}>
            <img src={greensingletetris} alt="Green Single Tetris" className="w-full h-full object-contain" />
          </div>
          
          {/* SVG Shape 5 - Instant Position Changes */}
          <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 opacity-60 z-0" style={POSITION_SETS[5][shapePositions[5]] as React.CSSProperties}>
            <img src={greenTetris} alt="Green Tetris" className="w-full h-full object-contain" />
          </div>
          
          {/* SVG Shape 6 - Instant Position Changes */}
          <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-60 z-0" style={POSITION_SETS[6][shapePositions[6]] as React.CSSProperties}>
            <img src={redsingletetris} alt="Red Single Tetris" className="w-full h-full object-contain" />
          </div>
          
          {/* SVG Shape 7 - Instant Position Changes */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 opacity-60 z-0" style={POSITION_SETS[7][shapePositions[7]] as React.CSSProperties}>
            <img src={redTetris} alt="Red Tetris" className="w-full h-full object-contain" />
          </div>
          
          {/* SVG Shape 8 - Instant Position Changes */}
          <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-60 z-0" style={POSITION_SETS[8][shapePositions[8]] as React.CSSProperties}>
            <img src={yellowsingletetris} alt="Yellow Single Tetris" className="w-full h-full object-contain" />
          </div>
          
          {/* SVG Shape 9 - Instant Position Changes */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-60 z-0" style={POSITION_SETS[9][shapePositions[9]] as React.CSSProperties}>
            <img src={yellowTetris} alt="Yellow Tetris" className="w-full h-full object-contain" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <p className="text-sm md:text-base font-semibold tracking-widest text-foreground uppercase">
              MICROSOFT STUDENT COMMUNITY | NU LAGUNA
            </p>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Helping You
              <br />
              <span className="inline-flex items-center text-left">
                <span className={`${words[currentWordIndex].color}`}>#</span>
                <span className={`inline-block ${words[currentWordIndex].color}`}>
                  {displayText}
                </span>
                <span className="text-foreground ml-1">More</span>
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

      {/* 2. BRAND LOGO SCROLLER */}
      {/* Taller section, larger logos, bounded center layout */}
      <section className="w-full py-12 md:py-16 border-b border-border/40 bg-white flex justify-center overflow-hidden">
        <div className="max-w-[1700px] w-full inline-flex flex-nowrap logo-scroller-container shadow-sm border border-border/10 rounded-xl bg-white m-4 hidden">
          {/* Note: In a real environment, max-w with continuous wrap requires calculating double widths. 
              We'll let infinite loop run over full width visually but keep centered on massive screens. */}
        </div>
        <div className="w-full max-w-[1700px] flex flex-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex items-center justify-center md:justify-start whitespace-nowrap shrink-0 animate-[slide_20s_linear_infinite]">
            {[...Array(6)].map((_, i) => (
              <img key={`logo-1-${i}`} src={mscLogo} alt="MSC Logo" className="h-20 md:h-24 mx-12 md:mx-16 transition-transform duration-200 ease-in-out hover:scale-[1.15] cursor-pointer" />
            ))}
          </div>
          <div className="flex items-center justify-center md:justify-start whitespace-nowrap shrink-0 animate-[slide_20s_linear_infinite]" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <img key={`logo-2-${i}`} src={mscLogo} alt="MSC Logo" className="h-20 md:h-24 mx-12 md:mx-16 transition-transform duration-200 ease-in-out hover:scale-[1.15] cursor-pointer" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHO WE ARE SECTION */}
      {/* Dimmer background */}
      <section className="w-full bg-secondary/50 flex justify-center py-20 px-4 sm:px-8 md:px-12 border-b border-border/30">
        <div className="max-w-[1700px] w-full mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-[linear-gradient(to_right,#00A4EF,#7FBA00,#F25022,#FFB900)]">
              WHO WE ARE
            </h2>
          </div>
          
          <div className="w-full mb-12 relative px-4 sm:px-6 md:px-8">
            <Carousel autoPlay autoPlayInterval={4000} size="16x9">
              <PlaceHolderImg />
              <PlaceHolderImg />
              <PlaceHolderImg />
            </Carousel>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-6 text-lg text-muted-foreground leading-relaxed">
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
      <section className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-white flex justify-center border-b border-border/30">
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
      {/* Background is faded white similar to who we are */}
      <section className="w-full py-20 px-4 sm:px-8 md:px-12 bg-secondary/50 flex justify-center border-b border-border/30">
        <div className="max-w-[1700px] w-full mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-[linear-gradient(to_right,#00A4EF,#7FBA00,#F25022,#FFB900)]">
              MEMBER PERKS
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              From certifications to career connections, being part of MSC opens doors you didn't know existed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-border hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03] bg-white rounded-xl overflow-hidden">
                <CardHeader>
                  <div className="text-2xl md:text-3xl mb-4 text-[#00A4EF]">✦</div>
                  <CardTitle className="text-lg md:text-xl font-bold">Exclusive Workshops</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-[#00A2ED] text-[#00A2ED] hover:bg-[#00A2ED] hover:text-white transition-colors">
              Past Activities
            </Button>
          </div>
        </div>
      </section>

      {/* 6. PAST ACTIVITIES SECTION */}
      <section className="w-full py-20 px-4 sm:px-8 md:px-12 bg-white flex justify-center">
        <div className="max-w-[1700px] w-full mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-[linear-gradient(to_right,#00A4EF,#7FBA00,#F25022,#FFB900)]">
              PAST ACTIVITIES
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              A look at some of the events that brought our community together.
            </p>
          </div>

          <ResponsiveCarouselRow className="max-w-[1500px] mx-auto pb-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="px-3" style={{ padding: '0 12px' }}>
                <Card className="rounded-xl border-border border h-full flex flex-col items-center justify-center p-0 overflow-hidden bg-muted aspect-[4/5] relative group shadow-sm hover:shadow-md transition-shadow">
                  <PlaceHolderImg className="absolute inset-0" />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 ease-in-out">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-white font-bold text-lg md:text-xl">Event {i}</span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </ResponsiveCarouselRow>
        </div>
      </section>

    </main>
  );
}