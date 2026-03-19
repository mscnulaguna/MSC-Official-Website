import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

/**
 * MemberPerkCard Component
 * ========================
 * Reusable card for member perks with configurable content
 * 
 * Usage:
 * <MemberPerkCard 
 *   icon="✦" 
 *   title="Exclusive Workshops"
 *   description="Lorem ipsum dolor sit amet..."
 * />
 */

interface MemberPerkCardProps {
  icon?: string | React.ReactNode
  title: string
  description: string
  className?: string
}

export function MemberPerkCard({
  icon = "✦",
  title,
  description,
  className = ""
}: MemberPerkCardProps) {
  return (
    <Card className={`border-border dark:border-border bg-background dark:bg-card hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03] rounded-xl overflow-hidden ${className}`}>
      <CardHeader>
        {typeof icon === 'string' ? (
          <div className="text-2xl md:text-3xl mb-4 text-[#00A4EF]">{icon}</div>
        ) : (
          <div className="text-2xl md:text-3xl mb-4">{icon}</div>
        )}
        <CardTitle className="text-lg md:text-xl font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
