import { Card, CardContent } from '@/components/ui/card'

/**
 * VideoPlayer Component
 * ====================
 * Shadcn-based video player supporting YouTube, Vimeo, and direct video URLs
 * 
 * Usage:
 * <VideoPlayer src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
 * <VideoPlayer src="video.mp4" type="video/mp4" />
 */

interface VideoPlayerProps {
  src: string
  type?: string
  title?: string
  className?: string
}

export function VideoPlayer({ 
  src, 
  type = "video/mp4", 
  title = "Video Player",
  className = "" 
}: VideoPlayerProps) {
  const isEmbed = src.includes('youtube.com') || src.includes('youtu.be') || src.includes('vimeo.com')

  const videoContent = isEmbed ? (
    // YouTube/Vimeo embed
    <iframe
      className="w-full h-full rounded-lg"
      src={src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : (
    // Direct video file
    <video
      className="w-full h-full rounded-lg"
      controls
      controlsList="nodownload"
    >
      <source src={src} type={type} />
      Your browser does not support the video tag.
    </video>
  )

  return (
    <Card className={`dark:bg-card border-border dark:border-border overflow-hidden ${className}`}>
      <CardContent className="p-0 aspect-video">
        {videoContent}
      </CardContent>
    </Card>
  )
}
