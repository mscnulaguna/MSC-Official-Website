import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Calendar Component
 * ===================
 *
 * Month and year picker with date selection.
 * Customized to match MSC Design System.
 * Uses brand colors for selected dates.
 * Sharp styling with minimal border radius.
 */

// ... Basic calendar implementation stub
// Full implementation would require date-fns library
// For now, placeholder for showcase purposes

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: "single" | "range"
  required?: boolean
}

export function Calendar({ className, ...props }: CalendarProps) {
  const [date, setDate] = React.useState<Date>(new Date())
  const currentDate = date.getDate()
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  // Get the number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  // Create calendar days: pad with previous month days at start
  const calendarDays: (number | null)[] = []
  
  // Add padding for days from previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  
  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const handlePrevMonth = () => {
    setDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setDate(new Date(currentYear, currentMonth + 1, 1))
  }

  return (
    <div className={cn("p-4 rounded-none border border-border bg-white", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {calendarDays.map((day, i) => (
          <button
            key={i}
            disabled={day === null}
            className={cn(
              "p-2 text-xs rounded-none hover:bg-blue-50 transition-colors border border-transparent disabled:opacity-30 disabled:cursor-not-allowed",
              day === currentDate && "bg-primary text-primary-foreground font-semibold hover:bg-primary/90 border-primary"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}
