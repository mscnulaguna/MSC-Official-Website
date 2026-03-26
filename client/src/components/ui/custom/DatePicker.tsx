import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"

export interface DatePickerProps {
  label?: string
  buttonLabel?: string
  id?: string
}

export function DatePicker({
  label = "Date",
  buttonLabel = "Pick a date",
  id = "date-picker",
}: Readonly<DatePickerProps>) {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id={id}
            data-empty={!date}
            className="h-10 w-full justify-start px-3 py-2 border border-input bg-background hover:bg-secondary hover:text-secondary-foreground text-sm font-normal data-[empty=true]:text-muted-foreground"
          >
            {date ? format(date, "PPP") : <span>{buttonLabel}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-none p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePicker
