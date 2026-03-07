import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/mscui/button"

/**
 * Carousel Component
 * ==================
 *
 * Image and content carousel with navigation controls.
 * Smooth transitions and responsive design.
 * Customized to match MSC Design System.
 * Sharp styling with keyboard navigation support.
 */

const carouselVariants = cva("relative w-full", {
  variants: {
    size: {
      "16x9": "",
      "4x3": "",
      "1x1": "",
    },
  },
  defaultVariants: {
    size: "16x9",
  },
})

const carouselViewportVariants = cva(
  "relative overflow-hidden rounded-none bg-gray-100",
  {
    variants: {
      size: {
        "16x9": "h-96",
        "4x3": "h-80",
        "1x1": "h-80 max-w-md mx-auto",
      },
    },
    defaultVariants: {
      size: "16x9",
    },
  }
)

interface CarouselProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselVariants> {
  children: React.ReactNode[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  size,
  className,
  ...props
}: CarouselProps) {
  const [current, setCurrent] = React.useState(0)
  const count = React.Children.count(children)

  const next = () => setCurrent((current + 1) % count)
  const prev = () => setCurrent((current - 1 + count) % count)

  React.useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(next, autoPlayInterval)
    return () => clearInterval(interval)
  }, [current, autoPlay, autoPlayInterval])

  return (
    <div className={cn(carouselVariants({ size }), className)} {...props}>
      {/* Carousel Container */}
      <div className={cn(carouselViewportVariants({ size }))}>
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === current ? "opacity-100" : "opacity-0"
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        size="icon"
        variant="ghost"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === current ? "w-8 bg-white" : "w-2 bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("w-full h-full flex items-center justify-center", className)} {...props} />
  )
)
CarouselItem.displayName = "CarouselItem"

interface CarouselRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[]
  visibleCount?: number
}

export function CarouselRow({
  children,
  visibleCount = 4,
  className,
  ...props
}: CarouselRowProps) {
  const [index, setIndex] = React.useState(0)
  const count = React.Children.count(children)
  const maxIndex = Math.max(count - visibleCount, 0)
  const itemWidth = 100 / visibleCount

  const next = () => setIndex((prev) => (prev >= maxIndex ? maxIndex : prev + 1))
  const prev = () => setIndex((prev) => (prev <= 0 ? 0 : prev - 1))

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * itemWidth}%)` }}
        >
          {React.Children.map(children, (child, i) => (
            <div
              key={i}
              className="flex-none px-1"
              style={{ width: `${itemWidth}%` }}
            >
              <div className="aspect-square w-full">
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>

      {count > visibleCount && (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 hover:bg-muted"
            aria-label="Previous items"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 hover:bg-muted"
            aria-label="Next items"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
