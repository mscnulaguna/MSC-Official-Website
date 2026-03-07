import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-none border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#000000] placeholder:text-[#CBD5E1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A2ED] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
