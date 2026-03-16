import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: 'default' | 'destructive' | 'success' | 'warning'
  open: boolean
  onOpenChange?: (open: boolean) => void
}

interface UseToastReturn {
  toast: (options: {
    title: string
    description?: string
    variant?: 'default' | 'destructive' | 'success' | 'warning'
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }) => void
  toasts: ToastItem[]
  dismiss: (toastId: string) => void
}

interface ToastContextType {
  toasts: ToastItem[]
  addToast: (toastItem: ToastItem) => void
  removeToast: (toastId: string) => void
  dismissToast: (toastId: string) => void
  timeoutIds: Map<string, ReturnType<typeof setTimeout>>
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Create the shared context
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * ToastProvider Component
 * 
 * IMPORTANT: Wrap your entire app with this provider in App.tsx or main.tsx
 * 
 * Example:
 * export default function App() {
 *   return (
 *     <ToastProvider>
 *       <AppLayout>
 *         <YourRoutes />
 *       </AppLayout>
 *     </ToastProvider>
 *   )
 * }
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutIdsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const addToast = useCallback((toastItem: ToastItem) => {
    setToasts((prev) => [toastItem, ...prev])
  }, [])

  const removeToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId))
  }, [])

  const dismissToast = useCallback((toastId: string) => {
    // Clear any pending timeout for this toast to prevent stale updates
    const timeoutId = timeoutIdsRef.current.get(toastId)
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutIdsRef.current.delete(toastId)
    }
    removeToast(toastId)
  }, [removeToast])

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    dismissToast,
    timeoutIds: timeoutIdsRef.current,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

/**
 * useToast Hook
 * 
 * REQUIRES: Your app must be wrapped with <ToastProvider>
 * 
 * Usage:
 * const { toast, toasts, dismiss } = useToast()
 * 
 * toast({
 *   title: "Success!",
 *   description: "Your action was successful",
 *   variant: "success"
 * })
 * 
 * All components calling useToast() share the same state
 * through the ToastProvider context.
 */
export function useToast(): UseToastReturn {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  const { toasts, addToast, dismissToast, timeoutIds } = context

  const dismiss = useCallback(
    (toastId: string) => {
      dismissToast(toastId)
    },
    [dismissToast]
  )

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
      open = true,
      onOpenChange,
    }: {
      title: string
      description?: string
      variant?: 'default' | 'destructive' | 'success' | 'warning'
      open?: boolean
      onOpenChange?: (open: boolean) => void
    }) => {
      const id = genId()
      const toastItem: ToastItem = {
        id,
        title,
        description,
        variant,
        open,
        onOpenChange: (isOpen) => {
          if (!isOpen) {
            dismiss(id)
          }
          onOpenChange?.(isOpen)
        },
      }
      addToast(toastItem)

      // Auto-dismiss after 5 seconds with cleanup on early dismissal
      // Store timeout ID to clear on unmount or manual dismissal, preventing memory leaks
      const timeoutId = setTimeout(() => {
        dismiss(id)
      }, 5000)
      timeoutIds.set(id, timeoutId)
    },
    [addToast, dismiss, timeoutIds]
  )

  return {
    toast,
    toasts,
    dismiss,
  }
}
