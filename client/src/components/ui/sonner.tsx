import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

const Toaster = ({ ...props }: ToasterProps) => (
  <>
    <style>{`
      /* ==================== SONNER TOAST BOXED STYLING ==================== */
      .toaster-item {
        border-radius: 0 !important;
      }

      .sonner-toast {
        border-radius: 0 !important;
        border: 2px solid var(--info) !important;
        background-color: #F0F9FF !important;
        color: #074468 !important;
        padding: 16px !important;
        box-shadow: 0 4px 12px #00000014 !important;
        transition: all 0.3s ease !important;
      }

      .sonner-toast:hover {
        box-shadow: 0 6px 16px #0000001f !important;
      }

      /* Success Toast */
      .sonner-toast.sonner-toast-success {
        border-color: var(--success) !important;
        background-color: #F0FDF4 !important;
        color: #14532d !important;
      }

      /* Error Toast */
      .sonner-toast.sonner-toast-error {
        border-color: var(--destructive) !important;
        background-color: #FEF2F0 !important;
        color: #7f1d14 !important;
      }

      /* Warning Toast */
      .sonner-toast.sonner-toast-warning {
        border-color: var(--warning) !important;
        background-color: #FEF8F0 !important;
        color: #5c3317 !important;
      }

      /* Default/Info Toast */
      .sonner-toast.sonner-toast-default {
        border-color: var(--info) !important;
        background-color: #F0F9FF !important;
        color: #074468 !important;
      }

      /* Toast Title */
      .sonner-toast-title {
        font-weight: 700 !important;
        font-size: 15px !important;
        color: inherit !important;
      }

      /* Toast Description */
      .sonner-toast-description {
        font-size: 13px !important;
        color: inherit !important;
        opacity: 0.85 !important;
        margin-top: 4px !important;
        font-weight: 400 !important;
      }

      /* Close Button */
      .sonner-close-button {
        border-radius: 0 !important;
        background-color: transparent !important;
        color: currentColor !important;
        opacity: 0.6 !important;
        transition: opacity 0.2s !important;
      }

      .sonner-close-button:hover {
        opacity: 1 !important;
      }

      /* Action Button */
      .sonner-toast button {
        border-radius: 0 !important;
        border: 2px solid var(--info) !important;
        background-color: transparent !important;
        color: var(--info) !important;
        padding: 8px 16px !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        transition: all 0.2s !important;
        cursor: pointer !important;
      }

      .sonner-toast button:hover {
        background-color: var(--primary-hover) !important;
        color: #FFFFFF !important;
      }

      .sonner-toast button:active {
        transform: scale(0.98) !important;
      }

      /* Remove border-radius from all nested elements */
      .sonner-toast * {
        border-radius: 0 !important;
      }
    `}</style>
    <SonnerToaster
      theme="light"
      position="bottom-right"
      richColors
      {...props}
    />
  </>
)

export { Toaster }
