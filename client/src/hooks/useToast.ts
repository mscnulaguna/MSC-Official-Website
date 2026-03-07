'use client'

import { useCallback, useState } from 'react'

interface ToastItem {
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

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId))
  }, [])

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
      setToasts((prev) => [toastItem, ...prev])

      // Auto-dismiss after 5 seconds (user can close earlier)
      setTimeout(() => {
        dismiss(id)
      }, 5000)
    },
    [dismiss]
  )

  return {
    toast,
    toasts,
    dismiss,
  }
}
