import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, X, Eye, Flag, MapPin, CalendarDays, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// Configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.msc-nulaguna.org/v1';
const DEV_MODE = true;

// Utility function to validate file type (PNG or JPG only)
const validateFileType = (file: File): boolean => {
  return ['image/png', 'image/jpeg'].includes(file.type);
};

// Utility function to crop image to 1x1 aspect ratio
const cropImageTo1x1 = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;
      ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], file.name, { type: file.type });
          resolve(croppedFile);
        } else {
          reject(new Error('Failed to crop image'));
        }
      }, file.type);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};

interface Guild {
  id: string;
  name: string;
}

const FALLBACK_GUILDS: Guild[] = [
  { id: '1', name: 'Tech Guild' },
  { id: '2', name: 'Design Guild' },
  { id: '3', name: 'Business Guild' },
];

interface Organizer {
  id: string;
  name: string;
  email: string;
  photo?: File;
}

interface Speaker {
  id: string;
  name: string;
  bio: string;
  photo?: File;
}

interface Session {
  id: string;
  time: string;
  title: string;
  speaker: string;
  description: string;
}

interface EventPhoto {
  id: string;
  file: File;
}

interface EventFormData {
  title: string;
  type: string;
  description: string;
  guildId: string;
  status: string;
  coverImage?: File;
  eventDate: string;
  eventTime: string;
  venueName: string;
  location: string;
  platformLink: string;
  maxParticipants: number;
  registrationDeadline: string;
  registrationOpen: boolean;
  requiresApproval: boolean;
  publishEvent: boolean;
  organizers: Organizer[];
  speakers: Speaker[];
  sessions: Session[];
}

// Organizer Card Component
const OrganizerCard = ({
  organizer,
  index,
  onUpdateField,
  onRemove,
  onPhotoChange,
}: {
  organizer: Organizer;
  index: number;
  onUpdateField: (field: keyof Omit<Organizer, 'photo'>, value: string) => void;
  onRemove: () => void;
  onPhotoChange: (photo: File | undefined) => void;
}) => {
  const [photoError, setPhotoError] = useState('');

  const handlePhotoChange = async (file: File | undefined) => {
    if (file) {
      if (!validateFileType(file)) {
        setPhotoError('Only PNG or JPG files are allowed');
        return;
      }
      try {
        const croppedFile = await cropImageTo1x1(file);
        setPhotoError('');
        onPhotoChange(croppedFile);
      } catch (err) {
        setPhotoError('Failed to process image');
      }
    } else {
      onPhotoChange(undefined);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Organizer {index + 1}</h3>
          {index > 0 && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Photo Upload */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-24 w-24 rounded-lg border-2 border-border flex items-center justify-center bg-muted/30 overflow-hidden">
            {organizer.photo ? (
              <img
                src={URL.createObjectURL(organizer.photo)}
                alt="Organizer"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          {photoError && <p className="text-xs text-destructive">{photoError}</p>}
          <label className="inline-block">
            <span className="text-xs text-primary hover:underline cursor-pointer">Upload photo (PNG or JPG)</span>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor={`org-name-${organizer.id}`} className="text-xs">Name</Label>
            <Input
              id={`org-name-${organizer.id}`}
              placeholder="Organizer Name"
              value={organizer.name}
              onChange={(e) => onUpdateField('name', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`org-email-${organizer.id}`} className="text-xs">Email</Label>
            <Input
              id={`org-email-${organizer.id}`}
              type="email"
              placeholder="organizer@example.com"
              value={organizer.email}
              onChange={(e) => onUpdateField('email', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Speaker Card Component
const SpeakerCard = ({
  speaker,
  index,
  onUpdateField,
  onRemove,
  onPhotoChange,
}: {
  speaker: Speaker;
  index: number;
  onUpdateField: (field: keyof Omit<Speaker, 'photo'>, value: string) => void;
  onRemove: () => void;
  onPhotoChange: (photo: File | undefined) => void;
}) => {
  const [photoError, setPhotoError] = useState('');

  const handlePhotoChange = async (file: File | undefined) => {
    if (file) {
      if (!validateFileType(file)) {
        setPhotoError('Only PNG or JPG files are allowed');
        return;
      }
      try {
        const croppedFile = await cropImageTo1x1(file);
        setPhotoError('');
        onPhotoChange(croppedFile);
      } catch (err) {
        setPhotoError('Failed to process image');
      }
    } else {
      onPhotoChange(undefined);
    }
  };

  return (
    <Card className="border-2 border-primary">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Speaker {index + 1}</h3>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Photo Upload */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-32 w-32 rounded-lg border-2 border-primary flex items-center justify-center bg-muted/30 overflow-hidden">
            {speaker.photo ? (
              <img
                src={URL.createObjectURL(speaker.photo)}
                alt="Speaker"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          {photoError && <p className="text-xs text-destructive">{photoError}</p>}
          <label className="inline-block">
            <span className="text-xs text-primary hover:underline cursor-pointer">Upload photo (PNG or JPG)</span>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor={`speaker-name-${speaker.id}`} className="text-xs">Name</Label>
            <Input
              id={`speaker-name-${speaker.id}`}
              placeholder="Speaker Name"
              value={speaker.name}
              onChange={(e) => onUpdateField('name', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`speaker-bio-${speaker.id}`} className="text-xs">Bio</Label>
            <Textarea
              id={`speaker-bio-${speaker.id}`}
              placeholder="Speaker bio..."
              value={speaker.bio}
              onChange={(e) => onUpdateField('bio', e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Session Card Component
const SessionCard = ({
  session,
  onUpdateField,
  onRemove,
}: {
  session: Session;
  onUpdateField: (field: keyof Session, value: string) => void;
  onRemove: () => void;
}) => (
  <Card>
    <CardContent className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Session</h3>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor={`session-time-${session.id}`} className="text-xs">Time</Label>
          <Input
            id={`session-time-${session.id}`}
            placeholder="10:00 AM - 11:00 AM"
            value={session.time}
            onChange={(e) => onUpdateField('time', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`session-title-${session.id}`} className="text-xs">Title</Label>
          <Input
            id={`session-title-${session.id}`}
            placeholder="Session title"
            value={session.title}
            onChange={(e) => onUpdateField('title', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`session-speaker-${session.id}`} className="text-xs">Speaker Name</Label>
          <Input
            id={`session-speaker-${session.id}`}
            placeholder="Speaker name"
            value={session.speaker}
            onChange={(e) => onUpdateField('speaker', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`session-description-${session.id}`} className="text-xs">Description</Label>
          <Textarea
            id={`session-description-${session.id}`}
            placeholder="Session description..."
            value={session.description}
            onChange={(e) => onUpdateField('description', e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Cover Image Upload Component
const CoverImageUpload = ({
  coverImage,
  onImageChange,
}: {
  coverImage?: File;
  onImageChange: (image: File | undefined) => void;
}) => {
  const [error, setError] = useState('');

  const handleImageChange = async (file: File | undefined) => {
    if (file) {
      if (!validateFileType(file)) {
        setError('Only PNG or JPG files are allowed');
        return;
      }
      try {
        const croppedFile = await cropImageTo1x1(file);
        setError('');
        onImageChange(croppedFile);
      } catch (err) {
        setError('Failed to process image');
      }
    } else {
      onImageChange(undefined);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-32 w-full rounded-lg border-2 border-border flex items-center justify-center bg-muted/30 overflow-hidden">
        {coverImage ? (
          <img
            src={URL.createObjectURL(coverImage)}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <label className="inline-block">
        <span className="text-xs text-primary hover:underline cursor-pointer">Upload cover image (PNG or JPG)</span>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => handleImageChange(e.target.files?.[0])}
          className="hidden"
        />
      </label>
    </div>
  );
};

// Event Photos Component with Slideshow and Gallery
const EventPhotosComponent = ({
  photos,
  onAddPhotos,
  onRemovePhoto,
}: {
  photos: EventPhoto[];
  onAddPhotos: (files: File[]) => void;
  onRemovePhoto: (id: string) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    for (const file of files) {
      if (!validateFileType(file)) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    }

    if (invalidFiles.length > 0) {
      setUploadError(`Invalid file types: ${invalidFiles.join(', ')}. Only PNG and JPG allowed.`);
    } else {
      setUploadError('');
    }

    if (validFiles.length > 0) {
      onAddPhotos(validFiles);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Event Photos</h3>
          <p className="text-sm text-muted-foreground">Upload photos that will appear in the event gallery after the event.</p>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-sm font-semibold mb-1">Drag and drop images here</p>
          <p className="text-xs text-muted-foreground">or</p>
          <label className="inline-block mt-2">
            <span className="text-xs text-primary hover:underline cursor-pointer">browse files (PNG or JPG)</span>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg"
              onChange={(e) => {
                if (e.target.files) {
                  processFiles(Array.from(e.target.files));
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}

        {photos.length > 0 && (
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="slideshow">Slideshow</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="slideshow" className="space-y-4">
                {photos.length > 0 && (
                  <div className="space-y-4">
                    <div className="relative bg-muted/30 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(photos[currentSlide].file)}
                        alt={`Slide ${currentSlide + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {photos.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute left-2 top-1/2 -translate-y-1/2"
                            onClick={prevSlide}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={nextSlide}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {photos.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {photos.map((photo, index) => (
                          <button
                            key={photo.id}
                            onClick={() => setCurrentSlide(index)}
                            className={`flex-shrink-0 h-16 w-16 rounded border-2 overflow-hidden ${
                              currentSlide === index ? 'border-primary' : 'border-border'
                            }`}
                          >
                            <img
                              src={URL.createObjectURL(photo.file)}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative border border-border rounded overflow-hidden bg-muted/30 aspect-square flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setPreviewImage(URL.createObjectURL(photo.file))}
                    >
                      <img
                        src={URL.createObjectURL(photo.file)}
                        alt="Gallery item"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute inset-0 h-full w-full opacity-0 group-hover:opacity-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePhoto(photo.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
            <div className="relative max-w-3xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              <img src={previewImage} alt="Preview" className="w-full h-full object-contain rounded-lg" />
              <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => setPreviewImage(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Create Event Page Component
export default function CreateNewEventPage() {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    type: '',
    description: '',
    guildId: '',
    status: 'draft',
    coverImage: undefined,
    eventDate: '',
    eventTime: '',
    venueName: '',
    location: '',
    platformLink: '',
    maxParticipants: 0,
    registrationDeadline: '',
    registrationOpen: true,
    requiresApproval: false,
    publishEvent: false,
    organizers: [{ id: '1', name: '', email: '' }],
    speakers: [],
    sessions: [],
  });

  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Fetch guilds on mount
  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const response = await fetch(`${API_BASE}/guilds`);
        if (response.ok) {
          const data = await response.json();
          setGuilds(data.data || []);
        } else {
          setGuilds(FALLBACK_GUILDS);
        }
      } catch {
        setGuilds(FALLBACK_GUILDS);
      }
    };
    fetchGuilds();
  }, []);

  // Update form field
  const updateFormField = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Organizer handlers
  const handleAddOrganizer = () => {
    const newOrganizer: Organizer = {
      id: Date.now().toString(),
      name: '',
      email: '',
    };
    setFormData(prev => ({
      ...prev,
      organizers: [...prev.organizers, newOrganizer],
    }));
  };

  const handleUpdateOrganizer = (id: string, field: keyof Omit<Organizer, 'photo'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      organizers: prev.organizers.map(org =>
        org.id === id ? { ...org, [field]: value } : org
      ),
    }));
  };

  const handleOrganizerPhotoChange = (id: string, photo: File | undefined) => {
    setFormData(prev => ({
      ...prev,
      organizers: prev.organizers.map(org =>
        org.id === id ? { ...org, photo } : org
      ),
    }));
  };

  const handleRemoveOrganizer = (id: string) => {
    setFormData(prev => ({
      ...prev,
      organizers: prev.organizers.filter(org => org.id !== id),
    }));
  };

  // Speaker handlers
  const handleAddSpeaker = () => {
    const newSpeaker: Speaker = {
      id: Date.now().toString(),
      name: '',
      bio: '',
    };
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, newSpeaker],
    }));
  };

  const handleUpdateSpeaker = (id: string, field: keyof Omit<Speaker, 'photo'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.map(speaker =>
        speaker.id === id ? { ...speaker, [field]: value } : speaker
      ),
    }));
  };

  const handleSpeakerPhotoChange = (id: string, photo: File | undefined) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.map(speaker =>
        speaker.id === id ? { ...speaker, photo } : speaker
      ),
    }));
  };

  const handleRemoveSpeaker = (id: string) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter(speaker => speaker.id !== id),
    }));
  };

  // Session handlers
  const handleAddSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      time: '',
      title: '',
      speaker: '',
      description: '',
    };
    setFormData(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
    }));
  };

  const handleUpdateSession = (id: string, field: keyof Session, value: string) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.map(session =>
        session.id === id ? { ...session, [field]: value } : session
      ),
    }));
  };

  const handleRemoveSession = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.filter(session => session.id !== id),
    }));
  };

  // Event Photos handlers
  const handleAddPhotos = (files: File[]) => {
    const newPhotos = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      file,
    }));
    setEventPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (id: string) => {
    setEventPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  // Preview handler
  const handleOpenPreview = () => {
    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }
    setError('');
    setShowPreview(true);
  };

  // Confirmation handlers
  const handleConfirmCreate = () => {
    setShowConfirmDialog(false);
    handleCreateEvent();
  };

  // Create event handler
  const handleCreateEvent = async () => {
    setLoading(true);
    try {
      if (DEV_MODE) {
        console.log('DEV MODE: Event data:', formData);
        setLoading(false);
        alert(`Event "${formData.title}" created successfully (DEV MODE)`);
        // Reset form
        setFormData({
          title: '',
          type: '',
          description: '',
          guildId: '',
          status: 'draft',
          coverImage: undefined,
          eventDate: '',
          eventTime: '',
          venueName: '',
          location: '',
          platformLink: '',
          maxParticipants: 0,
          registrationDeadline: '',
          registrationOpen: true,
          requiresApproval: false,
          publishEvent: false,
          organizers: [{ id: '1', name: '', email: '' }],
          speakers: [],
          sessions: [],
        });
        setEventPhotos([]);
        setShowPreview(false);
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('type', formData.type);
      formDataObj.append('description', formData.description);
      formDataObj.append('guildId', formData.guildId);
      formDataObj.append('status', formData.status);
      formDataObj.append('eventDate', formData.eventDate);
      formDataObj.append('eventTime', formData.eventTime);
      formDataObj.append('venueName', formData.venueName);
      formDataObj.append('location', formData.location);
      formDataObj.append('platformLink', formData.platformLink);
      formDataObj.append('maxParticipants', formData.maxParticipants.toString());
      formDataObj.append('registrationDeadline', formData.registrationDeadline);
      formDataObj.append('registrationOpen', formData.registrationOpen.toString());
      formDataObj.append('requiresApproval', formData.requiresApproval.toString());
      formDataObj.append('publishEvent', formData.publishEvent.toString());
      formDataObj.append('organizers', JSON.stringify(formData.organizers));
      formDataObj.append('speakers', JSON.stringify(formData.speakers));
      formDataObj.append('sessions', JSON.stringify(formData.sessions));

      if (formData.coverImage) {
        formDataObj.append('coverImage', formData.coverImage);
      }

      eventPhotos.forEach((photo, index) => {
        formDataObj.append(`photos[${index}]`, photo.file);
      });

      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        alert(`Event "${formData.title}" created successfully!`);
        setShowPreview(false);
        // Reset form
        setFormData({
          title: '',
          type: '',
          description: '',
          guildId: '',
          status: 'draft',
          coverImage: undefined,
          eventDate: '',
          eventTime: '',
          venueName: '',
          location: '',
          platformLink: '',
          maxParticipants: 0,
          registrationDeadline: '',
          registrationOpen: true,
          requiresApproval: false,
          publishEvent: false,
          organizers: [{ id: '1', name: '', email: '' }],
          speakers: [],
          sessions: [],
        });
        setEventPhotos([]);
      } else {
        setError('Failed to create event');
      }
    } catch (err) {
      setError('Error creating event: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <section className="section-container py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Event</h1>
            <p className="mt-2 text-muted-foreground">Create a new event for your guild</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenPreview}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview Event
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-fit">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="speakers">Speakers</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="photos">Event Photos</TabsTrigger>
          </TabsList>

          {/* DETAILS TAB */}
          <TabsContent value="details" className="space-y-6">
            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Event Details</h2>
                  <p className="text-sm text-muted-foreground">Basic information about your event.</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={(e) => updateFormField('title', e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select value={formData.type} onValueChange={(value) => updateFormField('type', value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guild">Guild</Label>
                    <Select value={formData.guildId} onValueChange={(value) => updateFormField('guildId', value)}>
                      <SelectTrigger id="guild">
                        <SelectValue placeholder="Select guild" />
                      </SelectTrigger>
                      <SelectContent>
                        {guilds.map(guild => (
                          <SelectItem key={guild.id} value={guild.id}>{guild.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormField('status', value)}>
                    <SelectTrigger id="status">
                      {formData.status === 'upcoming' && <Badge>Upcoming</Badge>}
                      {formData.status === 'completed' && <Badge variant="success">Completed</Badge>}
                      {formData.status === 'draft' && <Badge variant="outline">Draft</Badge>}
                      {!formData.status && <SelectValue placeholder="Select status" />}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter event description"
                    value={formData.description}
                    onChange={(e) => updateFormField('description', e.target.value)}
                    className="resize-none"
                    rows={4}
                  />
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <CoverImageUpload
                    coverImage={formData.coverImage}
                    onImageChange={(image) => updateFormField('coverImage', image)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Event Schedule Card */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Event Schedule</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => updateFormField('eventDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventTime">Event Time</Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => updateFormField('eventTime', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Venue Card */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Venue</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue Name</Label>
                  <Input
                    id="venue"
                    placeholder="e.g., Lecture Hall A"
                    value={formData.venueName}
                    onChange={(e) => updateFormField('venueName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Building B, Floor 3"
                    value={formData.location}
                    onChange={(e) => updateFormField('location', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform Link (Optional)</Label>
                  <Input
                    id="platform"
                    placeholder="e.g., https://teams.microsoft.com/..."
                    value={formData.platformLink}
                    onChange={(e) => updateFormField('platformLink', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Registration Card */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Registration</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      placeholder="0 for unlimited"
                      value={formData.maxParticipants}
                      onChange={(e) => updateFormField('maxParticipants', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Registration Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={(e) => updateFormField('registrationDeadline', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="registrationOpen"
                      checked={formData.registrationOpen}
                      onCheckedChange={(checked) => updateFormField('registrationOpen', checked)}
                    />
                    <Label htmlFor="registrationOpen" className="font-normal">Registration is open</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="requiresApproval"
                      checked={formData.requiresApproval}
                      onCheckedChange={(checked) => updateFormField('requiresApproval', checked)}
                    />
                    <Label htmlFor="requiresApproval" className="font-normal">Requires approval</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="publishEvent"
                      checked={formData.publishEvent}
                      onCheckedChange={(checked) => updateFormField('publishEvent', checked)}
                    />
                    <Label htmlFor="publishEvent" className="font-normal">Publish event</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizers Card */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Organizers</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.organizers.map((organizer, index) => (
                  <OrganizerCard
                    key={organizer.id}
                    organizer={organizer}
                    index={index}
                    onUpdateField={(field, value) =>
                      handleUpdateOrganizer(organizer.id, field, value)
                    }
                    onPhotoChange={(photo) =>
                      handleOrganizerPhotoChange(organizer.id, photo)
                    }
                    onRemove={() => handleRemoveOrganizer(organizer.id)}
                  />
                ))}
                <Button variant="outline" onClick={handleAddOrganizer} className="w-full">
                  + Add Organizer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SPEAKERS TAB */}
          <TabsContent value="speakers" className="space-y-6">
            <div className="flex justify-center">
              <div className="grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
                {formData.speakers.map((speaker, index) => (
                  <div key={speaker.id} className="col-span-1">
                    <SpeakerCard
                      speaker={speaker}
                      index={index}
                      onUpdateField={(field, value) =>
                        handleUpdateSpeaker(speaker.id, field, value)
                      }
                      onPhotoChange={(photo) =>
                        handleSpeakerPhotoChange(speaker.id, photo)
                      }
                      onRemove={() => handleRemoveSpeaker(speaker.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleAddSpeaker}>
                + Add Speaker
              </Button>
            </div>
          </TabsContent>

          {/* AGENDA TAB */}
          <TabsContent value="agenda" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Agenda</h2>
                  <p className="text-sm text-muted-foreground">Create the Event Schedule</p>
                </div>
              </CardHeader>
            </Card>

            <div className="flex justify-center">
              <div className="max-w-3xl w-full space-y-4">
                {formData.sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onUpdateField={(field, value) =>
                      handleUpdateSession(session.id, field, value)
                    }
                    onRemove={() => handleRemoveSession(session.id)}
                  />
                ))}
                <Button variant="outline" onClick={handleAddSession} className="w-full">
                  + Add Session
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* EVENT PHOTOS TAB */}
          <TabsContent value="photos" className="space-y-6">
            <EventPhotosComponent
              photos={eventPhotos}
              onAddPhotos={handleAddPhotos}
              onRemovePhoto={handleRemovePhoto}
            />
          </TabsContent>
        </Tabs>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex gap-4 pb-16">
          <Button variant="outline" className="w-1/4" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button
            className="w-3/4"
            onClick={() => setShowConfirmDialog(true)}
            disabled={loading || !formData.title.trim()}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </div>

        {/* PREVIEW - Full Page Overlay */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
            <div className="w-full border-b border-border">
              {/* Cover Image Placeholder */}
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-muted to-muted/50 sm:h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">[Event Cover Image Preview]</p>
                </div>
                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-44 bg-gradient-to-l from-background to-transparent sm:w-72" />
              </div>
            </div>

            <section className="section-container section-padding-md">
              <div className="grid gap-8 pt-2 sm:pt-4 lg:grid-cols-[1fr_360px]">
                {/* LEFT COLUMN - Main Content */}
                <div className="space-y-6">
                  <section aria-label="Event details" className="space-y-6">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h1 className="text-3xl font-bold sm:text-4xl">{formData.title || 'Untitled Event'}</h1>
                        <div>
                          {formData.status === 'upcoming' && <Badge>Upcoming</Badge>}
                          {formData.status === 'completed' && <Badge variant="success">Completed</Badge>}
                          {formData.status === 'draft' && <Badge variant="outline">Draft</Badge>}
                        </div>
                      </div>
                    </div>

                    {formData.description && (
                      <div className="space-y-2">
                        <h2 className="text-lg font-bold">About</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">{formData.description}</p>
                      </div>
                    )}

                    {/* Organized By Section */}
                    {formData.organizers.some(o => o.name) && (
                      <div className="space-y-3">
                        <Separator />
                        <h2 className="text-lg font-bold">Organized by</h2>
                        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
                          {formData.organizers.map((org) =>
                            org.name ? (
                              <div key={org.id} className="flex w-full max-w-sm items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {org.photo ? (
                                    <img src={URL.createObjectURL(org.photo)} alt={org.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-xs font-semibold text-muted-foreground">
                                      {org.name
                                        .split(' ')
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((n) => n[0].toUpperCase())
                                        .join('')}
                                    </span>
                                  )}
                                </div>
                                <div className="leading-tight">
                                  <p className="text-sm font-semibold">{org.name}</p>
                                  {org.email && <p className="text-xs text-muted-foreground">{org.email}</p>}
                                </div>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Speakers Section */}
                  {formData.speakers.some(s => s.name) && (
                    <section aria-label="Event speakers" className="space-y-4 pt-12">
                      <h2 className="text-2xl font-bold text-center">Event Speakers</h2>
                      <div className="mx-auto grid max-w-5xl justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {formData.speakers.map((speaker, index) =>
                          speaker.name ? (
                            <Card key={speaker.id} className="border-2 border-primary w-full max-w-sm">
                              <CardContent className="space-y-2 p-4 text-center">
                                <div className="mx-auto h-32 w-32 rounded-lg border-2 border-primary flex items-center justify-center bg-muted/30 overflow-hidden">
                                  {speaker.photo ? (
                                    <img
                                      src={URL.createObjectURL(speaker.photo)}
                                      alt={speaker.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs font-semibold text-muted-foreground">
                                      {speaker.name
                                        .split(' ')
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((n) => n[0].toUpperCase())
                                        .join('')}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground font-medium">Speaker {index + 1}</p>
                                  <p className="text-sm font-semibold">{speaker.name}</p>
                                  {speaker.bio ? (
                                    <p className="text-xs text-muted-foreground line-clamp-2">{speaker.bio}</p>
                                  ) : (
                                    <p className="text-xs text-muted-foreground">Speaker</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ) : null
                        )}
                      </div>
                    </section>
                  )}

                  {/* Agenda Section */}
                  {formData.sessions.some(s => s.title) && (
                    <section aria-label="Event agenda" className="space-y-4 pt-12">
                      <h2 className="text-2xl font-bold text-center">Event Agenda</h2>
                      <div className="mx-auto w-full max-w-3xl space-y-3">
                        {formData.sessions.map((session) =>
                          session.title ? (
                            <Card key={session.id}>
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold">{session.title}</h3>
                                  {session.time && (
                                    <span className="text-xs font-semibold text-muted-foreground">{session.time}</span>
                                  )}
                                </div>
                                {session.speaker && <p className="text-sm text-muted-foreground">Speaker: {session.speaker}</p>}
                                {session.description && <p className="text-sm text-muted-foreground leading-relaxed">{session.description}</p>}
                              </CardContent>
                            </Card>
                          ) : null
                        )}
                      </div>
                    </section>
                  )}

                  {/* Event Photos Section */}
                  {eventPhotos.length > 0 && (
                    <section aria-label="Event photos" className="space-y-4 pt-12">
                      <h2 className="text-2xl font-bold text-center">Event Photos</h2>
                      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {eventPhotos.map((photo) => (
                          <div key={photo.id} className="group w-full overflow-hidden border border-border rounded bg-muted/30 transition-colors hover:border-primary aspect-square flex items-center justify-center">
                            <img
                              src={URL.createObjectURL(photo.file)}
                              alt="Event photo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* RIGHT COLUMN - Info Card */}
                <div className="space-y-4 h-fit">
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-bold">What you need to know</h3>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {formData.type && (
                        <div className="flex items-start gap-3">
                          <Flag className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">Event Type</p>
                            <p className="text-muted-foreground">{formData.type}</p>
                          </div>
                        </div>
                      )}
                      {formData.eventDate && (
                        <div className="flex items-start gap-3">
                          <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">Event Date</p>
                            <p className="text-muted-foreground">{formData.eventDate}</p>
                          </div>
                        </div>
                      )}
                      {formData.eventTime && (
                        <div className="flex items-start gap-3">
                          <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">Event Time</p>
                            <p className="text-muted-foreground">{formData.eventTime}</p>
                          </div>
                        </div>
                      )}
                      {formData.venueName && (
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">Venue</p>
                            <p className="text-muted-foreground">{formData.venueName}</p>
                          </div>
                        </div>
                      )}
                      {formData.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">Location</p>
                            <p className="text-muted-foreground">{formData.location}</p>
                          </div>
                        </div>
                      )}
                      {formData.registrationDeadline && (
                        <div className="flex items-start gap-3">
                          <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">Registration Deadline</p>
                            <p className="text-muted-foreground">{formData.registrationDeadline}</p>
                          </div>
                        </div>
                      )}
                      {formData.maxParticipants > 0 && (
                        <div className="flex items-start gap-3">
                          <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">Max Participants</p>
                            <p className="text-muted-foreground">{formData.maxParticipants}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Button variant="outline" onClick={() => setShowPreview(false)} className="w-full">
                    Close Preview
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CONFIRMATION ALERT DIALOG */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create Event?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to create "{formData.title}"? This action cannot be undone immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmCreate} disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </Layout>
  );
}
