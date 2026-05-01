import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, CalendarDays, ImageIcon, X, Clock, MapPin, Users
} from 'lucide-react';

// MSC Official UI Components
import { AdminLayout } from '@/components/ui/layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { getApiBaseUrl } from '@/lib/api';

// --- CONFIGURATION ---
const API_BASE = getApiBaseUrl();

// --- INTERFACES ---
type EventStatus = 'upcoming' | 'draft' | 'completed';
type TabStatus = EventStatus | 'all'; // Added 'all' to the allowed tab types

interface EventData {
  id: string;
  title: string;
  description: string;
  type: string;
  status: EventStatus;
  coverImage: string | null;
  startDate: string;
  startTime: string;
  location: string;
  maxParticipants: number;
  registered: number;
  guildId?: string;
}

interface Guild {
  id: string;
  name: string;
}

const normalizeEventStatus = (status?: string, date?: string, endDate?: string): EventStatus => {
  const normalizedStatus = status?.toLowerCase()

  if (normalizedStatus === 'upcoming' || normalizedStatus === 'draft' || normalizedStatus === 'completed') {
    return normalizedStatus as EventStatus
  }

  if (normalizedStatus === 'past') {
    return 'completed'
  }

  const referenceDate = endDate || date
  if (!referenceDate) {
    return 'draft'
  }

  const parsedDate = new Date(referenceDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'draft'
  }

  return parsedDate.getTime() >= Date.now() ? 'upcoming' : 'completed'
}

// Fallback Mock Data matching the create-event.tsx form data
const FALLBACK_EVENTS: EventData[] = [
  {
    id: "1", title: "MSC Hackathon 2026", type: "Competition", status: "upcoming",
    description: "Annual coding competition for MSC students to build innovative solutions.", 
    coverImage: null, startDate: "2026-05-15", startTime: "08:00 AM", location: "Main Tech Hall",
    maxParticipants: 100, registered: 85
  },
  {
    id: "2", title: "React Fundamentals", type: "Workshop", status: "draft",
    description: "A deep dive into building production-ready apps using React 18.", 
    coverImage: null, startDate: "2026-06-01", startTime: "01:00 PM", location: "Lab Room 302",
    maxParticipants: 40, registered: 12
  },
  {
    id: "3", title: "UI/UX Design Thinking", type: "Seminar", status: "completed",
    description: "Exploring the fundamentals of user-centric design methodologies.", 
    coverImage: null, startDate: "2025-11-20", startTime: "10:00 AM", location: "Auditorium",
    maxParticipants: 200, registered: 198
  }
];

// --- HELPER COMPONENTS ---
const SkeletonCard = () => (
  <Card className="py-0 flex flex-col h-full rounded-none animate-pulse">
    <div className="h-32 w-full bg-muted border-b border-border" />
    <CardHeader className="space-y-3">
      <div className="h-6 bg-muted w-3/4" />
      <div className="h-4 bg-muted w-1/4" />
      <div className="space-y-2 mt-4">
        <div className="h-3 bg-muted w-1/2" />
        <div className="h-3 bg-muted w-1/3" />
        <div className="h-3 bg-muted w-2/3" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3 pb-3 pt-0 flex-1">
      <div className="h-3 bg-muted w-full" />
      <div className="h-3 bg-muted w-5/6" />
      <div className="h-2 bg-muted w-full mt-4" />
    </CardContent>
    <CardFooter className="pb-3 pt-0">
      <div className="h-9 bg-muted w-full" />
    </CardFooter>
  </Card>
);

export default function EventsDashboard() {
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Default to 'all' so users see everything when they first open the page
  const [activeTab, setActiveTab] = useState<TabStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGuild, setFilterGuild] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Backend supports upcoming/past/all only. Draft remains a client-side view.
  const getStatusQuery = (tab: TabStatus) => {
    if (tab === 'upcoming') return 'upcoming'
    if (tab === 'completed') return 'past'
    return 'all'
  }

  // Fetch events when tab changes to keep API query aligned with backend filters.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statusQuery = getStatusQuery(activeTab)
        const eventsRes = await fetch(`${API_BASE}/events?status=${statusQuery}`);
        if (eventsRes.ok) {
          const eventsJson = await eventsRes.json();
          const normalize = (e: any) => {
            const startDate = e.date || e.startDate || ''
            const endDate = e.endDate || ''
            let startTime = e.startTime || ''
            if (!startTime && startDate) {
              const d = new Date(startDate)
              if (!isNaN(d.getTime())) startTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            return {
              ...e,
              startDate,
              startTime,
              endDate,
              location: e.venue || e.location || '',
              maxParticipants: e.capacity ?? e.maxParticipants ?? 0,
              registered: e.registered ?? 0,
              guildId: (e.guild && e.guild.id) ? e.guild.id : (e.guildId || undefined),
              coverImage: e.coverImage || e.imageUrl || null,
              status: normalizeEventStatus(e.status, startDate, endDate),
              type: (e.type || '').toLowerCase(),
            }
          }
          setEvents((eventsJson.data || []).map(normalize));
        } else {
          setEvents(FALLBACK_EVENTS);
        }

      } catch (err) {
        console.warn("API Error, utilizing fallback data");
        setEvents(FALLBACK_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const guildsRes = await fetch(`${API_BASE}/guilds`);
        if (guildsRes.ok) {
          const guildsJson = await guildsRes.json();
          setGuilds(guildsJson.data || []);
        }
      } catch {
        // Ignore guild fetch failures; event cards still work without guild filter options.
      }
    }

    fetchGuilds()
  }, [])

  // Apply Filters
  const filteredEvents = events.filter(evt => {
    // If 'all' is selected, ignore the status filter. Otherwise, require an exact match.
    const matchesTab = activeTab === 'all' || evt.status === activeTab;
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGuild = filterGuild === 'all' || evt.guildId === filterGuild;
    const matchesType = filterType === 'all' || evt.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesTab && matchesSearch && matchesGuild && matchesType;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterGuild('all');
    setFilterType('all');
  };

  return (
    <AdminLayout>
      <section className="section-container section-padding py-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 ">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Events</h1>
            <p>Manage and track all MSC guild activities and seminars.</p>
          </div>
          {/* Linked to create-event.tsx */}
          <Button variant="default" onClick={() => navigate('/admin/create-event')}>
            <Plus/> Create New Event
          </Button>
        </div>

        {/* Dashboard Standard Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabStatus)} className="w-full">
          <div className="mb-6 flex">
            <TabsList className="grid grid-cols-4 ">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search events..." 
                className="pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterGuild} onValueChange={setFilterGuild}>
              <SelectTrigger>
                <SelectValue placeholder="All Guilds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Guilds</SelectItem>
                {guilds.map(g => (
                  <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || filterGuild !== 'all' || filterType !== 'all') && (
              <Button variant="outline" onClick={clearFilters}>
                <X/> Clear
              </Button>
            )}
          </div>

          {/* Content Area */}
          <div className="pb-20">
            <TabsContent value={activeTab} >
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredEvents.map((evt) => {
                    // Safe calculation for Progress Bar
                    const capacity = evt.maxParticipants > 0 ? evt.maxParticipants : 1; 
                    const progressValue = Math.min((evt.registered / capacity) * 100, 100);

                    return (
                      <Card key={evt.id} className="py-0 flex flex-col h-full bg-card overflow-hidden group">
                        {/* Card Image Area */}
                        <div className="h-32 w-full overflow-hidden bg-muted/30 border-b border-border relative">
                          {evt.coverImage ? (
                            <img src={evt.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={evt.title} />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                              <ImageIcon className="h-8 w-8 opacity-20" />
                            </div>
                          )}
                        </div>

                        {/* Card Header (Mirrors Activities UI) */}
                        <CardHeader className="space-y-3">
                          <div className="space-y-2">
                            <CardTitle className="line-clamp-1 text-lg">{evt.title}</CardTitle>
                            <div>
                              {evt.status === "completed" ? (
                                <Badge variant="success">Completed</Badge>
                              ) : evt.status === "draft" ? (
                                <Badge variant="outline" className="text-muted-foreground border-border">Draft</Badge>
                              ) : (
                                <Badge variant="accent">Upcoming</Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CalendarDays className="h-4 w-4" />
                              <span>{evt.startDate ? new Date(evt.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Date TBA"}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{evt.startTime || "Time TBA"}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{evt.location || "Venue TBA"}</span>
                            </div>
                          </div>
                        </CardHeader>

                        {/* Card Content */}
                        <CardContent className="space-y-3 pb-3 pt-0 flex-1 flex flex-col justify-end">
                          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 flex-1">
                            {evt.description || "No description provided for this event."}
                          </p>

                          {evt.maxParticipants > 0 && (
                            <div className="space-y-2 w-full pt-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{evt.registered}/{evt.maxParticipants} registered</span>
                              </div>
                              <Progress value={progressValue} className="h-2 rounded-none bg-muted" />
                            </div>
                          )}
                        </CardContent>

                        {/* Card Footer */}
                        <CardFooter className="pb-3 pt-0 mt-auto">
                          <Button 
                            variant="outlinePrimary" 
                            className="w-full" 
                            onClick={() => navigate(`/admin/create-event?id=${evt.id}`)}
                          >
                            Edit Event
                          </Button>
                        </CardFooter>

                      </Card>
                    );
                  })}
                </div>
              ) : (
                /* EMPTY STATE */
                <div className="border border-dashed border-border bg-muted/10 animate-in fade-in py-10">
                  <EmptyState 
                    icon={<CalendarDays className="h-12 w-12 text-muted-foreground/30" />} 
                    title={activeTab === 'all' ? "No events found" : `No ${activeTab} events found`} 
                    description={activeTab === 'all' 
                      ? "There are currently no events in the system. Click below to create a new one." 
                      : `There are currently no events categorized under ${activeTab}. Click below to create a new one.`}
                    action={
                      <Button variant="default" onClick={() => navigate('/admin/create-event')}>
                        <Plus className="mr-2 h-4 w-4"/> Create Event
                      </Button>
                    }
                  />
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </AdminLayout>
  );
}