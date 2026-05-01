import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Upload, Trash2, X, Eye, Flag, MapPin, 
  CalendarDays, Clock, Plus, ChevronLeft, ChevronRight, ImageIcon 
} from 'lucide-react';

// MSC Official UI Components
import { AdminLayout } from '@/components/ui/layout';
// TS6133 fix: removed unused CardFooter
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getApiBaseUrl } from '@/lib/api';
import { useAuth } from '@/context/authContext';

// --- CONFIGURATION ---
const API_BASE = getApiBaseUrl();

// --- HELPERS ---
const getInitials = (name: string) => 
  name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");

const autoCropTo1x1 = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
          canvas.toBlob(blob => blob && resolve(new File([blob], file.name, { type: file.type })), file.type);
        }
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => URL.revokeObjectURL(objectUrl);
    img.src = objectUrl;
  });
};

// --- INTERFACES ---
interface Speaker { id: string; name: string; bio: string; photo: File | null; title?: string; }
interface Organizer { id: string; name: string; email: string; photo: File | null; }
interface Session { id: string; time: string; title: string; speaker: string; description: string; }
interface EventPhoto { id: string; file: File; }
interface Guild { id: string; name: string; }

type EventStatus = 'draft' | 'upcoming' | 'completed';

interface EventFormData {
  title: string; type: string; description: string; guildId: string; status: EventStatus;
  venueName: string; location: string; platformLink: string;
  startDate: string; startTime: string; endDate: string; endTime: string;
  maxParticipants: number; registrationDeadline: string;
  registrationOpen: boolean; requiresApproval: boolean; publishEvent: boolean;
  organizers: Organizer[]; speakers: Speaker[]; sessions: Session[];
  coverImage: File | null;
}

// --- REUSABLE PHOTO UPLOAD COMPONENT ---
const PhotoUploadZone = ({ file, onUpload, label, square = true }: { file: any, onUpload: (f: File) => void, label: string, square?: boolean }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <div className={`relative flex flex-col items-center justify-center border border-dashed border-border bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer rounded-none ${square ? 'aspect-square w-28' : 'min-h-50 w-full'}`}>
      <input 
        type="file" 
        className="absolute inset-0 opacity-0 cursor-pointer" 
        accept="image/*"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(square ? await autoCropTo1x1(f) : f);
        }}
      />
      {previewUrl ? (
        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
      ) : (
        <div className="text-center p-4">
          <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>
      )}
    </div>
  );
};
export default function CreateEventPage() {
  const navigate = useNavigate(); // Added Router hook
  const { token: authToken } = useAuth()
  const [searchParams] = useSearchParams()
  const editEventId = searchParams.get('id')

  const [activeTab, setActiveTab] = useState('event');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // API Loading State
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [hasLiveGuilds, setHasLiveGuilds] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [existingCoverImageUrl, setExistingCoverImageUrl] = useState<string | null>(null)

  const [formData, setFormData] = useState<EventFormData>({
    title: '', type: '', description: '', guildId: '', status: 'draft',
    venueName: '', location: '', platformLink: '',
    startDate: '', startTime: '', endDate: '', endTime: '',
    maxParticipants: 0, registrationDeadline: '',
    registrationOpen: true, requiresApproval: false, publishEvent: false, coverImage: null,
    organizers: [{ id: '1', name: '', email: '', photo: null }],
    speakers: [], sessions: []
  });

  const update = (field: keyof EventFormData, value: any) => setFormData(p => ({ ...p, [field]: value }));
  const isCompleted = formData.status === 'completed';

  const combineDateTime = (date: string, time: string) => {
    const normalizedTime = time.length === 5 ? `${time}:00` : time
    // MySQL DATETIME expects "YYYY-MM-DD HH:MM:SS" in strict mode.
    return `${date} ${normalizedTime}`
  }

  const getDateInputValue = (isoDate?: string) => {
    if (!isoDate) return ''
    const parsed = new Date(isoDate)
    if (Number.isNaN(parsed.getTime())) return ''
    return parsed.toISOString().slice(0, 10)
  }

  const getTimeInputValue = (isoDate?: string) => {
    if (!isoDate) return ''
    const parsed = new Date(isoDate)
    if (Number.isNaN(parsed.getTime())) return ''
    return parsed.toTimeString().slice(0, 5)
  }

  const mapEventToFormStatus = (startDate?: string, endDate?: string): EventStatus => {
    const referenceDate = endDate || startDate
    if (!referenceDate) return 'draft'

    const parsed = new Date(referenceDate)
    if (Number.isNaN(parsed.getTime())) return 'draft'

    return parsed.getTime() >= Date.now() ? 'upcoming' : 'completed'
  }

  const uploadCoverImage = async (file: File, token: string) => {
    if (!token) {
      throw new Error('Missing authentication token')
    }

    const formData = new FormData()
    formData.append('coverImage', file)

    const response = await fetch(`${API_BASE}/events/upload/cover`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload event cover image')
    }

    const data = await response.json()
    return data.imageUrl as string
  }

  // Fetch Guilds
  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const res = await fetch(`${API_BASE}/guilds`);
        if (!res.ok) throw new Error("Failed to fetch guilds");
        const json = await res.json();
        setGuilds(json.data || []);
        setHasLiveGuilds(true);
      } catch (err) {
        setGuilds([{ id: '1', name: 'Technology Guild' }, { id: '2', name: 'Design Guild' }]); // Fallback
        setHasLiveGuilds(false);
      }
    };
    fetchGuilds();
  }, []);

  // Prefill form when coming from Edit Event action (?id=...)
  useEffect(() => {
    const loadEventForEditing = async () => {
      if (!editEventId) return

      try {
        const res = await fetch(`${API_BASE}/events/${editEventId}`)
        if (!res.ok) {
          throw new Error('Failed to load event')
        }

        const data = await res.json()
        const parsedSpeakers = Array.isArray(data.speakers) ? data.speakers : []
        const parsedAgenda = Array.isArray(data.agenda) ? data.agenda : []
        setExistingCoverImageUrl(data.coverImage || null)

        setFormData((prev) => ({
          ...prev,
          title: data.title || '',
          type: data.type || '',
          description: data.description || '',
          guildId: data.guild?.id ? String(data.guild.id) : '',
          status: mapEventToFormStatus(data.date, data.endDate),
          venueName: data.venue || '',
          location: data.venue || '',
          startDate: getDateInputValue(data.date),
          startTime: getTimeInputValue(data.date),
          endDate: getDateInputValue(data.endDate),
          endTime: getTimeInputValue(data.endDate),
          maxParticipants: data.capacity ?? 0,
          coverImage: null,
          speakers: parsedSpeakers.map((speaker: any, index: number) => ({
            id: String(speaker.id || index + 1),
            name: speaker.name || '',
            bio: speaker.bio || '',
            title: speaker.title || speaker.bio || '',
            photo: null,
          })),
          sessions: parsedAgenda.map((item: any, index: number) => ({
            id: String(item.id || index + 1),
            time: item.time || '',
            title: item.activity || '',
            speaker: item.speaker || '',
            description: item.description || '',
          })),
        }))
      } catch (err) {
        console.error('Failed to prefill event editor', err)
      }
    }

    loadEventForEditing()
  }, [editEventId])

  // --- API POST HANDLER ---
  const handleSave = async () => {
    setIsSubmitting(true);
    setSubmitError(null)
    try {
      const token = authToken || localStorage.getItem('token')
      if (!token) {
        setSubmitError('Your session has expired. Please sign in again.')
        navigate('/login')
        return
      }

      if (!formData.title.trim()) {
        throw new Error('Event title is required')
      }

      if (!formData.description.trim()) {
        throw new Error('Event description is required')
      }

      if (!formData.type) {
        throw new Error('Event type is required')
      }

      if (!formData.startDate || !formData.startTime) {
        throw new Error('Start date and time are required')
      }

      if (!formData.venueName && !formData.location) {
        throw new Error('Venue is required')
      }

      if (!Number.isFinite(formData.maxParticipants) || formData.maxParticipants <= 0) {
        throw new Error('Max participants must be greater than 0')
      }

      const date = combineDateTime(formData.startDate, formData.startTime)
      const endDate = combineDateTime(formData.endDate || formData.startDate, formData.endTime || formData.startTime)
      const coverImage = formData.coverImage ? await uploadCoverImage(formData.coverImage, token) : null
      const selectedGuild = guilds.find((guild) => String(guild.id) === formData.guildId)
      const guildId = hasLiveGuilds && selectedGuild ? Number(selectedGuild.id) : undefined
      const speakersPayload = formData.speakers
        .filter((speaker) => speaker.name.trim().length > 0)
        .map((speaker) => ({
          name: speaker.name.trim(),
          bio: (speaker.bio || speaker.title || '').trim(),
          photo: null,
        }))
      const agendaPayload = formData.sessions
        .filter((session) => session.title.trim().length > 0 || session.time.trim().length > 0)
        .map((session) => ({
          time: session.time,
          activity: session.title,
          speaker: session.speaker,
          description: session.description,
        }))

      // 1. Transform form data to match the API contract expected by events-dashboard
      const payload = {
        title: formData.title,
        description: formData.description,
        date,
        endDate,
        venue: formData.venueName || formData.location,
        capacity: Number(formData.maxParticipants),
        type: formData.type.trim().toLowerCase(),
        guildId,
        coverImage,
        status: formData.status,
        speakers: speakersPayload,
        agenda: agendaPayload,
        sessions: formData.sessions,
      };

      // 2. Save using POST for create and PUT for edit.
      const endpoint = editEventId ? `${API_BASE}/events/${editEventId}` : `${API_BASE}/events`
      const method = editEventId ? 'PUT' : 'POST'
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...payload,
          coverImage: coverImage || existingCoverImageUrl || null,
        }),
      });

      if (!res.ok) {
        let errorMessage = editEventId ? 'Failed to update event' : 'Failed to create event'

        try {
          const errorPayload = await res.json()
          errorMessage = errorPayload?.error?.message || errorMessage
        } catch {
          // Ignore parse failures and use fallback message.
        }

        throw new Error(errorMessage)
      }

      // 3. Navigate back to dashboard on success to force reload
      navigate('/admin/event-status');

    } catch (err) {
      console.error("Error saving event:", err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to save event')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <section className="section-container section-padding font-inter py-8 relative">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {editEventId ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {editEventId ? 'Review and update event details.' : 'Configure event details and logistics.'}
            </p>
          </div>
          <Button variant="outlinePrimary" onClick={() => setShowPreview(true)}>
            <Eye/> Preview Mode
          </Button>
        </div>

        {submitError ? (
          <Alert variant="warning" className="mb-6 rounded-none">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center w-full mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 rounded-none">
              <TabsTrigger value="event" className="rounded-none">Event</TabsTrigger>
              <TabsTrigger value="speakers" className="rounded-none">Speakers</TabsTrigger>
              <TabsTrigger value="agenda" className="rounded-none">Agenda</TabsTrigger>
              <TabsTrigger value="media" disabled={!isCompleted} className="rounded-none">Gallery</TabsTrigger>
            </TabsList>
          </div>

          <div>
            
            {/* =========================================
                TAB: EVENT DETAILS
                ========================================= */}
            {activeTab === 'event' && (
              <div className="space-y-8">
                
                {/* Card 1: Event Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label>Event Title</Label>
                      <Input placeholder="Enter event title" value={formData.title} onChange={e => update('title', e.target.value)} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Event Type</Label>
                        <Select value={formData.type} onValueChange={v => update('type', v)}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="seminar">Seminar</SelectItem>
                            <SelectItem value="competition">Competition</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Organizer Guild</Label>
                        <Select value={formData.guildId} onValueChange={v => update('guildId', v)}>
                          <SelectTrigger><SelectValue placeholder="Select guild" /></SelectTrigger>
                          <SelectContent>
                            {guilds.map(g => (
                              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Event Status</Label>
                      <Select value={formData.status} onValueChange={v => update('status', v as EventStatus)}>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Event Description</Label>
                      <Textarea placeholder="Detailed event description..." value={formData.description} onChange={e => update('description', e.target.value)} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cover Image</Label>
                      <PhotoUploadZone square={false} file={formData.coverImage} onUpload={f => update('coverImage', f)} label="Drag or click to upload 16:9 banner" />
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: Event Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={formData.startDate} onChange={e => update('startDate', e.target.value)} /></div>
                      <div className="space-y-2"><Label>End Date</Label><Input type="date" value={formData.endDate} onChange={e => update('endDate', e.target.value)} /></div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Start Time</Label><Input type="time" value={formData.startTime} onChange={e => update('startTime', e.target.value)} /></div>
                      <div className="space-y-2"><Label>End Time</Label><Input type="time" value={formData.endTime} onChange={e => update('endTime', e.target.value)} /></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3: Venue */}
                <Card>
                  <CardHeader>
                    <CardTitle>Venue</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2"><Label>Venue Name</Label><Input className="rounded-none" placeholder="e.g., Lecture Hall A" value={formData.venueName} onChange={e => update('venueName', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Location</Label><Input className="rounded-none" placeholder="e.g., Building B, Floor 3" value={formData.location} onChange={e => update('location', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Platform Link (Optional)</Label><Input className="rounded-none" placeholder="e.g., https://teams.microsoft.com/..." value={formData.platformLink} onChange={e => update('platformLink', e.target.value)} /></div>
                  </CardContent>
                </Card>

                {/* Card 4: Registration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Registration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2"><Label>Max Participants</Label><Input type="number" className="rounded-none" placeholder="0 for unlimited" value={formData.maxParticipants || ''} onChange={e => update('maxParticipants', parseInt(e.target.value))} /></div>
                      <div className="space-y-2"><Label>Registration Deadline</Label><Input type="date" className="rounded-none" value={formData.registrationDeadline} onChange={e => update('registrationDeadline', e.target.value)} /></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 5: Organizers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Organizers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.organizers.map((org, i) => (
                      <div key={org.id} className="flex flex-col sm:flex-row gap-6 p-9 border border-border relative items-start bg-muted/5">
                        <PhotoUploadZone square={true} file={org.photo} onUpload={f => { const n = [...formData.organizers]; n[i].photo = f; update('organizers', n); }} label="Photo" />
                        <div className="flex-1 space-y-4 w-full">
                          <div className="space-y-2"><Label>Name</Label><Input placeholder="Organizer Name" value={org.name} onChange={e => { const n = [...formData.organizers]; n[i].name = e.target.value; update('organizers', n); }} /></div>
                          <div className="space-y-2"><Label>Email</Label><Input placeholder="organizer@example.com" value={org.email} onChange={e => { const n = [...formData.organizers]; n[i].email = e.target.value; update('organizers', n); }} /></div>
                        </div>
                        {i > 0 && <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => update('organizers', formData.organizers.filter(o => o.id !== org.id))}><Trash2 className="h-4 w-4"/></Button>}
                      </div>
                    ))}
                    <Button variant="outlinePrimary" className="w-full" onClick={() => update('organizers', [...formData.organizers, { id: Date.now().toString(), name: '', email: '', photo: null }])}>
                      <Plus/> Add Organizer
                    </Button>
                  </CardContent>
                </Card>

                {/* Card 6: Settings */}
                <Card>
                  <CardHeader className='border-b border-border'>
                    <CardTitle>Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <Label htmlFor="registrationOpen">Registration is Open</Label>
                      <Checkbox id="registrationOpen" checked={formData.registrationOpen} onCheckedChange={c => update('registrationOpen', !!c)} />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <Label htmlFor="requiresApproval">Requires Approval</Label>
                      <Checkbox id="requiresApproval" checked={formData.requiresApproval} onCheckedChange={c => update('requiresApproval', !!c)} />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <Label htmlFor="publishEvent">Publish Event</Label>
                      <Checkbox id="publishEvent" checked={formData.publishEvent} onCheckedChange={c => update('publishEvent', !!c)} />
                    </div>
                  </CardContent>
                </Card>

              </div>
            )}

            {/* =========================================
                TAB: SPEAKERS 
                ========================================= */}
            {activeTab === 'speakers' && (
              <div className="grid grid-cols-1 gap-6">
                {formData.speakers.map((s, i) => (
                  <Card key={s.id} className=" relative pt-6">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => update('speakers', formData.speakers.filter(sp => sp.id !== s.id))}><Trash2/></Button>
                    <CardContent className="flex flex-col items-center space-y-4 flex-1">
                      <PhotoUploadZone square={true} file={s.photo} onUpload={f => {
                        const n = [...formData.speakers]; n[i].photo = f; update('speakers', n);
                      }} label="Speaker Photo" />
                      <div className="w-full space-y-2">
                        <Label>Full Name</Label>
                        <Input placeholder="e.g. John Doe" value={s.name} onChange={e => { const n = [...formData.speakers]; n[i].name = e.target.value; update('speakers', n); }} />
                      </div>
                      <div className="w-full space-y-2">
                        <Label>Role / Title</Label>
                        <Textarea placeholder="Short background..." value={s.title || ''} onChange={e => { const n = [...formData.speakers]; n[i].title = e.target.value; update('speakers', n); }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                 
                <Button variant="outlinePrimary" className="w-full" onClick={() => update('speakers', [...formData.speakers, { id: Date.now().toString(), name: '', bio: '', title: '', photo: null }])}>
                  <div>
                    <Plus/>
                  </div>
                  <span>Add Guest Speaker</span>
                </Button>
              </div>
            )}
            

{/* =========================================
                TAB: AGENDA 
                ========================================= */}
            {activeTab === 'agenda' && (
              <div className="space-y-6">
                 {formData.sessions.map((sess, i) => (
                   <Card key={sess.id}>
                     <CardHeader className="flex flex-row justify-between">
                       <CardTitle>
                         Session {i + 1}
                       </CardTitle>
                       <Button 
                         variant="ghost" 
                         className="text-destructive hover:text-destructive" 
                         onClick={() => update('sessions', formData.sessions.filter(a => a.id !== sess.id))}
                       >
                         <X/>
                       </Button>
                     </CardHeader>

                     <CardContent className=" space-y-6">
                       <div className="space-y-2">
                         <div className="space-y-2">
                           <Label>Time</Label>
                           <Input 
                             type="time" 
                             value={sess.time} 
                             onChange={e => { const n = [...formData.sessions]; n[i].time = e.target.value; update('sessions', n); }} 
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Session Title</Label>
                           <Input 
                             placeholder="e.g. Opening Remarks" 
                             value={sess.title} 
                             onChange={e => { const n = [...formData.sessions]; n[i].title = e.target.value; update('sessions', n); }} 
                           />
                         </div>
                       </div>
                       
                       <div className="space-y-2">
                         <Label>Speaker (Optional)</Label>
                         <Input 
                           placeholder="Enter speaker name" 
                           value={sess.speaker} 
                           onChange={e => { const n = [...formData.sessions]; n[i].speaker = e.target.value; update('sessions', n); }} 
                         />
                       </div>
                     </CardContent>

                   </Card>
                 ))}

                 {/* Add Session Button */}
                 <Button 
                   variant="outlinePrimary" 
                    className="w-full"
                   onClick={() => update('sessions', [...formData.sessions, { id: Date.now().toString(), time: '', title: '', speaker: '', description: '' }])}
                 >
                   <Plus/> Add Session
                 </Button>
              </div>
            )}

            {/* =========================================
                TAB: MEDIA (Gallery Only visible if completed) 
                ========================================= */}
            {activeTab === 'media' && (
               <div>
                 {isCompleted ? (
                   <Card>
                     <CardHeader>
                       <CardTitle>Event Photos</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="border border-dashed p-12 text-center cursor-pointer">
                         <input type="file" multiple className="hidden" id="multi-upload" accept="image/*" onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const newPhotos = files.map(f => ({ id: Math.random().toString(), file: f }));
                            setEventPhotos(p => [...p, ...newPhotos]);
                         }} />
                         <label htmlFor="multi-upload" className="cursor-pointer block">
                           <Upload className="mx-auto h-8 w-8  mb-4" />
                           <p>Click to upload gallery photos</p>
                           <p className="text-xs text-muted-foreground">Select multiple PNG or JPG files.</p>
                         </label>
                       </div>

                       {eventPhotos.length > 0 && (
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                           {eventPhotos.map(p => (
                             <div key={p.id} className="aspect-square relative group overflow-hidden border border-border">
                               <img src={URL.createObjectURL(p.file)} className="w-full h-full object-cover" alt="Gallery" />
                               <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEventPhotos(prev => prev.filter(item => item.id !== p.id))}><X /></Button>
                             </div>
                           ))}
                         </div>
                       )}
                     </CardContent>
                   </Card>
                 ) : (
                   <div>
                     <ImageIcon />
                     <h3>Media Gallery Disabled</h3>
                     <p>The gallery is only available when the event status is set to "Completed".</p>
                   </div>
                 )}
               </div>
            )}

            {/* Global Form Footer Actions */}
            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => navigate('/admin/event-status')} // Link back to dashboard
              >
                Discard Draft
              </Button>
              <Button 
                variant="default" 
                className="flex-1"
                onClick={handleSave}
                disabled={isSubmitting} // Connect logic here
              >
                {isSubmitting ? 'Saving...' : 'Save Event'}
              </Button>
            </div>

          </div>
        </Tabs>

        {/* =========================================
            LIVE PREVIEW MODAL (Mirrors Event Details)
            ========================================= */}
        {showPreview && (
          <div className="fixed inset-0 z-100 bg-background overflow-y-auto animate-in fade-in duration-200">
            <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border p-4 flex justify-between items-center shadow-sm">
               <div className="flex items-center gap-2">
                 <Badge variant="outline" className="bg-brand-blue text-white border-brand-blue rounded-none font-bold">PREVIEW MODE</Badge>
               </div>
               <Button variant="ghost" size="icon" className="rounded-none" onClick={() => setShowPreview(false)}><X /></Button>
            </nav>

            <div className="pb-20">
              {/* Hero Banner Section */}
              <div className="w-full border-b border-border bg-muted">
                <div className="relative h-48 w-full overflow-hidden sm:h-80">
                  {formData.coverImage ? (
                     <img src={URL.createObjectURL(formData.coverImage)} className="h-full w-full object-cover" alt={formData.title} />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-muted/50 gap-2">
                      <ImageIcon className="h-8 w-8 opacity-50" />
                      <span className="text-sm font-medium uppercase tracking-wider">No Cover Image</span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
                </div>
              </div>

              <section className="section-container section-padding-md">
                <div className="grid gap-8 pt-4 lg:grid-cols-[1fr_360px]">
                  
                  {/* Left Column: Core Data */}
                  <div className="space-y-8">
                    <section aria-label="Event summary">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h1 className="text-3xl font-bold sm:text-5xl text-foreground tracking-tight">
                            {formData.title || "Event Title"}
                          </h1>
                          <div className="flex items-center gap-2">
                            <Badge className={isCompleted ? "bg-muted text-muted-foreground rounded-none" : "bg-(--color-brand-blue) text-white rounded-none"}>
                              {isCompleted ? "Completed" : formData.status === 'draft' ? 'Draft' : 'Upcoming'}
                            </Badge>
                            {formData.type && (
                              <Badge variant="outline" className="border-border text-muted-foreground uppercase rounded-none">
                                {formData.type}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <h2 className="text-xl font-bold text-foreground">About the Event</h2>
                          <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {formData.description || "The event description will be rendered here."}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Organized By */}
                    {formData.organizers.length > 0 && formData.organizers[0].name && (
                      <div className="space-y-3">
                        <Separator className="bg-border" />
                        <h2 className="text-lg font-bold text-foreground">Organized by</h2>
                        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
                          {formData.organizers.map((org) => (
                            <div key={org.id} className="flex w-full max-w-sm items-center gap-3">
                              <Avatar className="border border-border">
                                {org.photo && <AvatarImage src={URL.createObjectURL(org.photo)} alt={org.name} />}
                                <AvatarFallback className="bg-muted text-muted-foreground">{getInitials(org.name || "A")}</AvatarFallback>
                              </Avatar>
                              <div className="leading-tight">
                                <p className="text-sm font-semibold text-foreground">{org.name}</p>
                                {org.email && <p className="text-xs text-muted-foreground">{org.email}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Details Sidebar Card */}
                  <aside className="space-y-6">
                    <Card className="border-border bg-card shadow-sm sticky top-24 rounded-none">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-foreground">Event Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                          <Flag className="mt-0.5 h-5 w-5 text-(--color-brand-blue)" />
                          <div>
                            <p className="font-semibold text-foreground uppercase text-[10px] tracking-wider">Format</p>
                            <p className="text-muted-foreground">{formData.type || "TBA"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-5 w-5 text-(--color-brand-blue)" />
                          <div>
                            <p className="font-semibold text-foreground uppercase text-[10px] tracking-wider">Venue</p>
                            <p className="text-muted-foreground">{formData.venueName || "TBA"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CalendarDays className="mt-0.5 h-5 w-5 text-(--color-brand-blue)" />
                          <div>
                            <p className="font-semibold text-foreground uppercase text-[10px] tracking-wider">Date</p>
                            <p className="text-muted-foreground">{formData.startDate || "TBA"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="mt-0.5 h-5 w-5 text-(--color-brand-blue)" />
                          <div>
                            <p className="font-semibold text-foreground uppercase text-[10px] tracking-wider">Time</p>
                            <p className="text-muted-foreground">{formData.startTime || "TBA"}</p>
                          </div>
                        </div>
                      </CardContent>
                      <Separator className="bg-border" />
                      <div className="p-4 space-y-3">
                        {!isCompleted && (
                          <Button className="w-full bg-(--color-brand-blue) hover:opacity-90 text-white font-bold rounded-none">
                            Register Now
                          </Button>
                        )}
                        <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted font-medium rounded-none" onClick={() => setShowPreview(false)}>
                          Close Preview
                        </Button>
                      </div>
                    </Card>
                  </aside>
                </div>

                {/* Lifecycle Dependent Sections (Completed Only) */}
                {isCompleted && (
                  <div className="mt-12 space-y-16">
                    {/* Speakers */}
                    {formData.speakers.length > 0 && formData.speakers[0].name && (
                      <section aria-label="Event speakers" className="space-y-4 pt-12">
                        <h2 className="text-2xl font-bold text-center text-foreground">Event Speakers</h2>
                        <div className="mx-auto grid max-w-5xl justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {formData.speakers.map((speaker) => (
                            <Card key={speaker.id} className="w-full max-w-sm border-border bg-card rounded-none shadow-none">
                              <CardContent className="space-y-2 p-4 text-center">
                                <Avatar className="mx-auto h-20 w-20 border border-border">
                                  {speaker.photo && <AvatarImage src={URL.createObjectURL(speaker.photo)} alt={speaker.name} />}
                                  <AvatarFallback className="bg-muted text-muted-foreground">{getInitials(speaker.name || "S")}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 mt-2">
                                  <p className="text-sm font-semibold text-foreground">{speaker.name || "Guest Speaker"}</p>
                                  <p className="text-xs text-muted-foreground leading-snug">{speaker.title || "Speaker Title"}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Photos */}
                    {eventPhotos.length > 0 && (
                      <section aria-label="Event photos" className="space-y-4 pt-12">
                        <h2 className="text-2xl font-bold text-center text-foreground">Event Photos</h2>
                        <Tabs defaultValue="gallery" className="mx-auto w-full max-w-5xl">
                          <div className="flex justify-center">
                            <TabsList className="w-fit mb-5 bg-muted border border-border rounded-none">
                              <TabsTrigger value="gallery" className="rounded-none">Gallery</TabsTrigger>
                              <TabsTrigger value="slideshow" className="rounded-none">Slideshow</TabsTrigger>
                            </TabsList>
                          </div>

                          <TabsContent value="gallery">
                            <div className="mx-auto grid max-w-5xl gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                              {eventPhotos.map((photo) => (
                                <div key={photo.id} className="group relative aspect-video w-full overflow-hidden border border-border bg-muted rounded-none">
                                  <img src={URL.createObjectURL(photo.file)} className="h-full w-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="slideshow" className="relative group">
                            <div className="aspect-video w-full overflow-hidden border border-border bg-muted rounded-none">
                              <img src={URL.createObjectURL(eventPhotos[currentSlide].file)} className="h-full w-full object-cover" />
                            </div>
                            {eventPhotos.length > 1 && (
                              <>
                                <Button variant="secondary" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-none opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setCurrentSlide(p => (p === 0 ? eventPhotos.length - 1 : p - 1))}><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="secondary" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-none opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setCurrentSlide(p => (p === eventPhotos.length - 1 ? 0 : p + 1))}><ChevronRight className="h-4 w-4" /></Button>
                              </>
                            )}
                          </TabsContent>
                        </Tabs>
                      </section>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}