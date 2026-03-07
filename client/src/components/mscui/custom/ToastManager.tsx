'use client'

import { useEffect, useState } from 'react'
import {
  AlertDestructive,
  AlertWarning,
  AlertSuccess,
  AlertInfo,
  AlertTitle,
  AlertDescription,
} from '@/components/mscui/msc-alert'
import { useToast } from '@/hooks/useToast'

/**
 * ToastManager Component
 *
 * This component should be placed in your layout or root component.
 * It manages all toast notifications and renders them in the viewport.
 *
 * Usage:
 * 1. Import useToast hook in your component
 * 2. Call const { toast } = useToast()
 * 3. Call toast({ title: "Success!", variant: "success" })
 *
 * Variants: 'default' | 'destructive' | 'success' | 'warning'
 */
export function ToastManager() {
  const { toasts } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {toasts.map((toast: any) => {
        const Wrapper =
          toast.variant === 'destructive'
            ? AlertDestructive
            : toast.variant === 'warning'
            ? AlertWarning
            : toast.variant === 'success'
            ? AlertSuccess
            : AlertInfo

        return (
          <Wrapper key={toast.id} className="mb-2">
            <AlertTitle>{toast.title}</AlertTitle>
            {toast.description && <AlertDescription>{toast.description}</AlertDescription>}
          </Wrapper>
        )
      })}
    </>
  )
}
