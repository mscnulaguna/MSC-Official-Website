import { useEffect, useState } from 'react'
import {
  AlertDestructive,
  AlertWarning,
  AlertSuccess,
  AlertInfo,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/msc-alert'
import { useToast } from '@/hooks/useToast'
import type { ToastItem } from '@/hooks/useToast'

/**
 * ToastManager Component
 *
 * This component manages and renders all toast notifications across the app.
 * 
 * HOW IT WORKS:
 * - Wraps with <ToastProvider> in main.tsx creates a shared state
 * - All components (and this ToastManager) read from the same toast list
 * - Toasts are created with useToast() from any component
 * - ToastManager automatically displays them in the UI
 *
 * USAGE:
 * 1. Place <ToastManager /> in your layout or root component
 * 2. In any component, import and call useToast():
 *    
 *    import { useToast } from '@/hooks/useToast'
 *    const { toast } = useToast()
 *    toast({ title: "Success!", variant: "success" })
 *
 * Variants: 'default' | 'destructive' | 'success' | 'warning'
 * 
 * Alternative: Consider using Sonner toasts for more features:
 * import { toast } from 'sonner'
 * toast("Your message")
 */
export function ToastManager() {
  const { toasts } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md pointer-events-none space-y-2">
      {toasts.map((toast: ToastItem) => {
        const Wrapper =
          toast.variant === 'destructive'
            ? AlertDestructive
            : toast.variant === 'warning'
            ? AlertWarning
            : toast.variant === 'success'
            ? AlertSuccess
            : AlertInfo

        return (
          <div key={toast.id} className="pointer-events-auto">
            <Wrapper className="mb-0">
              <AlertTitle>{toast.title}</AlertTitle>
              {toast.description && <AlertDescription>{toast.description}</AlertDescription>}
            </Wrapper>
          </div>
        )
      })}
    </div>
  )
}
