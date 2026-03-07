"use client"

import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

const Toaster = ({ ...props }: ToasterProps) => (
  <SonnerToaster
    theme="light"
    position="bottom-right"
    richColors
    {...props}
  />
)

export { Toaster }
