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

function getEmbedUrl(src: string): string {
  try {
    const url = new URL(src)
    const hostname = url.hostname.toLowerCase()
    
    // Handle YouTube URLs
    if (hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'm.youtube.com') {
      // Already an embed URL
      if (url.pathname.startsWith('/embed/')) {
        return src
      }
      // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.pathname === '/watch') {
        const videoId = url.searchParams.get('v')
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`
        }
      }
      return src
    }
    
    // Handle youtu.be short URLs: https://youtu.be/VIDEO_ID
    if (hostname === 'youtu.be') {
      const pathSegments = url.pathname.split('/').filter(Boolean)
      const videoId = pathSegments[0]
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
      return src
    }
    
    // Handle Vimeo URLs
    if (hostname === 'vimeo.com' || hostname === 'www.vimeo.com') {
      const pathSegments = url.pathname.split('/').filter(Boolean)
      const videoId = pathSegments[0]
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`
      }
      return src
    }
    
    // Already using Vimeo player domain
    if (hostname === 'player.vimeo.com') {
      return src
    }
    
    return src
  } catch {
    // If URL parsing fails, return the original src
    return src
  }
}

function isEmbedUrl(src: string): boolean {
  try {
    const url = new URL(src)
    const hostname = url.hostname.toLowerCase()
    return (
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'youtu.be' ||
      hostname === 'vimeo.com' ||
      hostname === 'www.vimeo.com' ||
      hostname === 'player.vimeo.com'
    )
  } catch {
    // If URL parsing fails, treat as non-embed
    return false
  }
}

export function VideoPlayer({ 
  src, 
  type = "video/mp4", 
  title = "Video Player",
  className = "" 
}: VideoPlayerProps) {
  const isEmbed = isEmbedUrl(src)
  const embedSrc = isEmbed ? getEmbedUrl(src) : src

  const videoContent = isEmbed ? (
    // YouTube/Vimeo embed
    <iframe
      className="w-full h-full rounded-none"
      src={embedSrc}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : (
    // Direct video file
    <video
      className="w-full h-full rounded-none"
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
